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
exports.CustodyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const discipline_decorator_1 = require("../discipline/discipline.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const parse_object_id_pipe_1 = require("../../common/pipes/parse-object-id.pipe");
const scan_dto_1 = require("./dto/scan.dto");
const idempotency_service_1 = require("../../common/idempotency/idempotency.service");
const custody_ports_1 = require("./custody-ports");
let CustodyController = class CustodyController {
    ports;
    idempotency;
    constructor(ports, idempotency) {
        this.ports = ports;
        this.idempotency = idempotency;
    }
    async scan(dto, idempotencyKey) {
        const handler = this.ports.scanHandler;
        if (!handler)
            throw new common_1.ServiceUnavailableException('No scan handler is registered for this laboratory.');
        if (!idempotencyKey)
            return handler.scan(dto);
        const result = await this.idempotency.run(idempotencyKey, this.idempotency.hash(dto), 'custody-scan', () => handler.scan(dto));
        return result.value;
    }
    locate(barcode) {
        return this.locator().locate(barcode);
    }
    caseTimeline(caseId) {
        return this.locator().caseTimeline(caseId);
    }
    entityTimeline(entityType, entityId) {
        return this.locator().entityTimeline(entityType, entityId);
    }
    locator() {
        const handler = this.ports.locatorHandler;
        if (!handler)
            throw new common_1.ServiceUnavailableException('No locator handler is registered for this laboratory.');
        return handler;
    }
};
exports.CustodyController = CustodyController;
__decorate([
    (0, common_1.Post)('scan'),
    (0, discipline_decorator_1.Discipline)('HISTOPATHOLOGY'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)('GROSSER', 'TECHNOLOGIST', 'PATHOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({
        summary: 'Scan a barcode at a station and advance its state machine',
        description: 'The station determines the event. Invalid transitions return 409 with the allowed next states.',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('idempotency-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [scan_dto_1.ScanDto, String]),
    __metadata("design:returntype", Promise)
], CustodyController.prototype, "scan", null);
__decorate([
    (0, common_1.Get)('locator/:barcode'),
    (0, discipline_decorator_1.Discipline)('HISTOPATHOLOGY'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'GROSSER', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Locate a specimen, block or slide and return its custody timeline' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('barcode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustodyController.prototype, "locate", null);
__decorate([
    (0, common_1.Get)('case/:caseId/timeline'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'GROSSER', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Full case custody timeline' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('caseId', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustodyController.prototype, "caseTimeline", null);
__decorate([
    (0, common_1.Get)('entity/:entityType/:entityId/timeline'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'GROSSER', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Custody timeline for one specimen, block or slide' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('entityId', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustodyController.prototype, "entityTimeline", null);
exports.CustodyController = CustodyController = __decorate([
    (0, swagger_1.ApiTags)('Custody'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('custody'),
    __metadata("design:paramtypes", [custody_ports_1.CustodyPortRegistry,
        idempotency_service_1.IdempotencyService])
], CustodyController);
//# sourceMappingURL=custody.controller.js.map