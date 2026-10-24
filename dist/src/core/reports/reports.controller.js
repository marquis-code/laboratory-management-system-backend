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
exports.ReportsController = void 0;
const openapi = require("@nestjs/swagger");
const discipline_decorator_1 = require("../discipline/discipline.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const node_fs_1 = require("node:fs");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const auth_decorators_2 = require("../../common/decorators/auth.decorators");
const parse_object_id_pipe_1 = require("../../common/pipes/parse-object-id.pipe");
const report_dto_1 = require("./dto/report.dto");
const reports_service_1 = require("./reports.service");
const REPORT_READ_ROLES = [
    'SUPER_ADMIN',
    'LAB_ADMIN',
    'RECEPTIONIST',
    'GROSSER',
    'TECHNOLOGIST',
    'PATHOLOGIST',
];
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getByCase(caseId) {
        return this.reportsService.getByCase(caseId);
    }
    verify(code) {
        return this.reportsService.verify(code);
    }
    create(caseId, user, dto) {
        return this.reportsService.createDraft(caseId, dto, user);
    }
    update(id, user, dto) {
        return this.reportsService.updateDraft(id, dto, user);
    }
    signOut(id, user) {
        return this.reportsService.signOut(id, user);
    }
    amend(id, user, dto) {
        return this.reportsService.amend(id, dto, user);
    }
    release(id, user, dto) {
        return this.reportsService.release(id, dto, user);
    }
    enqueuePdf(id, user) {
        return this.reportsService.enqueuePdf(id, user);
    }
    async pdf(id, res) {
        const generated = await this.reportsService.getPdf(id);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${generated.filename}"`,
            'Cache-Control': 'private, no-store',
        });
        return new common_1.StreamableFile((0, node_fs_1.createReadStream)(generated.path));
    }
    get(id) {
        return this.reportsService.getById(id);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('case/:caseId'),
    (0, auth_decorators_2.Roles)(...REPORT_READ_ROLES),
    (0, swagger_1.ApiOperation)({ summary: 'Get the report for a case, including immutable versions' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('caseId', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getByCase", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('verify/:code'),
    (0, swagger_1.ApiOperation)({ summary: 'Public verification of a signed report by QR code' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)('case/:caseId'),
    (0, auth_decorators_2.Roles)('PATHOLOGIST', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Start a draft synoptic report from a protocol' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('caseId', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, report_dto_1.CreateReportDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorators_2.Roles)('PATHOLOGIST', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Save structured report data while in draft (draft-only)' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, report_dto_1.UpdateReportDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/sign-out'),
    (0, auth_decorators_2.Roles)('PATHOLOGIST', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({
        summary: 'Validate required fields, sign out and lock the report',
        description: 'Sign-out writes an immutable version, marks reviewed slides and blocks REPORTED and advances the case.',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "signOut", null);
__decorate([
    (0, common_1.Post)(':id/amend'),
    (0, auth_decorators_2.Roles)('PATHOLOGIST', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Amend a signed report with a reason and a new immutable version' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, report_dto_1.AmendReportDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "amend", null);
__decorate([
    (0, common_1.Post)(':id/release'),
    (0, auth_decorators_2.Roles)('PATHOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Release a signed report to the referrer portal' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, report_dto_1.ReleaseReportDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "release", null);
__decorate([
    (0, common_1.Post)(':id/pdf'),
    (0, auth_decorators_2.Roles)('PATHOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Queue server-side PDF generation with BullMQ' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "enqueuePdf", null);
__decorate([
    (0, common_1.Get)(':id/pdf'),
    (0, auth_decorators_2.Roles)(...REPORT_READ_ROLES),
    (0, swagger_1.ApiProduces)('application/pdf'),
    (0, swagger_1.ApiOperation)({ summary: 'Download the server-rendered report PDF (inline preview supported)' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "pdf", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_decorators_2.Roles)(...REPORT_READ_ROLES),
    (0, swagger_1.ApiOperation)({ summary: 'Get a report by id' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "get", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, discipline_decorator_1.Discipline)('HISTOPATHOLOGY'),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map