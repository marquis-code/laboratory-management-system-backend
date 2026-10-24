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
exports.MicrobiologyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const discipline_decorator_1 = require("../../core/discipline/discipline.decorator");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const actor_1 = require("../../common/utils/actor");
const microbiology_service_1 = require("./microbiology.service");
let MicrobiologyController = class MicrobiologyController {
    micro;
    constructor(micro) {
        this.micro = micro;
    }
    organisms() {
        return this.micro.organisms();
    }
    createOrganism(body) {
        return this.micro.createOrganism(body, (0, actor_1.currentActor)());
    }
    antibiotics() {
        return this.micro.antibiotics();
    }
    createAntibiotic(body) {
        return this.micro.createAntibiotic(body, (0, actor_1.currentActor)());
    }
    breakpoints(organism, antibiotic) {
        return this.micro.breakpoints(organism, antibiotic);
    }
    createBreakpoint(body) {
        return this.micro.createBreakpoint(body, (0, actor_1.currentActor)());
    }
    cultures(status) {
        return this.micro.cultures(status);
    }
    createCulture(body) {
        return this.micro.createCulture(body, (0, actor_1.currentActor)());
    }
    culture(id) {
        return this.micro.culture(id);
    }
    updateCulture(id, body) {
        return this.micro.updateCulture(id, body, (0, actor_1.currentActor)());
    }
    addIsolate(id, body) {
        return this.micro.addIsolate(id, body, (0, actor_1.currentActor)());
    }
    ast(id, body) {
        return this.micro.susceptibility(id, body, (0, actor_1.currentActor)());
    }
    antibiogram(from, to) {
        return this.micro.antibiogram(from, to);
    }
    async whonet(response, from, to) {
        const csv = await this.micro.whonet(from, to);
        response.set({
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="whonet-export.csv"',
        });
        return csv;
    }
};
exports.MicrobiologyController = MicrobiologyController;
__decorate([
    (0, common_1.Get)('organisms'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MicrobiologyController.prototype, "organisms", null);
__decorate([
    (0, common_1.Post)('organisms'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MicrobiologyController.prototype, "createOrganism", null);
__decorate([
    (0, common_1.Get)('antibiotics'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MicrobiologyController.prototype, "antibiotics", null);
__decorate([
    (0, common_1.Post)('antibiotics'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MicrobiologyController.prototype, "createAntibiotic", null);
__decorate([
    openapi.ApiQuery({ name: "organism", required: false }),
    openapi.ApiQuery({ name: "antibiotic", required: false }),
    (0, common_1.Get)('breakpoints'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('organism')),
    __param(1, (0, common_1.Query)('antibiotic')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MicrobiologyController.prototype, "breakpoints", null);
__decorate([
    (0, common_1.Post)('breakpoints'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MicrobiologyController.prototype, "createBreakpoint", null);
__decorate([
    openapi.ApiQuery({ name: "status", required: false }),
    (0, common_1.Get)('cultures'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MicrobiologyController.prototype, "cultures", null);
__decorate([
    (0, common_1.Post)('cultures'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MicrobiologyController.prototype, "createCulture", null);
__decorate([
    (0, common_1.Get)('cultures/:id'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MicrobiologyController.prototype, "culture", null);
__decorate([
    (0, common_1.Patch)('cultures/:id'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MicrobiologyController.prototype, "updateCulture", null);
__decorate([
    (0, common_1.Post)('cultures/:id/isolates'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MicrobiologyController.prototype, "addIsolate", null);
__decorate([
    (0, common_1.Post)('cultures/:id/ast'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MicrobiologyController.prototype, "ast", null);
__decorate([
    openapi.ApiQuery({ name: "from", required: false }),
    openapi.ApiQuery({ name: "to", required: false }),
    (0, common_1.Get)('antibiogram'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MicrobiologyController.prototype, "antibiogram", null);
__decorate([
    openapi.ApiQuery({ name: "from", required: false }),
    openapi.ApiQuery({ name: "to", required: false }),
    (0, common_1.Get)('whonet'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST', 'SCIENTIST'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MicrobiologyController.prototype, "whonet", null);
exports.MicrobiologyController = MicrobiologyController = __decorate([
    (0, swagger_1.ApiTags)('Microbiology'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, discipline_decorator_1.Discipline)('MICROBIOLOGY'),
    (0, common_1.Controller)('micro'),
    __metadata("design:paramtypes", [microbiology_service_1.MicrobiologyService])
], MicrobiologyController);
//# sourceMappingURL=microbiology.controller.js.map