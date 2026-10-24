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
exports.PreanalyticsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const actor_1 = require("../../common/utils/actor");
const preanalytics_service_1 = require("./preanalytics.service");
let PreanalyticsController = class PreanalyticsController {
    preanalytics;
    constructor(preanalytics) {
        this.preanalytics = preanalytics;
    }
    centres() {
        return this.preanalytics.centres();
    }
    createCentre(body) {
        return this.preanalytics.createCentre(body, (0, actor_1.currentActor)());
    }
    consignments() {
        return this.preanalytics.consignments();
    }
    createConsignment(body) {
        return this.preanalytics.createConsignment(body, (0, actor_1.currentActor)());
    }
    dispatch(id) {
        return this.preanalytics.dispatch(id, (0, actor_1.currentActor)());
    }
    receive(id, body) {
        return this.preanalytics.receive(id, body, (0, actor_1.currentActor)());
    }
};
exports.PreanalyticsController = PreanalyticsController;
__decorate([
    (0, common_1.Get)('centres'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'PHLEBOTOMIST', 'SCIENTIST', 'TECHNOLOGIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PreanalyticsController.prototype, "centres", null);
__decorate([
    (0, common_1.Post)('centres'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PreanalyticsController.prototype, "createCentre", null);
__decorate([
    (0, common_1.Get)('consignments'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'PHLEBOTOMIST', 'SCIENTIST', 'TECHNOLOGIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PreanalyticsController.prototype, "consignments", null);
__decorate([
    (0, common_1.Post)('consignments'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'PHLEBOTOMIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PreanalyticsController.prototype, "createConsignment", null);
__decorate([
    (0, common_1.Post)('consignments/:id/dispatch'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'PHLEBOTOMIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PreanalyticsController.prototype, "dispatch", null);
__decorate([
    (0, common_1.Post)('consignments/:id/receive'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'PHLEBOTOMIST', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PreanalyticsController.prototype, "receive", null);
exports.PreanalyticsController = PreanalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Pre-analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('preanalytics'),
    __metadata("design:paramtypes", [preanalytics_service_1.PreanalyticsService])
], PreanalyticsController);
//# sourceMappingURL=preanalytics.controller.js.map