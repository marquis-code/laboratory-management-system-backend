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
exports.Hl7Controller = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const parse_object_id_pipe_1 = require("../../common/pipes/parse-object-id.pipe");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const hl7_dto_1 = require("./dto/hl7.dto");
const hl7_service_1 = require("./hl7.service");
let Hl7Controller = class Hl7Controller {
    hl7;
    constructor(hl7) {
        this.hl7 = hl7;
    }
    ingest(dto) {
        return this.hl7.ingest(dto.message);
    }
    oru(caseId) {
        return this.hl7.buildOru(caseId);
    }
};
exports.Hl7Controller = Hl7Controller;
__decorate([
    (0, common_1.Post)('messages'),
    (0, auth_decorators_1.Roles)('LAB_ADMIN', 'SUPER_ADMIN', 'TECHNOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Ingest an HL7 v2 ORM/OML order and return an ACK' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hl7_dto_1.Hl7MessageDto]),
    __metadata("design:returntype", void 0)
], Hl7Controller.prototype, "ingest", null);
__decorate([
    (0, common_1.Get)('oru/:caseId'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'PATHOLOGIST'),
    (0, common_1.Header)('Content-Type', 'text/plain; charset=utf-8'),
    (0, swagger_1.ApiOperation)({ summary: 'Render a signed report as an HL7 v2 ORU^R01 message' }),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('caseId', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Hl7Controller.prototype, "oru", null);
exports.Hl7Controller = Hl7Controller = __decorate([
    (0, swagger_1.ApiTags)('HL7 v2'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('interop/hl7'),
    __metadata("design:paramtypes", [hl7_service_1.Hl7Service])
], Hl7Controller);
//# sourceMappingURL=hl7.controller.js.map