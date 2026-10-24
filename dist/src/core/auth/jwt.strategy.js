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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const passport_1 = require("@nestjs/passport");
const mongoose_2 = require("mongoose");
const passport_jwt_1 = require("passport-jwt");
const authenticated_user_1 = require("../../common/auth/authenticated-user");
const tenant_context_1 = require("../../common/context/tenant-context");
const user_schema_1 = require("../users/user.schema");
const lab_schema_1 = require("../labs/lab.schema");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    userModel;
    labModel;
    constructor(config, userModel, labModel) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow('JWT_ACCESS_SECRET'),
        });
        this.userModel = userModel;
        this.labModel = labModel;
    }
    async validate(payload) {
        if (!(0, authenticated_user_1.isAccessTokenPayload)(payload)) {
            throw new common_1.UnauthorizedException('Invalid access token.');
        }
        const [user, lab] = await (0, tenant_context_1.runWithTenant)({ labId: payload.labId }, () => Promise.all([
            this.userModel.findById(payload.sub).exec(),
            this.labModel.findById(payload.labId).exec(),
        ]));
        if (!user || !user.active || user.labId.toString() !== payload.labId) {
            throw new common_1.UnauthorizedException('Account is inactive or unavailable.');
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
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.UserModelName)),
    __param(2, (0, mongoose_1.InjectModel)(lab_schema_1.LabModelName)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model,
        mongoose_2.Model])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map