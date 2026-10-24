"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const node_crypto_1 = require("node:crypto");
const jsonwebtoken_1 = require("jsonwebtoken");
const env_1 = require("../../common/config/env");
const authenticated_user_1 = require("../../common/auth/authenticated-user");
const tenant_context_1 = require("../../common/context/tenant-context");
const crypto_1 = require("../../common/utils/crypto");
const entities_1 = require("../../common/serializers/entities");
const audit_service_1 = require("../audit/audit.service");
const lab_schema_1 = require("../labs/lab.schema");
const user_schema_1 = require("../users/user.schema");
const organization_schema_1 = require("../platform/organization.schema");
let AuthService = class AuthService {
    userModel;
    labModel;
    jwt;
    config;
    audit;
    connection;
    organizationModel;
    constructor(userModel, labModel, jwt, config, audit, connection, organizationModel) {
        this.userModel = userModel;
        this.labModel = labModel;
        this.jwt = jwt;
        this.config = config;
        this.audit = audit;
        this.connection = connection;
        this.organizationModel = organizationModel;
    }
    async login(dto) {
        const lab = await this.labModel
            .findOne({ code: dto.labCode.toUpperCase(), active: true })
            .exec();
        if (!lab)
            throw new common_1.UnauthorizedException('Invalid laboratory code, email or password.');
        if (lab.organizationId) {
            const organization = await this.organizationModel.findById(lab.organizationId).exec();
            if (organization?.status === 'SUSPENDED')
                throw new common_1.UnauthorizedException('This organization is suspended.');
        }
        const labId = lab._id.toString();
        return (0, tenant_context_1.runWithTenant)({ labId }, async () => {
            const user = await this.userModel
                .findOne({ email: dto.email.toLowerCase() })
                .select('+passwordHash')
                .exec();
            if (!user || !user.active) {
                throw new common_1.UnauthorizedException('Invalid laboratory code, email or password.');
            }
            const valid = await (0, crypto_1.verifyPassword)(dto.password, user.passwordHash);
            if (!valid) {
                throw new common_1.UnauthorizedException('Invalid laboratory code, email or password.');
            }
            const tokens = await this.signTokens(user);
            user.refreshTokenHash = (0, crypto_1.hashToken)(tokens.refreshToken);
            user.lastLoginAt = new Date();
            await user.save();
            await this.audit.record({
                action: 'LOGIN',
                entityType: 'User',
                entityId: user._id.toString(),
                metadata: { labCode: lab.code },
                actor: { userId: user._id.toString(), userName: user.name, userRole: user.role },
            });
            return {
                ...tokens,
                user: (0, entities_1.toUser)(user),
                lab: (0, entities_1.toLab)(lab),
            };
        });
    }
    async acceptInvite(token, password) {
        const raw = await this.connection.collection('users').findOne({
            invitationTokenHash: (0, crypto_1.hashToken)(token),
            invitationExpiresAt: { $gt: new Date() },
        });
        if (!raw)
            throw new common_1.UnauthorizedException('This invitation is invalid or has expired.');
        const labId = raw.labId.toString();
        return (0, tenant_context_1.runWithTenant)({ labId }, async () => {
            const user = await this.userModel.findById(raw._id).select('+passwordHash').exec();
            if (!user || !user.active)
                throw new common_1.UnauthorizedException('This invitation is no longer available.');
            user.passwordHash = await (0, crypto_1.hashPassword)(password);
            user.mustChangePassword = false;
            user.invitationTokenHash = null;
            user.invitationExpiresAt = null;
            user.refreshTokenHash = null;
            await user.save();
            const lab = await this.labModel.findById(labId).exec();
            if (!lab)
                throw new common_1.UnauthorizedException('Laboratory is no longer available.');
            const tokens = await this.signTokens(user);
            user.refreshTokenHash = (0, crypto_1.hashToken)(tokens.refreshToken);
            await user.save();
            if (user.role === 'LAB_ADMIN' && lab.organizationId) {
                await this.organizationModel.updateOne({ _id: lab.organizationId, status: 'ONBOARDING' }, { $set: { status: 'ACTIVE' } });
            }
            await this.audit.record({
                action: 'LOGIN',
                entityType: 'User',
                entityId: user._id.toString(),
                metadata: { labCode: lab.code, method: 'invitation' },
                actor: { userId: user._id.toString(), userName: user.name, userRole: user.role },
            });
            return { ...tokens, user: (0, entities_1.toUser)(user), lab: (0, entities_1.toLab)(lab) };
        });
    }
    async portalSession(userId) {
        const user = await this.userModel.findById(userId).exec();
        if (!user || !user.active || user.role !== 'REFERRER') {
            throw new common_1.UnauthorizedException('This referral account is not available.');
        }
        const lab = await this.labModel.findById(user.labId).exec();
        if (!lab)
            throw new common_1.UnauthorizedException('Laboratory is no longer available.');
        const tokens = await this.signTokens(user);
        user.refreshTokenHash = (0, crypto_1.hashToken)(tokens.refreshToken);
        user.lastLoginAt = new Date();
        await user.save();
        await this.audit.record({
            action: 'LOGIN',
            entityType: 'User',
            entityId: user._id.toString(),
            metadata: { method: 'referral-magic-link', labCode: lab.code },
        });
        return { ...tokens, user: (0, entities_1.toUser)(user), lab: (0, entities_1.toLab)(lab) };
    }
    async refresh(refreshToken) {
        let payload;
        try {
            const raw = (0, jsonwebtoken_1.verify)(refreshToken, this.config.getOrThrow('JWT_REFRESH_SECRET'));
            if (!(0, authenticated_user_1.isRefreshTokenPayload)(raw))
                throw new Error('Wrong token type.');
            payload = raw;
        }
        catch {
            throw new common_1.UnauthorizedException('Session expired. Sign in again.');
        }
        return (0, tenant_context_1.runWithTenant)({ labId: payload.labId }, async () => {
            const user = await this.userModel.findById(payload.sub).select('+refreshTokenHash').exec();
            if (!user || !user.active || !user.refreshTokenHash) {
                throw new common_1.UnauthorizedException('Session expired. Sign in again.');
            }
            const providedHash = (0, crypto_1.hashToken)(refreshToken);
            const expected = Buffer.from(user.refreshTokenHash, 'utf8');
            const provided = Buffer.from(providedHash, 'utf8');
            if (expected.length !== provided.length || !(0, node_crypto_1.timingSafeEqual)(expected, provided)) {
                throw new common_1.UnauthorizedException('Session expired. Sign in again.');
            }
            const tokens = await this.signTokens(user);
            user.refreshTokenHash = (0, crypto_1.hashToken)(tokens.refreshToken);
            await user.save();
            const lab = await this.labModel.findById(user.labId).exec();
            if (!lab)
                throw new common_1.UnauthorizedException('Laboratory is no longer available.');
            return { ...tokens, user: (0, entities_1.toUser)(user), lab: (0, entities_1.toLab)(lab) };
        });
    }
    async logout(user) {
        const stored = await this.userModel.findById(user.id).exec();
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
    async me(userId) {
        const user = await this.userModel.findById(userId).exec();
        if (!user)
            throw new common_1.UnauthorizedException('Account not found.');
        const lab = await this.labModel.findById(user.labId).exec();
        if (!lab)
            throw new common_1.UnauthorizedException('Laboratory is no longer available.');
        return { user: (0, entities_1.toUser)(user), lab: (0, entities_1.toLab)(lab) };
    }
    async signTokens(user) {
        const accessSecret = this.config.getOrThrow('JWT_ACCESS_SECRET');
        const refreshSecret = this.config.getOrThrow('JWT_REFRESH_SECRET');
        const accessTtl = (0, env_1.parseTtlSeconds)(this.config.getOrThrow('JWT_ACCESS_TTL'), 900);
        const refreshTtl = (0, env_1.parseTtlSeconds)(this.config.getOrThrow('JWT_REFRESH_TTL'), 604_800);
        const labId = user.labId.toString();
        const lab = await this.labModel.findById(user.labId).exec();
        const accessPayload = {
            sub: user._id.toString(),
            labId,
            name: user.name,
            email: user.email,
            role: user.role,
            disciplines: user.disciplines ?? [],
            labEnabledDisciplines: lab?.enabledDisciplines ?? ['HISTOPATHOLOGY'],
            type: 'access',
        };
        const refreshPayload = {
            sub: user._id.toString(),
            labId,
            type: 'refresh',
            jti: (0, node_crypto_1.randomUUID)(),
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(accessPayload, { secret: accessSecret, expiresIn: accessTtl }),
            this.jwt.signAsync(refreshPayload, { secret: refreshSecret, expiresIn: refreshTtl }),
        ]);
        return { accessToken, refreshToken, expiresIn: accessTtl };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.UserModelName)),
    __param(1, (0, mongoose_1.InjectModel)(lab_schema_1.LabModelName)),
    __param(5, (0, mongoose_1.InjectConnection)()),
    __param(6, (0, mongoose_1.InjectModel)(organization_schema_1.OrganizationModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService,
        audit_service_1.AuditService,
        mongoose_2.Connection,
        mongoose_2.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map