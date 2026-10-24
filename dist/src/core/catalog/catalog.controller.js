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
exports.CatalogController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const actor_1 = require("../../common/utils/actor");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const catalog_service_1 = require("./catalog.service");
let CatalogController = class CatalogController {
    catalog;
    constructor(catalog) {
        this.catalog = catalog;
    }
    listTests(discipline, q, active, page = '1', limit = '50') {
        return this.catalog.listTests({
            discipline: discipline,
            q,
            active: active === undefined ? undefined : active === 'true',
            page: Math.max(1, Number(page) || 1),
            limit: Math.min(100, Math.max(1, Number(limit) || 50)),
        });
    }
    listPanels(discipline, page = '1', limit = '50') {
        return this.catalog.listPanels({
            discipline: discipline,
            page: Math.max(1, Number(page) || 1),
            limit: Math.min(100, Math.max(1, Number(limit) || 50)),
        });
    }
    createTest(body) {
        return this.catalog.createTest(body, (0, actor_1.currentActor)());
    }
    updateTest(id, body) {
        return this.catalog.updateTest(id, body, (0, actor_1.currentActor)());
    }
    createPanel(body) {
        return this.catalog.createPanel(body, (0, actor_1.currentActor)());
    }
};
exports.CatalogController = CatalogController;
__decorate([
    openapi.ApiQuery({ name: "discipline", required: false }),
    openapi.ApiQuery({ name: "q", required: false }),
    openapi.ApiQuery({ name: "active", required: false }),
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    (0, common_1.Get)('tests'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'PHLEBOTOMIST', 'GROSSER', 'TECHNOLOGIST', 'SCIENTIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('discipline')),
    __param(1, (0, common_1.Query)('q')),
    __param(2, (0, common_1.Query)('active')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "listTests", null);
__decorate([
    openapi.ApiQuery({ name: "discipline", required: false }),
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    (0, common_1.Get)('panels'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'PHLEBOTOMIST', 'GROSSER', 'TECHNOLOGIST', 'SCIENTIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('discipline')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "listPanels", null);
__decorate([
    (0, common_1.Post)('tests'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "createTest", null);
__decorate([
    (0, common_1.Patch)('tests/:id'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "updateTest", null);
__decorate([
    (0, common_1.Post)('panels'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "createPanel", null);
exports.CatalogController = CatalogController = __decorate([
    (0, swagger_1.ApiTags)('Test catalogue'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('catalog'),
    __metadata("design:paramtypes", [catalog_service_1.CatalogService])
], CatalogController);
//# sourceMappingURL=catalog.controller.js.map