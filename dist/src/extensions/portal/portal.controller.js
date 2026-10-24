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
exports.PortalController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const node_fs_1 = require("node:fs");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const parse_object_id_pipe_1 = require("../../common/pipes/parse-object-id.pipe");
const portal_dto_1 = require("./dto/portal.dto");
const portal_service_1 = require("./portal.service");
const pagination_query_dto_1 = require("../../common/dto/pagination-query.dto");
let PortalController = class PortalController {
    portal;
    constructor(portal) {
        this.portal = portal;
    }
    request(dto) {
        return this.portal.request(dto);
    }
    verify(dto) {
        return this.portal.verify(dto);
    }
    list(user, query) {
        return this.portal.listCases(user.id, user.email, query.page, query.limit);
    }
    detail(id, user) {
        return this.portal.getCase(id, user.id, user.email);
    }
    async resultPdf(id, user, response) {
        const file = await this.portal.getResultPdf(id, user.id, user.email);
        response.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${file.filename}"`,
        });
        return new common_1.StreamableFile((0, node_fs_1.createReadStream)(file.path));
    }
    async pdf(id, user, res) {
        const generated = await this.portal.getReportPdf(id, user.id, user.email);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${generated.filename}"`,
            'Cache-Control': 'private, no-store',
        });
        return new common_1.StreamableFile((0, node_fs_1.createReadStream)(generated.path));
    }
};
exports.PortalController = PortalController;
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Post)('auth/request'),
    (0, common_1.HttpCode)(202),
    (0, swagger_1.ApiOperation)({ summary: 'Request a referral portal magic link and one-time code' }),
    openapi.ApiResponse({ status: 202, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [portal_dto_1.PortalRequestDto]),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "request", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Post)('auth/verify'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Exchange a magic link or one-time code for a referral session' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [portal_dto_1.PortalVerifyDto]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "verify", null);
__decorate([
    (0, common_1.Get)('cases'),
    (0, auth_decorators_1.Roles)('REFERRER', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cases belonging to the signed-in referring clinician' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('cases/:id'),
    (0, auth_decorators_1.Roles)('REFERRER', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Referrer-safe case detail and released report' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "detail", null);
__decorate([
    (0, common_1.Get)('results/:id/pdf'),
    (0, auth_decorators_1.Roles)('REFERRER', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Download a released non-histopathology result PDF' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "resultPdf", null);
__decorate([
    (0, common_1.Get)('cases/:id/report.pdf'),
    (0, auth_decorators_1.Roles)('REFERRER', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Download the released report PDF' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "pdf", null);
exports.PortalController = PortalController = __decorate([
    (0, swagger_1.ApiTags)('Referrer portal'),
    (0, common_1.Controller)('portal'),
    __metadata("design:paramtypes", [portal_service_1.PortalService])
], PortalController);
//# sourceMappingURL=portal.controller.js.map