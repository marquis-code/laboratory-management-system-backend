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
exports.QualityController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const actor_1 = require("../../common/utils/actor");
const quality_service_1 = require("./quality.service");
let QualityController = class QualityController {
    quality;
    constructor(quality) {
        this.quality = quality;
    }
    equipment() {
        return this.quality.equipment();
    }
    createEquipment(body) {
        return this.quality.createEquipment(body, (0, actor_1.currentActor)());
    }
    temperatures(id) {
        return this.quality.temperatureLogs(id);
    }
    recordTemperature(id, body) {
        return this.quality.recordTemperature(id, body, (0, actor_1.currentActor)());
    }
    nonconformances() {
        return this.quality.nonConformances();
    }
    createNc(body) {
        return this.quality.createNonConformance(body, (0, actor_1.currentActor)());
    }
    updateNc(id, body) {
        return this.quality.updateNonConformance(id, body, (0, actor_1.currentActor)());
    }
    addCapa(id, body) {
        return this.quality.addCapa(id, body, (0, actor_1.currentActor)());
    }
    sendOuts() {
        return this.quality.sendOuts();
    }
    createSendOut(body) {
        return this.quality.createSendOut(body, (0, actor_1.currentActor)());
    }
    updateSendOut(id, body) {
        return this.quality.updateSendOut(id, body, (0, actor_1.currentActor)());
    }
};
exports.QualityController = QualityController;
__decorate([
    (0, common_1.Get)('equipment'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "equipment", null);
__decorate([
    (0, common_1.Post)('equipment'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "createEquipment", null);
__decorate([
    (0, common_1.Get)('equipment/:id/temperature'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "temperatures", null);
__decorate([
    (0, common_1.Post)('equipment/:id/temperature'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "recordTemperature", null);
__decorate([
    (0, common_1.Get)('nonconformances'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "nonconformances", null);
__decorate([
    (0, common_1.Post)('nonconformances'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "createNc", null);
__decorate([
    (0, common_1.Patch)('nonconformances/:id'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST', 'SCIENTIST'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "updateNc", null);
__decorate([
    (0, common_1.Post)('nonconformances/:id/capa'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST', 'SCIENTIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "addCapa", null);
__decorate([
    (0, common_1.Get)('send-outs'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "sendOuts", null);
__decorate([
    (0, common_1.Post)('send-outs'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "createSendOut", null);
__decorate([
    (0, common_1.Patch)('send-outs/:id'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "updateSendOut", null);
exports.QualityController = QualityController = __decorate([
    (0, swagger_1.ApiTags)('Quality management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('quality'),
    __metadata("design:paramtypes", [quality_service_1.QualityService])
], QualityController);
//# sourceMappingURL=quality.controller.js.map