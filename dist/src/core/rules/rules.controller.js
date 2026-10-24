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
exports.RulesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const actor_1 = require("../../common/utils/actor");
const rules_service_1 = require("./rules.service");
let RulesController = class RulesController {
    rules;
    constructor(rules) {
        this.rules = rules;
    }
    list(discipline, active) {
        return this.rules.list(discipline, active === undefined ? undefined : active === 'true');
    }
    create(body) {
        return this.rules.create(body, (0, actor_1.currentActor)());
    }
    update(id, body) {
        return this.rules.update(id, body, (0, actor_1.currentActor)());
    }
    executions(resultSetId) {
        return this.rules.executions(resultSetId);
    }
};
exports.RulesController = RulesController;
__decorate([
    openapi.ApiQuery({ name: "discipline", required: false }),
    openapi.ApiQuery({ name: "active", required: false }),
    (0, common_1.Get)(),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('discipline')),
    __param(1, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RulesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RulesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RulesController.prototype, "update", null);
__decorate([
    openapi.ApiQuery({ name: "resultSetId", required: false }),
    (0, common_1.Get)('executions'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST', 'SCIENTIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('resultSetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RulesController.prototype, "executions", null);
exports.RulesController = RulesController = __decorate([
    (0, swagger_1.ApiTags)('Rules'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('rules'),
    __metadata("design:paramtypes", [rules_service_1.RulesService])
], RulesController);
//# sourceMappingURL=rules.controller.js.map