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
exports.PlatformController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const platform_service_1 = require("./platform.service");
let PlatformController = class PlatformController {
    platform;
    constructor(platform) {
        this.platform = platform;
    }
    overview(user) {
        return this.platform.overview(user);
    }
    organizations(user) {
        return this.platform.organizations(user);
    }
    createOrganization(body, user) {
        return this.platform.createOrganization(body, user);
    }
    organization(id, user) {
        return this.platform.organization(id, user);
    }
    updateOrganization(id, body, user) {
        return this.platform.updateOrganization(id, body, user);
    }
    provisionLab(id, body, user) {
        return this.platform.provisionLab(id, body, user);
    }
    onboard(body, user) {
        return this.platform.onboard(body, user);
    }
    inviteAdmin(id, body, user) {
        return this.platform.inviteAdmin(id, body, user);
    }
    assignLab(id, body, user) {
        return this.platform.assignLab(id, body, user);
    }
    setLabStatus(id, body, user) {
        return this.platform.setLabActive(id, body.active !== false, user);
    }
};
exports.PlatformController = PlatformController;
__decorate([
    (0, common_1.Get)('overview'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)('organizations'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "organizations", null);
__decorate([
    (0, common_1.Post)('organizations'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "createOrganization", null);
__decorate([
    (0, common_1.Get)('organizations/:id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "organization", null);
__decorate([
    (0, common_1.Patch)('organizations/:id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "updateOrganization", null);
__decorate([
    (0, common_1.Post)('organizations/:id/labs'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "provisionLab", null);
__decorate([
    (0, common_1.Post)('onboard'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "onboard", null);
__decorate([
    (0, common_1.Post)('labs/:id/invite-admin'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "inviteAdmin", null);
__decorate([
    (0, common_1.Patch)('labs/:id/organization'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "assignLab", null);
__decorate([
    (0, common_1.Patch)('labs/:id/status'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PlatformController.prototype, "setLabStatus", null);
exports.PlatformController = PlatformController = __decorate([
    (0, swagger_1.ApiTags)('Platform administration'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN'),
    (0, common_1.Controller)('super-admin'),
    __metadata("design:paramtypes", [platform_service_1.PlatformService])
], PlatformController);
//# sourceMappingURL=platform.controller.js.map