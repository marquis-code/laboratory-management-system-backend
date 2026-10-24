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
exports.WorklistController = void 0;
const openapi = require("@nestjs/swagger");
const discipline_decorator_1 = require("../discipline/discipline.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const parse_object_id_pipe_1 = require("../../common/pipes/parse-object-id.pipe");
const cases_service_1 = require("../cases/cases.service");
const discipline_registry_1 = require("../discipline/discipline.registry");
const shared_1 = require("@lims/shared");
const worklist_query_dto_1 = require("./dto/worklist-query.dto");
const worklist_service_1 = require("./worklist.service");
let WorklistController = class WorklistController {
    worklistService;
    casesService;
    disciplines;
    constructor(worklistService, casesService, disciplines) {
        this.worklistService = worklistService;
        this.casesService = casesService;
        this.disciplines = disciplines;
    }
    configs(user) {
        const allowed = (0, shared_1.isClinicalRole)(user.role)
            ? user.disciplines.length > 0
                ? user.disciplines
                : ['HISTOPATHOLOGY']
            : user.labEnabledDisciplines;
        return this.disciplines
            .enabled(user.labEnabledDisciplines)
            .filter((definition) => allowed.includes(definition.id))
            .flatMap((definition) => definition.worklistConfigs);
    }
    get(query, user) {
        return this.worklistService.getWorklist(query, user);
    }
    claim(caseId, user) {
        return this.casesService.assign(caseId, { pathologistId: user.id }, user);
    }
};
exports.WorklistController = WorklistController;
__decorate([
    (0, common_1.Get)('configs'),
    (0, auth_decorators_1.Roles)('PATHOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({
        summary: 'Worklist configurations for the disciplines enabled for this laboratory',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorklistController.prototype, "configs", null);
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorators_1.Roles)('PATHOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({
        summary: 'Pathologist worklist ordered frozen → urgent → routine, then TAT deadline',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [worklist_query_dto_1.WorklistQueryDto, Object]),
    __metadata("design:returntype", Promise)
], WorklistController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(':caseId/claim'),
    (0, auth_decorators_1.Roles)('PATHOLOGIST', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a case to the signed-in pathologist' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('caseId', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorklistController.prototype, "claim", null);
exports.WorklistController = WorklistController = __decorate([
    (0, swagger_1.ApiTags)('Worklist'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, discipline_decorator_1.Discipline)('HISTOPATHOLOGY'),
    (0, common_1.Controller)('worklist'),
    __metadata("design:paramtypes", [worklist_service_1.WorklistService,
        cases_service_1.CasesService,
        discipline_registry_1.DisciplineRegistry])
], WorklistController);
//# sourceMappingURL=worklist.controller.js.map