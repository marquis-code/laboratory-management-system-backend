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
exports.LabelsController = void 0;
const openapi = require("@nestjs/swagger");
const discipline_decorator_1 = require("../discipline/discipline.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const parse_object_id_pipe_1 = require("../../common/pipes/parse-object-id.pipe");
const label_dto_1 = require("./dto/label.dto");
const labels_service_1 = require("./labels.service");
let LabelsController = class LabelsController {
    labelsService;
    constructor(labelsService) {
        this.labelsService = labelsService;
    }
    async caseLabels(caseId, query, res) {
        const result = await this.labelsService.caseLabels(caseId, query.format ?? 'pdf', query.symbology ?? 'datamatrix', query.include ?? 'all');
        return this.respond(res, result);
    }
    async entityLabel(entityType, id, query, res) {
        const result = await this.labelsService.entityLabel(entityType, id, query.format ?? 'pdf', query.symbology ?? 'datamatrix');
        return this.respond(res, result);
    }
    respond(res, result) {
        res.set({
            'Content-Type': result.contentType,
            'Content-Disposition': `inline; filename="${result.filename}"`,
            'Cache-Control': 'private, no-store',
        });
        return typeof result.body === 'string' ? result.body : new common_1.StreamableFile(result.body);
    }
};
exports.LabelsController = LabelsController;
__decorate([
    (0, common_1.Get)('case/:caseId'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'GROSSER', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiProduces)('application/pdf', 'text/plain', 'image/svg+xml'),
    (0, swagger_1.ApiOperation)({ summary: 'Print-ready label sheet for a case (PDF, ZPL or SVG preview)' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('caseId', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, label_dto_1.CaseLabelQueryDto, Object]),
    __metadata("design:returntype", Promise)
], LabelsController.prototype, "caseLabels", null);
__decorate([
    (0, common_1.Get)(':entityType/:id'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'GROSSER', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiProduces)('application/pdf', 'text/plain', 'image/svg+xml'),
    (0, swagger_1.ApiOperation)({ summary: 'Print-ready label for one specimen, block or slide' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, label_dto_1.LabelQueryDto, Object]),
    __metadata("design:returntype", Promise)
], LabelsController.prototype, "entityLabel", null);
exports.LabelsController = LabelsController = __decorate([
    (0, swagger_1.ApiTags)('Labels'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, discipline_decorator_1.Discipline)('HISTOPATHOLOGY'),
    (0, common_1.Controller)('labels'),
    __metadata("design:paramtypes", [labels_service_1.LabelsService])
], LabelsController);
//# sourceMappingURL=labels.controller.js.map