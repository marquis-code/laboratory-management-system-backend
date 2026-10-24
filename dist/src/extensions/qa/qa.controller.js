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
exports.QaController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const parse_object_id_pipe_1 = require("../../common/pipes/parse-object-id.pipe");
const qa_dto_1 = require("./dto/qa.dto");
const qa_service_1 = require("./qa.service");
let QaController = class QaController {
    qa;
    constructor(qa) {
        this.qa = qa;
    }
    list(query, user) {
        return this.qa.list(query, user);
    }
    stats(user) {
        return this.qa.stats(user);
    }
    detail(id) {
        return this.qa.get(id);
    }
    create(dto, user) {
        return this.qa.create(dto, user);
    }
    assign(id, dto, user) {
        return this.qa.assign(id, dto, user);
    }
    start(id, dto, user) {
        return this.qa.start(id, dto, user);
    }
    complete(id, dto, user) {
        return this.qa.complete(id, dto, user);
    }
};
exports.QaController = QaController;
__decorate([
    (0, common_1.Get)('reviews'),
    (0, auth_decorators_1.Roles)('PATHOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'List peer reviews, second opinions and discrepancies' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [qa_dto_1.QaQueryDto, Object]),
    __metadata("design:returntype", void 0)
], QaController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, auth_decorators_1.Roles)('PATHOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'QA workload and discrepancy summary' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QaController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)('reviews/:id'),
    (0, auth_decorators_1.Roles)('PATHOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'QA review detail' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QaController.prototype, "detail", null);
__decorate([
    (0, common_1.Post)('reviews'),
    (0, auth_decorators_1.Roles)('PATHOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Request a peer review, second opinion or discrepancy review' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [qa_dto_1.CreateQaReviewDto, Object]),
    __metadata("design:returntype", void 0)
], QaController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('reviews/:id/assign'),
    (0, auth_decorators_1.Roles)('PATHOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a pathologist reviewer' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, qa_dto_1.AssignQaReviewDto, Object]),
    __metadata("design:returntype", void 0)
], QaController.prototype, "assign", null);
__decorate([
    (0, common_1.Post)('reviews/:id/start'),
    (0, auth_decorators_1.Roles)('PATHOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Start review work' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, qa_dto_1.StartQaReviewDto, Object]),
    __metadata("design:returntype", void 0)
], QaController.prototype, "start", null);
__decorate([
    (0, common_1.Post)('reviews/:id/complete'),
    (0, auth_decorators_1.Roles)('PATHOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Record agreement or a coded discrepancy' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, qa_dto_1.CompleteQaReviewDto, Object]),
    __metadata("design:returntype", void 0)
], QaController.prototype, "complete", null);
exports.QaController = QaController = __decorate([
    (0, swagger_1.ApiTags)('Quality assurance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('qa'),
    __metadata("design:paramtypes", [qa_service_1.QaService])
], QaController);
//# sourceMappingURL=qa.controller.js.map