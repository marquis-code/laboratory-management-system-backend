import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, type HydratedDocument, Model } from 'mongoose';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import { verify } from 'jsonwebtoken';
import type { AuthResponse, Lab, User } from '@lims/shared';
import { parseTtlSeconds } from '../../common/config/env';
import {
  isRefreshTokenPayload,
  type AccessTokenPayload,
  type AuthenticatedUser,
  type RefreshTokenPayload,
} from '../../common/auth/authenticated-user';
import { runWithSystemTenant, runWithTenant } from '../../common/context/tenant-context';
import { hashPassword, hashToken, verifyPassword } from '../../common/utils/crypto';
import { toLab, toUser } from '../../common/serializers/entities';
import { AuditService } from '../audit/audit.service';
import { LabModelName, type LabEntity } from '../labs/lab.schema';
import { UserModelName, type UserEntity } from '../users/user.schema';
import type { LoginDto } from './dto/auth.dto';
import { OrganizationModelName, type OrganizationEntity } from '../platform/organization.schema';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface MeResponse {
  user: User;
  lab: Lab;
}

function createPlatformLab(email: string, baseLab?: LabEntity | null): Lab {
  if (baseLab) {
    const serialized = toLab(baseLab);
    return {
      ...serialized,
      id: 'platform',
      code: 'PLATFORM',
      name: 'Platform Administration',
    };
  }
  return {
    id: 'platform',
    code: 'PLATFORM',
    name: 'Platform Administration',
    address: null,
    phone: null,
    email: email,
    accessionPrefix: 'PLT',
    accessionFormat: 'PLT-{YYYY}-{SEQ:6}',
    tatHours: { FROZEN: 1, URGENT: 24, ROUTINE: 72 },
    tatWarningPercent: 80,
    timezone: 'Africa/Lagos',
    qaSamplingPercent: 10,
    currency: 'NGN',
    enabledDisciplines: ['HISTOPATHOLOGY', 'HAEMATOLOGY', 'CHEMICAL_PATHOLOGY', 'MICROBIOLOGY'],
    accessionPrefixes: {},
    organizationId: null,
    onboardingCompletedAt: new Date().toISOString(),
    letterhead: {
      phone: null,
      email: email,
      website: null,
      pathologistName: null,
      pathologistTitle: null,
      qualifications: null,
      signatureText: null,
      footerNote: null,
    },
    active: true,
    createdAt: new Date().toISOString(),
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModelName) private readonly userModel: Model<UserEntity>,
    @InjectModel(LabModelName) private readonly labModel: Model<LabEntity>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly audit: AuditService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(OrganizationModelName)
    private readonly organizationModel: Model<OrganizationEntity>,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponse> {
    let lab: LabEntity | null = null;
    let targetUser: HydratedDocument<UserEntity> | null = null;

    if (dto.labCode) {
      lab = await this.labModel
        .findOne({ code: dto.labCode.toUpperCase(), active: true })
        .exec();
      if (!lab) throw new UnauthorizedException('Invalid laboratory code, email or password.');
      if (lab.organizationId) {
        const organization = await this.organizationModel.findById(lab.organizationId).exec();
        if (organization?.status === 'SUSPENDED')
          throw new UnauthorizedException('This organization is suspended.');
      }

      const labId = lab._id.toString();
      targetUser = await runWithTenant({ labId }, async () => {
        return this.userModel
          .findOne({ email: dto.email.toLowerCase() })
          .select('+passwordHash')
          .exec();
      });

      if (!targetUser || !targetUser.active) {
        throw new UnauthorizedException('Invalid laboratory code, email or password.');
      }
      const valid = await verifyPassword(dto.password, targetUser.passwordHash);
      if (!valid) {
        throw new UnauthorizedException('Invalid laboratory code, email or password.');
      }
    } else {
      // Platform / super administrator login without a laboratory code
      const candidates = await runWithSystemTenant('platform-login-lookup', 'system', async () => {
        return this.userModel
          .find({ email: dto.email.toLowerCase(), active: true })
          .select('+passwordHash')
          .exec();
      });

      if (!candidates || candidates.length === 0) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      // Prioritize SUPER_ADMIN accounts first if multiple accounts share an email
      const sortedCandidates = [...candidates].sort((a, b) => {
        if (a.role === 'SUPER_ADMIN') return -1;
        if (b.role === 'SUPER_ADMIN') return 1;
        return 0;
      });

      for (const candidate of sortedCandidates) {
        const valid = await verifyPassword(dto.password, candidate.passwordHash);
        if (valid) {
          targetUser = candidate;
          break;
        }
      }

      if (!targetUser) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      if (targetUser.labId) {
        lab = await this.labModel.findById(targetUser.labId).exec();
      }
      if (!lab) {
        lab = await this.labModel.findOne({ active: true }).exec();
      }
      if (!lab) {
        throw new UnauthorizedException('No active laboratory available for platform administration.');
      }
      if (lab.organizationId) {
        const organization = await this.organizationModel.findById(lab.organizationId).exec();
        if (organization?.status === 'SUSPENDED')
          throw new UnauthorizedException('This organization is suspended.');
      }
    }

    const isSuperAdmin = targetUser.role === 'SUPER_ADMIN';
    const labId = targetUser.labId?.toString() || lab?._id?.toString() || 'platform';
    const tenantStore = isSuperAdmin
      ? { labId, system: true, reason: 'superadmin-session' }
      : { labId };

    return runWithTenant(tenantStore, async () => {
      const user = targetUser!;
      const tokens = await this.signTokens(user);
      user.refreshTokenHash = hashToken(tokens.refreshToken);
      user.lastLoginAt = new Date();
      await user.save();

      await this.audit.record({
        action: 'LOGIN',
        entityType: 'User',
        entityId: user._id.toString(),
        metadata: {
          platformScope: isSuperAdmin,
          labCode: isSuperAdmin ? 'PLATFORM' : lab?.code,
        },
        actor: { userId: user._id.toString(), userName: user.name, userRole: user.role },
      });

      const labPayload: Lab = isSuperAdmin
        ? createPlatformLab(user.email, lab)
        : toLab(lab!);

      return {
        ...tokens,
        user: toUser(user),
        lab: labPayload,
      };
    });
  }

  async acceptInvite(token: string, password: string): Promise<AuthResponse> {
    const raw = await this.connection.collection('users').findOne({
      invitationTokenHash: hashToken(token),
      invitationExpiresAt: { $gt: new Date() },
    });
    if (!raw) throw new UnauthorizedException('This invitation is invalid or has expired.');
    const labId = raw.labId.toString();
    return runWithTenant({ labId }, async () => {
      const user = await this.userModel.findById(raw._id).select('+passwordHash').exec();
      if (!user || !user.active)
        throw new UnauthorizedException('This invitation is no longer available.');
      user.passwordHash = await hashPassword(password);
      user.mustChangePassword = false;
      user.invitationTokenHash = null;
      user.invitationExpiresAt = null;
      user.refreshTokenHash = null;
      await user.save();
      const lab = await this.labModel.findById(labId).exec();
      if (!lab) throw new UnauthorizedException('Laboratory is no longer available.');
      const tokens = await this.signTokens(user);
      user.refreshTokenHash = hashToken(tokens.refreshToken);
      await user.save();
      if (user.role === 'LAB_ADMIN' && lab.organizationId) {
        await this.organizationModel.updateOne(
          { _id: lab.organizationId, status: 'ONBOARDING' },
          { $set: { status: 'ACTIVE' } },
        );
      }
      await this.audit.record({
        action: 'LOGIN',
        entityType: 'User',
        entityId: user._id.toString(),
        metadata: { labCode: lab.code, method: 'invitation' },
        actor: { userId: user._id.toString(), userName: user.name, userRole: user.role },
      });
      return { ...tokens, user: toUser(user), lab: toLab(lab) };
    });
  }

  async portalSession(userId: string): Promise<AuthResponse> {
    const user = await this.userModel.findById(userId).exec();
    if (!user || !user.active || user.role !== 'REFERRER') {
      throw new UnauthorizedException('This referral account is not available.');
    }
    const lab = await this.labModel.findById(user.labId).exec();
    if (!lab) throw new UnauthorizedException('Laboratory is no longer available.');
    const tokens = await this.signTokens(user);
    user.refreshTokenHash = hashToken(tokens.refreshToken);
    user.lastLoginAt = new Date();
    await user.save();
    await this.audit.record({
      action: 'LOGIN',
      entityType: 'User',
      entityId: user._id.toString(),
      metadata: { method: 'referral-magic-link', labCode: lab.code },
    });
    return { ...tokens, user: toUser(user), lab: toLab(lab) };
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    let payload: RefreshTokenPayload;
    try {
      const raw = verify(refreshToken, this.config.getOrThrow<string>('JWT_REFRESH_SECRET'));
      if (!isRefreshTokenPayload(raw)) throw new Error('Wrong token type.');
      payload = raw;
    } catch {
      throw new UnauthorizedException('Session expired. Sign in again.');
    }

    const user = await runWithSystemTenant('refresh-lookup', 'platform', () =>
      this.userModel.findById(payload.sub).select('+refreshTokenHash').exec(),
    );
    if (!user || !user.active || !user.refreshTokenHash) {
      throw new UnauthorizedException('Session expired. Sign in again.');
    }
    const providedHash = hashToken(refreshToken);
    const expected = Buffer.from(user.refreshTokenHash, 'utf8');
    const provided = Buffer.from(providedHash, 'utf8');
    if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
      throw new UnauthorizedException('Session expired. Sign in again.');
    }

    const isSuperAdmin = user.role === 'SUPER_ADMIN';
    const labId = user.labId?.toString() || payload.labId || 'platform';
    const tenantStore = isSuperAdmin
      ? { labId, system: true, reason: 'superadmin-refresh' }
      : { labId };

    return runWithTenant(tenantStore, async () => {
      const tokens = await this.signTokens(user);
      user.refreshTokenHash = hashToken(tokens.refreshToken);
      await user.save();

      let lab: LabEntity | null = null;
      if (user.labId) {
        lab = await this.labModel.findById(user.labId).exec();
      }
      if (!lab && !isSuperAdmin) {
        throw new UnauthorizedException('Laboratory is no longer available.');
      }

      const labPayload: Lab = isSuperAdmin
        ? createPlatformLab(user.email, lab)
        : toLab(lab!);

      return { ...tokens, user: toUser(user), lab: labPayload };
    });
  }

  async logout(user: AuthenticatedUser): Promise<{ success: true }> {
    const isSuperAdmin = user.role === 'SUPER_ADMIN';
    const runLookup = () => this.userModel.findById(user.id).exec();
    const stored = isSuperAdmin
      ? await runWithSystemTenant('logout-lookup', 'platform', runLookup)
      : await runLookup();
    if (stored) {
      stored.refreshTokenHash = null;
      await stored.save();
    }
    await this.audit.record({
      action: 'LOGOUT',
      entityType: 'User',
      entityId: user.id,
    });
    return { success: true };
  }

  async me(userId: string): Promise<MeResponse> {
    const user = await runWithSystemTenant('me-lookup', 'platform', () =>
      this.userModel.findById(userId).exec(),
    );
    if (!user) throw new UnauthorizedException('Account not found.');

    if (user.role === 'SUPER_ADMIN') {
      const lab = user.labId ? await this.labModel.findById(user.labId).exec() : null;
      return {
        user: toUser(user),
        lab: createPlatformLab(user.email, lab),
      };
    }

    const lab = await this.labModel.findById(user.labId).exec();
    if (!lab) throw new UnauthorizedException('Laboratory is no longer available.');
    return { user: toUser(user), lab: toLab(lab) };
  }

  private async signTokens(user: UserEntity): Promise<TokenPair> {
    const accessSecret = this.config.getOrThrow<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.config.getOrThrow<string>('JWT_REFRESH_SECRET');
    const accessTtl = parseTtlSeconds(this.config.getOrThrow<string>('JWT_ACCESS_TTL'), 900);
    const refreshTtl = parseTtlSeconds(this.config.getOrThrow<string>('JWT_REFRESH_TTL'), 604_800);
    const isSuperAdmin = user.role === 'SUPER_ADMIN';
    const labId = user.labId?.toString() || 'platform';
    const lab = user.labId ? await this.labModel.findById(user.labId).exec() : null;

    const accessPayload: AccessTokenPayload = {
      sub: user._id.toString(),
      labId,
      name: user.name,
      email: user.email,
      role: user.role,
      disciplines: user.disciplines ?? [],
      labEnabledDisciplines: isSuperAdmin
        ? ['HISTOPATHOLOGY', 'HAEMATOLOGY', 'CHEMICAL_PATHOLOGY', 'MICROBIOLOGY']
        : lab?.enabledDisciplines ?? ['HISTOPATHOLOGY'],
      type: 'access',
    };
    const refreshPayload: RefreshTokenPayload = {
      sub: user._id.toString(),
      labId,
      type: 'refresh',
      jti: randomUUID(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(accessPayload, { secret: accessSecret, expiresIn: accessTtl }),
      this.jwt.signAsync(refreshPayload, { secret: refreshSecret, expiresIn: refreshTtl }),
    ]);

    return { accessToken, refreshToken, expiresIn: accessTtl };
  }
}
