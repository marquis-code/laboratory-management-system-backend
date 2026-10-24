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
exports.AuditListQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const shared_1 = require("@lims/shared");
const pagination_query_dto_1 = require("../../../common/dto/pagination-query.dto");
class AuditListQueryDto extends pagination_query_dto_1.PaginationQueryDto {
    action;
    entityType;
    entityId;
    userId;
    from;
    to;
    static _OPENAPI_METADATA_FACTORY() {
        return { action: { required: false, enum: ["CREATE", "UPDATE", "DELETE", "SCAN", "SIGN_OUT", "AMEND", "LOGIN", "LOGOUT", "RELEASE", "PAYMENT", "WEBHOOK", "SYNC", "QA", "EXPORT", "NOTIFY", "IMPORT"] }, entityType: { required: false, type: () => String, maxLength: 60 }, entityId: { required: false, type: () => String, maxLength: 60 }, userId: { required: false, type: () => String }, from: { required: false, type: () => String, pattern: "^\\d{4}-\\d{2}-\\d{2}(T.*)?$" }, to: { required: false, type: () => String, pattern: "^\\d{4}-\\d{2}-\\d{2}(T.*)?$" } };
    }
}
exports.AuditListQueryDto = AuditListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.AUDIT_ACTIONS }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.AUDIT_ACTIONS),
    __metadata("design:type", String)
], AuditListQueryDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Case' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], AuditListQueryDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], AuditListQueryDto.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], AuditListQueryDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-01-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}(T.*)?$/, { message: 'from must be an ISO date.' }),
    __metadata("design:type", String)
], AuditListQueryDto.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-12-31' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}(T.*)?$/, { message: 'to must be an ISO date.' }),
    __metadata("design:type", String)
], AuditListQueryDto.prototype, "to", void 0);
//# sourceMappingURL=audit-list-query.dto.js.map