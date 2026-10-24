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
exports.CasesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const parse_object_id_pipe_1 = require("../../common/pipes/parse-object-id.pipe");
const cases_service_1 = require("./cases.service");
const case_dto_1 = require("./dto/case.dto");
const CLINICAL_ROLES = [
    'SUPER_ADMIN',
    'LAB_ADMIN',
    'RECEPTIONIST',
    'PHLEBOTOMIST',
    'GROSSER',
    'TECHNOLOGIST',
    'SCIENTIST',
    'PATHOLOGIST',
];
let CasesController = class CasesController {
    casesService;
    constructor(casesService) {
        this.casesService = casesService;
    }
    accession(user, dto) {
        return this.casesService.accession(dto, user);
    }
    list(query) {
        return this.casesService.list(query);
    }
    get(id) {
        return this.casesService.getDetail(id);
    }
    assign(id, user, dto) {
        return this.casesService.assign(id, dto, user);
    }
    update(id, user, dto) {
        return this.casesService.update(id, dto, user);
    }
};
exports.CasesController = CasesController;
__decorate([
    (0, common_1.Post)('accession'),
    (0, auth_decorators_1.Roles)('RECEPTIONIST', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({
        summary: 'Accession a patient, specimens and clinical history',
        description: 'Creates the case, patient (or reuses an MRN), specimens and initial custody events in one transaction.',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, case_dto_1.AccessionDto]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "accession", null);
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorators_1.Roles)(...CLINICAL_ROLES),
    (0, swagger_1.ApiOperation)({ summary: 'Paginated, filterable case register' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [case_dto_1.CaseListQueryDto]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_decorators_1.Roles)(...CLINICAL_ROLES),
    (0, swagger_1.ApiOperation)({ summary: 'Case detail with specimens, blocks, slides, report and timeline' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    (0, auth_decorators_1.Roles)('PATHOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign or unassign a pathologist' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, case_dto_1.AssignCaseDto]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "assign", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorators_1.Roles)('RECEPTIONIST', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Correct clinical history, diagnosis, priority or subspecialty' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, case_dto_1.UpdateCaseDto]),
    __metadata("design:returntype", Promise)
], CasesController.prototype, "update", null);
exports.CasesController = CasesController = __decorate([
    (0, swagger_1.ApiTags)('Cases'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('cases'),
    __metadata("design:paramtypes", [cases_service_1.CasesService])
], CasesController);
//# sourceMappingURL=cases.controller.js.map