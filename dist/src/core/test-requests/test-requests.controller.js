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
exports.TestRequestsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("@lims/shared");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const parse_object_id_pipe_1 = require("../../common/pipes/parse-object-id.pipe");
const test_request_dto_1 = require("./dto/test-request.dto");
const test_requests_service_1 = require("./test-requests.service");
let TestRequestsController = class TestRequestsController {
    testRequests;
    constructor(testRequests) {
        this.testRequests = testRequests;
    }
    list(query, user) {
        const allowed = this.allowed(user);
        if (query.discipline && !allowed.includes(query.discipline)) {
            throw new common_1.ForbiddenException('You are not assigned to this discipline.');
        }
        return this.testRequests.list(query, allowed);
    }
    forCase(caseId, user) {
        return this.testRequests.forCase(caseId, this.allowed(user));
    }
    allowed(user) {
        if (!(0, shared_1.isClinicalRole)(user.role))
            return user.labEnabledDisciplines;
        return user.disciplines.length > 0 ? user.disciplines : ['HISTOPATHOLOGY'];
    }
};
exports.TestRequestsController = TestRequestsController;
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'PHLEBOTOMIST', 'GROSSER', 'TECHNOLOGIST', 'SCIENTIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'List test requests across the case accession' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [test_request_dto_1.TestRequestQueryDto, Object]),
    __metadata("design:returntype", void 0)
], TestRequestsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('case/:caseId'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'PHLEBOTOMIST', 'GROSSER', 'TECHNOLOGIST', 'SCIENTIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Test requests belonging to a case' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('caseId', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TestRequestsController.prototype, "forCase", null);
exports.TestRequestsController = TestRequestsController = __decorate([
    (0, swagger_1.ApiTags)('Test requests'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('test-requests'),
    __metadata("design:paramtypes", [test_requests_service_1.TestRequestsService])
], TestRequestsController);
//# sourceMappingURL=test-requests.controller.js.map