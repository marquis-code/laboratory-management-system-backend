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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisciplineGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const shared_1 = require("@lims/shared");
const discipline_decorator_1 = require("./discipline.decorator");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
let DisciplineGuard = class DisciplineGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(auth_decorators_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic)
            return true;
        const required = this.reflector.getAllAndOverride(discipline_decorator_1.DISCIPLINE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!required || required.length === 0)
            return true;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user)
            throw new common_1.UnauthorizedException('Authentication required.');
        const enabled = user.labEnabledDisciplines ?? ['HISTOPATHOLOGY'];
        for (const discipline of required) {
            if (!enabled.includes(discipline)) {
                throw new common_1.ForbiddenException(`${discipline.replace('_', ' ').toLowerCase()} is not enabled for this laboratory.`);
            }
            if (user.role === 'SUPER_ADMIN' || user.role === 'LAB_ADMIN')
                continue;
            if ((0, shared_1.isClinicalRole)(user.role)) {
                const assigned = user.disciplines.length > 0 ? user.disciplines : ['HISTOPATHOLOGY'];
                if (!assigned.includes(discipline)) {
                    throw new common_1.ForbiddenException('You are not assigned to this discipline.');
                }
            }
        }
        return true;
    }
};
exports.DisciplineGuard = DisciplineGuard;
exports.DisciplineGuard = DisciplineGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], DisciplineGuard);
//# sourceMappingURL=discipline.guard.js.map