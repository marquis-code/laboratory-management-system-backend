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
exports.InstrumentsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const instruments_service_1 = require("./instruments.service");
let InstrumentsController = class InstrumentsController {
    instruments;
    constructor(instruments) {
        this.instruments = instruments;
    }
    ingest(body) {
        return this.instruments.ingest(body.protocol, body.message);
    }
    list() {
        return this.instruments.list();
    }
};
exports.InstrumentsController = InstrumentsController;
__decorate([
    (0, common_1.Post)('messages'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InstrumentsController.prototype, "ingest", null);
__decorate([
    (0, common_1.Get)('messages'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'SCIENTIST', 'TECHNOLOGIST', 'PATHOLOGIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InstrumentsController.prototype, "list", null);
exports.InstrumentsController = InstrumentsController = __decorate([
    (0, swagger_1.ApiTags)('Instrument connector'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('instruments'),
    __metadata("design:paramtypes", [instruments_service_1.InstrumentsService])
], InstrumentsController);
//# sourceMappingURL=instruments.controller.js.map