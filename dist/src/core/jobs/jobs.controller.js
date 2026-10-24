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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const roles_guard_1 = require("../../common/guards/roles.guard");
const tat_check_service_1 = require("./tat-check.service");
let JobsController = class JobsController {
    tatCheck;
    constructor(tatCheck) {
        this.tatCheck = tatCheck;
    }
    async runTatCheck() {
        const flagged = await this.tatCheck.runCurrentLab();
        return { flagged };
    }
};
exports.JobsController = JobsController;
__decorate([
    (0, common_1.Post)('tat-check'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, auth_decorators_1.Roles)('LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Run the TAT breach check for this laboratory now' }),
    openapi.ApiResponse({ status: 201 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "runTatCheck", null);
exports.JobsController = JobsController = __decorate([
    (0, swagger_1.ApiTags)('Maintenance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('maintenance'),
    __metadata("design:paramtypes", [tat_check_service_1.TatCheckService])
], JobsController);
//# sourceMappingURL=jobs.controller.js.map