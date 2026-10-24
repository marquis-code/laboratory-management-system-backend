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
exports.StainRunQueryDto = exports.CompleteStainRunDto = exports.CreateStainRunDto = exports.StainRunLotDto = exports.ReagentLotQueryDto = exports.AdjustLotDto = exports.ValidateLotDto = exports.UpdateReagentLotDto = exports.CreateReagentLotDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const shared_1 = require("@lims/shared");
const pagination_query_dto_1 = require("../../../common/dto/pagination-query.dto");
class CreateReagentLotDto {
    name;
    category;
    vendor;
    catalogNumber;
    lotNumber;
    storageLocation;
    quantity;
    unit;
    receivedAt;
    expiresAt;
    openedAt;
    reorderLevel;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 2, maxLength: 160 }, category: { required: true, enum: ["REAGENT", "ANTIBODY", "CONSUMABLE"] }, vendor: { required: true, type: () => String, minLength: 2, maxLength: 160 }, catalogNumber: { required: false, type: () => String, maxLength: 80 }, lotNumber: { required: true, type: () => String, minLength: 1, maxLength: 80 }, storageLocation: { required: false, type: () => String, maxLength: 120 }, quantity: { required: true, type: () => Number, minimum: 0 }, unit: { required: true, type: () => String, minLength: 1, maxLength: 32 }, receivedAt: { required: true, type: () => String }, expiresAt: { required: true, type: () => String }, openedAt: { required: false, type: () => String }, reorderLevel: { required: false, type: () => Number, minimum: 0 }, notes: { required: false, type: () => String, maxLength: 2000 } };
    }
}
exports.CreateReagentLotDto = CreateReagentLotDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], CreateReagentLotDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.REAGENT_CATEGORIES }),
    (0, class_validator_1.IsEnum)(shared_1.REAGENT_CATEGORIES),
    __metadata("design:type", String)
], CreateReagentLotDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], CreateReagentLotDto.prototype, "vendor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreateReagentLotDto.prototype, "catalogNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreateReagentLotDto.prototype, "lotNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateReagentLotDto.prototype, "storageLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateReagentLotDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'mL' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(32),
    __metadata("design:type", String)
], CreateReagentLotDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], CreateReagentLotDto.prototype, "receivedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], CreateReagentLotDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], CreateReagentLotDto.prototype, "openedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateReagentLotDto.prototype, "reorderLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2_000),
    __metadata("design:type", String)
], CreateReagentLotDto.prototype, "notes", void 0);
class UpdateReagentLotDto {
    name;
    vendor;
    storageLocation;
    openedAt;
    expiresAt;
    quantity;
    reorderLevel;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String, maxLength: 160 }, vendor: { required: false, type: () => String, maxLength: 160 }, storageLocation: { required: false, type: () => String, maxLength: 120 }, openedAt: { required: false, type: () => String }, expiresAt: { required: false, type: () => String }, quantity: { required: false, type: () => Number, minimum: 0 }, reorderLevel: { required: false, type: () => Number, minimum: 0 }, notes: { required: false, type: () => String, maxLength: 2000 } };
    }
}
exports.UpdateReagentLotDto = UpdateReagentLotDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], UpdateReagentLotDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], UpdateReagentLotDto.prototype, "vendor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], UpdateReagentLotDto.prototype, "storageLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], UpdateReagentLotDto.prototype, "openedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], UpdateReagentLotDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateReagentLotDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateReagentLotDto.prototype, "reorderLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2_000),
    __metadata("design:type", String)
], UpdateReagentLotDto.prototype, "notes", void 0);
class ValidateLotDto {
    note;
    static _OPENAPI_METADATA_FACTORY() {
        return { note: { required: false, type: () => String, maxLength: 500 } };
    }
}
exports.ValidateLotDto = ValidateLotDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], ValidateLotDto.prototype, "note", void 0);
class AdjustLotDto {
    delta;
    note;
    static _OPENAPI_METADATA_FACTORY() {
        return { delta: { required: true, type: () => Number }, note: { required: false, type: () => String, maxLength: 500 } };
    }
}
exports.AdjustLotDto = AdjustLotDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: -2.5, description: 'Positive or negative quantity change' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AdjustLotDto.prototype, "delta", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], AdjustLotDto.prototype, "note", void 0);
class ReagentLotQueryDto extends pagination_query_dto_1.PaginationQueryDto {
    q;
    category;
    status;
    expiringWithinDays;
    static _OPENAPI_METADATA_FACTORY() {
        return { q: { required: false, type: () => String, maxLength: 120 }, category: { required: false, enum: ["REAGENT", "ANTIBODY", "CONSUMABLE"] }, status: { required: false, type: () => String }, expiringWithinDays: { required: false, type: () => Number, minimum: 0, maximum: 365 } };
    }
}
exports.ReagentLotQueryDto = ReagentLotQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], ReagentLotQueryDto.prototype, "q", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.REAGENT_CATEGORIES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.REAGENT_CATEGORIES),
    __metadata("design:type", String)
], ReagentLotQueryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['QUARANTINED', 'ACTIVE', 'EXPIRED', 'DEPLETED', 'REJECTED']),
    __metadata("design:type", String)
], ReagentLotQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(365),
    __metadata("design:type", Number)
], ReagentLotQueryDto.prototype, "expiringWithinDays", void 0);
class StainRunLotDto {
    lotId;
    quantityUsed;
    static _OPENAPI_METADATA_FACTORY() {
        return { lotId: { required: true, type: () => String }, quantityUsed: { required: true, type: () => Number, minimum: 0 } };
    }
}
exports.StainRunLotDto = StainRunLotDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], StainRunLotDto.prototype, "lotId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], StainRunLotDto.prototype, "quantityUsed", void 0);
class CreateStainRunDto {
    caseId;
    slideId;
    blockId;
    stainType;
    stainName;
    equipment;
    lots;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { caseId: { required: true, type: () => String }, slideId: { required: false, type: () => String }, blockId: { required: false, type: () => String }, stainType: { required: true, enum: ["H_AND_E", "SPECIAL", "IMMUNOHISTOCHEMISTRY"] }, stainName: { required: true, type: () => String, minLength: 1, maxLength: 160 }, equipment: { required: false, type: () => String, maxLength: 120 }, lots: { required: true, type: () => [require("./inventory.dto").StainRunLotDto], minItems: 1 }, notes: { required: false, type: () => String, maxLength: 2000 } };
    }
}
exports.CreateStainRunDto = CreateStainRunDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateStainRunDto.prototype, "caseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateStainRunDto.prototype, "slideId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateStainRunDto.prototype, "blockId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.STAIN_TYPES }),
    (0, class_validator_1.IsEnum)(shared_1.STAIN_TYPES),
    __metadata("design:type", String)
], CreateStainRunDto.prototype, "stainType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], CreateStainRunDto.prototype, "stainName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateStainRunDto.prototype, "equipment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [StainRunLotDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => StainRunLotDto),
    __metadata("design:type", Array)
], CreateStainRunDto.prototype, "lots", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2_000),
    __metadata("design:type", String)
], CreateStainRunDto.prototype, "notes", void 0);
class CompleteStainRunDto {
    qcResult;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { qcResult: { required: true, enum: ["PENDING", "PASS", "FAIL"] }, notes: { required: false, type: () => String, maxLength: 2000 } };
    }
}
exports.CompleteStainRunDto = CompleteStainRunDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.STAIN_QC_RESULTS }),
    (0, class_validator_1.IsEnum)(shared_1.STAIN_QC_RESULTS),
    __metadata("design:type", String)
], CompleteStainRunDto.prototype, "qcResult", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2_000),
    __metadata("design:type", String)
], CompleteStainRunDto.prototype, "notes", void 0);
class StainRunQueryDto extends pagination_query_dto_1.PaginationQueryDto {
    caseId;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { caseId: { required: false, type: () => String }, status: { required: false, enum: ["FAILED", "PLANNED", "RUNNING", "COMPLETED", "QC_HOLD"] } };
    }
}
exports.StainRunQueryDto = StainRunQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], StainRunQueryDto.prototype, "caseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.STAIN_RUN_STATUSES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.STAIN_RUN_STATUSES),
    __metadata("design:type", String)
], StainRunQueryDto.prototype, "status", void 0);
void class_validator_1.IsBoolean;
//# sourceMappingURL=inventory.dto.js.map