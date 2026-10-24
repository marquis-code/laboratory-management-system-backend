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
exports.ProtocolsController = void 0;
const openapi = require("@nestjs/swagger");
const discipline_decorator_1 = require("../../../core/discipline/discipline.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const auth_decorators_1 = require("../../../common/decorators/auth.decorators");
const parse_object_id_pipe_1 = require("../../../common/pipes/parse-object-id.pipe");
const protocol_dto_1 = require("./dto/protocol.dto");
const protocols_service_1 = require("./protocols.service");
let ProtocolsController = class ProtocolsController {
    protocolsService;
    constructor(protocolsService) {
        this.protocolsService = protocolsService;
    }
    list(query) {
        return this.protocolsService.list(query);
    }
    get(id) {
        return this.protocolsService.get(id);
    }
    create(user, dto) {
        return this.protocolsService.create(dto, user);
    }
    update(id, user, dto) {
        return this.protocolsService.update(id, dto, user);
    }
    deactivate(id, user) {
        return this.protocolsService.deactivate(id, user);
    }
};
exports.ProtocolsController = ProtocolsController;
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST', 'RECEPTIONIST', 'GROSSER', 'TECHNOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'List active synoptic protocols' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [protocol_dto_1.ProtocolListQueryDto]),
    __metadata("design:returntype", Promise)
], ProtocolsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one synoptic protocol' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProtocolsController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorators_1.Roles)('LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a synoptic protocol (version 1)' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, protocol_dto_1.CreateProtocolDto]),
    __metadata("design:returntype", Promise)
], ProtocolsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorators_1.Roles)('LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a protocol; content changes create a new version' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, protocol_dto_1.UpdateProtocolDto]),
    __metadata("design:returntype", Promise)
], ProtocolsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorators_1.Roles)('LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a protocol (never hard-deleted)' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProtocolsController.prototype, "deactivate", null);
exports.ProtocolsController = ProtocolsController = __decorate([
    (0, swagger_1.ApiTags)('Protocols'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, discipline_decorator_1.Discipline)('HISTOPATHOLOGY'),
    (0, common_1.Controller)('protocols'),
    __metadata("design:paramtypes", [protocols_service_1.ProtocolsService])
], ProtocolsController);
//# sourceMappingURL=protocols.controller.js.map