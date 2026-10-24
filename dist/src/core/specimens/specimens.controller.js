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
exports.SpecimensController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const parse_object_id_pipe_1 = require("../../common/pipes/parse-object-id.pipe");
const specimen_dto_1 = require("./dto/specimen.dto");
const specimens_service_1 = require("./specimens.service");
let SpecimensController = class SpecimensController {
    specimensService;
    constructor(specimensService) {
        this.specimensService = specimensService;
    }
    list(query) {
        return this.specimensService.list(query);
    }
    reject(id, dto) {
        return this.specimensService.reject(id, dto.reason, dto.reasonCode);
    }
};
exports.SpecimensController = SpecimensController;
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'GROSSER', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'List specimens, optionally by case' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [specimen_dto_1.SpecimenListQueryDto]),
    __metadata("design:returntype", Promise)
], SpecimensController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, auth_decorators_1.Roles)('RECEPTIONIST', 'GROSSER', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a specimen with a reason' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, specimen_dto_1.RejectSpecimenDto]),
    __metadata("design:returntype", Promise)
], SpecimensController.prototype, "reject", null);
exports.SpecimensController = SpecimensController = __decorate([
    (0, swagger_1.ApiTags)('Specimens'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('specimens'),
    __metadata("design:paramtypes", [specimens_service_1.SpecimensService])
], SpecimensController);
//# sourceMappingURL=specimens.controller.js.map