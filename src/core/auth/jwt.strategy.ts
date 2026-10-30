import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { AuthenticatedUser } from '../../common/auth/authenticated-user';
import { isAccessTokenPayload } from '../../common/auth/authenticated-user';
import { runWithSystemTenant, runWithTenant } from '../../common/context/tenant-context';
import { UserModelName, type UserEntity } from '../users/user.schema';
import { LabModelName, type LabEntity } from '../labs/lab.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectModel(UserModelName) private readonly userModel: Model<UserEntity>,
    @InjectModel(LabModelName) private readonly labModel: Model<LabEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: unknown): Promise<AuthenticatedUser> {
    if (!isAccessTokenPayload(payload)) {
      throw new UnauthorizedException('Invalid access token.');
    }

    const isSuperAdmin = payload.role === 'SUPER_ADMIN';

    if (isSuperAdmin) {
      const user = await runWithSystemTenant('superadmin-validate', 'platform', () =>
        this.userModel.findById(payload.sub).exec(),
      );
      if (!user || !user.active) {
        throw new UnauthorizedException('Account is inactive or unavailable.');
      }

      return {
        id: user._id.toString(),
        labId: user.labId?.toString() || 'platform',
        name: user.name,
        email: user.email,
        role: user.role,
        subspecialties: user.subspecialties,
        disciplines: user.disciplines ?? [],
        labEnabledDisciplines: ['HISTOPATHOLOGY', 'HAEMATOLOGY', 'CHEMICAL_PATHOLOGY', 'MICROBIOLOGY'],
      };
    }

    const [user, lab] = await runWithTenant({ labId: payload.labId }, () =>
      Promise.all([
        this.userModel.findById(payload.sub).exec(),
        this.labModel.findById(payload.labId).exec(),
      ]),
    );
    if (!user || !user.active || user.labId.toString() !== payload.labId) {
      throw new UnauthorizedException('Account is inactive or unavailable.');
    }

    return {
      id: user._id.toString(),
      labId: user.labId.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      subspecialties: user.subspecialties,
      disciplines: user.disciplines ?? [],
      labEnabledDisciplines: lab?.enabledDisciplines ?? ['HISTOPATHOLOGY'],
    };
  }
}
