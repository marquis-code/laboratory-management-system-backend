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
exports.LabsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const roles_guard_1 = require("../../common/guards/roles.guard");
const update_lab_dto_1 = require("./dto/update-lab.dto");
const labs_service_1 = require("./labs.service");
let LabsController = class LabsController {
    labsService;
    constructor(labsService) {
        this.labsService = labsService;
    }
    getCurrent(user) {
        return this.labsService.getById(user.labId);
    }
    update(user, dto) {
        return this.labsService.update(user.labId, dto);
    }
};
exports.LabsController = LabsController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the current laboratory and its settings' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "getCurrent", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)('LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update laboratory identity, accession format and TAT settings' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_lab_dto_1.UpdateLabDto]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "update", null);
exports.LabsController = LabsController = __decorate([
    (0, swagger_1.ApiTags)('Laboratories'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('labs'),
    __metadata("design:paramtypes", [labs_service_1.LabsService])
], LabsController);
//# sourceMappingURL=labs.controller.js.map