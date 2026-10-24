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
exports.SlideListQueryDto = exports.RecutRequestDto = exports.StainRequestDto = exports.CutSlidesDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const shared_1 = require("@lims/shared");
const pagination_query_dto_1 = require("../../../../common/dto/pagination-query.dto");
class CutSlidesDto {
    blockId;
    count;
    stainType;
    specialStain;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { blockId: { required: true, type: () => String }, count: { required: true, type: () => Number, minimum: 1, maximum: shared_1.MAX_SLIDE_COUNT }, stainType: { required: false, enum: ["H_AND_E", "SPECIAL", "IMMUNOHISTOCHEMISTRY"] }, specialStain: { required: false, type: () => String, maxLength: 160 }, notes: { required: false, type: () => String, maxLength: 2000 } };
    }
}
exports.CutSlidesDto = CutSlidesDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CutSlidesDto.prototype, "blockId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, maximum: shared_1.MAX_SLIDE_COUNT }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(shared_1.MAX_SLIDE_COUNT),
    __metadata("design:type", Number)
], CutSlidesDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.STAIN_TYPES, default: 'H_AND_E' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.STAIN_TYPES),
    __metadata("design:type", String)
], CutSlidesDto.prototype, "stainType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Cytokeratin 7' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], CutSlidesDto.prototype, "specialStain", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2_000),
    __metadata("design:type", String)
], CutSlidesDto.prototype, "notes", void 0);
class StainRequestDto {
    blockId;
    stainType;
    specialStain;
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { blockId: { required: true, type: () => String }, stainType: { required: true, enum: ["SPECIAL", "IMMUNOHISTOCHEMISTRY"] }, specialStain: { required: true, type: () => String, minLength: 1, maxLength: 160 }, reason: { required: true, type: () => String, minLength: 5, maxLength: 1000 } };
    }
}
exports.StainRequestDto = StainRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], StainRequestDto.prototype, "blockId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['SPECIAL', 'IMMUNOHISTOCHEMISTRY'] }),
    (0, class_validator_1.IsEnum)(['SPECIAL', 'IMMUNOHISTOCHEMISTRY']),
    __metadata("design:type", String)
], StainRequestDto.prototype, "stainType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CK20' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], StainRequestDto.prototype, "specialStain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(1_000),
    __metadata("design:type", String)
], StainRequestDto.prototype, "reason", void 0);
class RecutRequestDto {
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { reason: { required: true, type: () => String, minLength: 5, maxLength: 1000 } };
    }
}
exports.RecutRequestDto = RecutRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Section is folded; recut at 3 microns.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(1_000),
    __metadata("design:type", String)
], RecutRequestDto.prototype, "reason", void 0);
class SlideListQueryDto extends pagination_query_dto_1.PaginationQueryDto {
    caseId;
    blockId;
    static _OPENAPI_METADATA_FACTORY() {
        return { caseId: { required: false, type: () => String }, blockId: { required: false, type: () => String } };
    }
}
exports.SlideListQueryDto = SlideListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], SlideListQueryDto.prototype, "caseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], SlideListQueryDto.prototype, "blockId", void 0);
//# sourceMappingURL=slide.dto.js.map