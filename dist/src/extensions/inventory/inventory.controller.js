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
exports.InventoryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const parse_object_id_pipe_1 = require("../../common/pipes/parse-object-id.pipe");
const inventory_dto_1 = require("./dto/inventory.dto");
const inventory_service_1 = require("./inventory.service");
let InventoryController = class InventoryController {
    inventory;
    constructor(inventory) {
        this.inventory = inventory;
    }
    lots(query) {
        return this.inventory.listLots(query);
    }
    createLot(dto, user) {
        return this.inventory.createLot(dto, user);
    }
    updateLot(id, dto, user) {
        return this.inventory.updateLot(id, dto, user);
    }
    validateLot(id, dto, user) {
        return this.inventory.validateLot(id, dto, user);
    }
    rejectLot(id, dto, user) {
        return this.inventory.rejectLot(id, dto, user);
    }
    adjustLot(id, dto, user) {
        return this.inventory.adjustLot(id, dto, user);
    }
    runs(query) {
        return this.inventory.listRuns(query);
    }
    createRun(dto, user) {
        return this.inventory.createRun(dto, user);
    }
    completeRun(id, dto, user) {
        return this.inventory.completeRun(id, dto, user);
    }
    expiryCheck() {
        return this.inventory.checkExpiries();
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('lots'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'List reagent and antibody lots with expiry state' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inventory_dto_1.ReagentLotQueryDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "lots", null);
__decorate([
    (0, common_1.Post)('lots'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'TECHNOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a received reagent or antibody lot in quarantine' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inventory_dto_1.CreateReagentLotDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createLot", null);
__decorate([
    (0, common_1.Patch)('lots/:id'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'TECHNOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Update lot storage, expiry or quantity' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, inventory_dto_1.UpdateReagentLotDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateLot", null);
__decorate([
    (0, common_1.Post)('lots/:id/validate'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate a quarantined lot and make it usable' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, inventory_dto_1.ValidateLotDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "validateLot", null);
__decorate([
    (0, common_1.Post)('lots/:id/reject'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a lot after QC failure' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, inventory_dto_1.ValidateLotDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "rejectLot", null);
__decorate([
    (0, common_1.Post)('lots/:id/adjust'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'TECHNOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Adjust lot stock with an audit trail' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, inventory_dto_1.AdjustLotDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "adjustLot", null);
__decorate([
    (0, common_1.Get)('stain-runs'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'List stain runs linked to reagent lots' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inventory_dto_1.StainRunQueryDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "runs", null);
__decorate([
    (0, common_1.Post)('stain-runs'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'TECHNOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Start a stain run; rejects expired or unvalidated lots' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inventory_dto_1.CreateStainRunDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createRun", null);
__decorate([
    (0, common_1.Post)('stain-runs/:id/complete'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'TECHNOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Record QC; a passing run marks the linked slide STAINED' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, inventory_dto_1.CompleteStainRunDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "completeRun", null);
__decorate([
    (0, common_1.Post)('expiry-check'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Run expiry alerts now' }),
    openapi.ApiResponse({ status: 201, type: Number }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "expiryCheck", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('Inventory'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map