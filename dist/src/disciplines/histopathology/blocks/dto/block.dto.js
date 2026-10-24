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
exports.BlockListQueryDto = exports.GrossBlockDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const shared_1 = require("@lims/shared");
const pagination_query_dto_1 = require("../../../../common/dto/pagination-query.dto");
class GrossBlockDto {
    specimenId;
    grossDescription;
    blockCount;
    blockDescriptions;
    static _OPENAPI_METADATA_FACTORY() {
        return { specimenId: { required: true, type: () => String }, grossDescription: { required: true, type: () => String, minLength: 5, maxLength: 10000 }, blockCount: { required: true, type: () => Number, minimum: 1, maximum: shared_1.MAX_BLOCK_COUNT }, blockDescriptions: { required: false, type: () => [String], maxLength: 2000 } };
    }
}
exports.GrossBlockDto = GrossBlockDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], GrossBlockDto.prototype, "specimenId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Received in formalin: three cores of tan tissue...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(10_000),
    __metadata("design:type", String)
], GrossBlockDto.prototype, "grossDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, maximum: shared_1.MAX_BLOCK_COUNT }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(shared_1.MAX_BLOCK_COUNT),
    __metadata("design:type", Number)
], GrossBlockDto.prototype, "blockCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(shared_1.MAX_BLOCK_COUNT),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(2_000, { each: true }),
    __metadata("design:type", Array)
], GrossBlockDto.prototype, "blockDescriptions", void 0);
class BlockListQueryDto extends pagination_query_dto_1.PaginationQueryDto {
    caseId;
    specimenId;
    static _OPENAPI_METADATA_FACTORY() {
        return { caseId: { required: false, type: () => String }, specimenId: { required: false, type: () => String } };
    }
}
exports.BlockListQueryDto = BlockListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BlockListQueryDto.prototype, "caseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BlockListQueryDto.prototype, "specimenId", void 0);
//# sourceMappingURL=block.dto.js.map