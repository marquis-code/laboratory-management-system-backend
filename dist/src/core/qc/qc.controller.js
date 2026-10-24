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
exports.QcController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const actor_1 = require("../../common/utils/actor");
const qc_service_1 = require("./qc.service");
let QcController = class QcController {
    qc;
    constructor(qc) {
        this.qc = qc;
    }
    materials(discipline) {
        return this.qc.listMaterials(discipline);
    }
    createMaterial(body) {
        return this.qc.createMaterial(body, (0, actor_1.currentActor)());
    }
    runs(discipline, materialId, page = '1', limit = '50') {
        return this.qc.listRuns({
            discipline: discipline,
            materialId,
            page: Math.max(1, Number(page) || 1),
            limit: Math.min(100, Math.max(1, Number(limit) || 50)),
        });
    }
    run(body) {
        return this.qc.run(body, (0, actor_1.currentActor)());
    }
};
exports.QcController = QcController;
__decorate([
    openapi.ApiQuery({ name: "discipline", required: false }),
    (0, common_1.Get)('materials'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('discipline')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QcController.prototype, "materials", null);
__decorate([
    (0, common_1.Post)('materials'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QcController.prototype, "createMaterial", null);
__decorate([
    openapi.ApiQuery({ name: "discipline", required: false }),
    openapi.ApiQuery({ name: "materialId", required: false }),
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    (0, common_1.Get)('runs'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('discipline')),
    __param(1, (0, common_1.Query)('materialId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], QcController.prototype, "runs", null);
__decorate([
    (0, common_1.Post)('runs'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QcController.prototype, "run", null);
exports.QcController = QcController = __decorate([
    (0, swagger_1.ApiTags)('Quality control'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('qc'),
    __metadata("design:paramtypes", [qc_service_1.QcService])
], QcController);
//# sourceMappingURL=qc.controller.js.map