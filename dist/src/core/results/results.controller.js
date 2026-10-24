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
exports.ResultsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const node_fs_1 = require("node:fs");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const results_service_1 = require("./results.service");
const result_pdf_service_1 = require("./result-pdf.service");
let ResultsController = class ResultsController {
    results;
    resultPdf;
    constructor(results, resultPdf) {
        this.results = results;
        this.resultPdf = resultPdf;
    }
    worklist(discipline, user) {
        return this.results.worklist(discipline, user);
    }
    cumulative(patientId, from, to, disciplines) {
        return this.results.cumulative(patientId, from, to, disciplines?.split(',').filter(Boolean));
    }
    create(body, user) {
        return this.results.create(body.testRequestId, user);
    }
    async cumulativePdf(patientId, user, response) {
        const report = await this.results.cumulative(patientId);
        const file = await this.resultPdf.generateCumulative(report, user.labId);
        response.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${file.filename}"`,
        });
        return new common_1.StreamableFile((0, node_fs_1.createReadStream)(file.path));
    }
    async pdf(id, response) {
        const file = await this.resultPdf.generateAndStore(id);
        response.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${file.filename}"`,
        });
        return new common_1.StreamableFile((0, node_fs_1.createReadStream)(file.path));
    }
    versions(id) {
        return this.results.versions(id);
    }
    executions(id) {
        return this.results.executions(id);
    }
    get(id) {
        return this.results.getById(id);
    }
    update(id, body, user) {
        return this.results.update(id, body, user);
    }
    verify(id, user) {
        return this.results.verify(id, user);
    }
    release(id, user) {
        return this.results.release(id, user);
    }
    acknowledge(id, body, user) {
        return this.results.acknowledgeCritical(id, body.note, user);
    }
};
exports.ResultsController = ResultsController;
__decorate([
    (0, common_1.Get)('worklist'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('discipline')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "worklist", null);
__decorate([
    openapi.ApiQuery({ name: "from", required: false }),
    openapi.ApiQuery({ name: "to", required: false }),
    openapi.ApiQuery({ name: "disciplines", required: false }),
    (0, common_1.Get)('cumulative/:patientId'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __param(3, (0, common_1.Query)('disciplines')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "cumulative", null);
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('cumulative/:patientId/pdf'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ResultsController.prototype, "cumulativePdf", null);
__decorate([
    (0, common_1.Get)(':id/pdf'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResultsController.prototype, "pdf", null);
__decorate([
    (0, common_1.Get)(':id/versions'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "versions", null);
__decorate([
    (0, common_1.Get)(':id/executions'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "executions", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/verify'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)(':id/release'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "release", null);
__decorate([
    (0, common_1.Post)(':id/acknowledge-critical'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "acknowledge", null);
exports.ResultsController = ResultsController = __decorate([
    (0, swagger_1.ApiTags)('Results'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('results'),
    __metadata("design:paramtypes", [results_service_1.ResultsService,
        result_pdf_service_1.ResultPdfService])
], ResultsController);
//# sourceMappingURL=results.controller.js.map