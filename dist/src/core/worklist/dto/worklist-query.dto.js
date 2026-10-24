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
exports.WorklistQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const shared_1 = require("@lims/shared");
class WorklistQueryDto {
    status;
    priority;
    assigned;
    discipline;
    subspecialty;
    pathologistId;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: ["RECEIVED", "IN_PROGRESS", "PENDING_REVIEW", "AMENDED"] }, priority: { required: false, enum: ["ROUTINE", "URGENT", "FROZEN"] }, assigned: { required: false, enum: ["me", "unassigned", "all"] }, discipline: { required: false, enum: ["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"] }, subspecialty: { required: false, type: () => String, maxLength: 80 }, pathologistId: { required: false, type: () => String }, limit: { required: false, type: () => Number, minimum: 1, maximum: 100 } };
    }
}
exports.WorklistQueryDto = WorklistQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['RECEIVED', 'IN_PROGRESS', 'PENDING_REVIEW', 'AMENDED'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['RECEIVED', 'IN_PROGRESS', 'PENDING_REVIEW', 'AMENDED']),
    __metadata("design:type", String)
], WorklistQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['ROUTINE', 'URGENT', 'FROZEN'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['ROUTINE', 'URGENT', 'FROZEN']),
    __metadata("design:type", String)
], WorklistQueryDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['me', 'unassigned', 'all'], default: 'all' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['me', 'unassigned', 'all']),
    __metadata("design:type", String)
], WorklistQueryDto.prototype, "assigned", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.DISCIPLINES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.DISCIPLINES),
    __metadata("design:type", String)
], WorklistQueryDto.prototype, "discipline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], WorklistQueryDto.prototype, "subspecialty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], WorklistQueryDto.prototype, "pathologistId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], WorklistQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=worklist-query.dto.js.map