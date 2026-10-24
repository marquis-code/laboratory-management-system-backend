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
exports.AmendReportDto = exports.ReleaseReportDto = exports.UpdateReportDto = exports.CodingDto = exports.CreateReportDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateReportDto {
    protocolId;
    static _OPENAPI_METADATA_FACTORY() {
        return { protocolId: { required: true, type: () => String } };
    }
}
exports.CreateReportDto = CreateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "protocolId", void 0);
class CodingDto {
    snomedCode;
    snomedDisplay;
    icdo3MorphologyCode;
    icdo3MorphologyDisplay;
    icdo3TopographyCode;
    icdo3TopographyDisplay;
    static _OPENAPI_METADATA_FACTORY() {
        return { snomedCode: { required: false, type: () => String, nullable: true, maxLength: 40 }, snomedDisplay: { required: false, type: () => String, nullable: true, maxLength: 240 }, icdo3MorphologyCode: { required: false, type: () => String, nullable: true, maxLength: 40 }, icdo3MorphologyDisplay: { required: false, type: () => String, nullable: true, maxLength: 240 }, icdo3TopographyCode: { required: false, type: () => String, nullable: true, maxLength: 40 }, icdo3TopographyDisplay: { required: false, type: () => String, nullable: true, maxLength: 240 } };
    }
}
exports.CodingDto = CodingDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", Object)
], CodingDto.prototype, "snomedCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(240),
    __metadata("design:type", Object)
], CodingDto.prototype, "snomedDisplay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", Object)
], CodingDto.prototype, "icdo3MorphologyCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(240),
    __metadata("design:type", Object)
], CodingDto.prototype, "icdo3MorphologyDisplay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", Object)
], CodingDto.prototype, "icdo3TopographyCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(240),
    __metadata("design:type", Object)
], CodingDto.prototype, "icdo3TopographyDisplay", void 0);
class UpdateReportDto {
    data;
    coding;
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: "object", additionalProperties: true }, coding: { required: false, type: () => require("./report.dto").CodingDto } };
    }
}
exports.UpdateReportDto = UpdateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object, description: 'Field key → value map for the protocol' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateReportDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: CodingDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CodingDto),
    __metadata("design:type", CodingDto)
], UpdateReportDto.prototype, "coding", void 0);
class ReleaseReportDto {
    note;
    static _OPENAPI_METADATA_FACTORY() {
        return { note: { required: false, type: () => String, maxLength: 500 } };
    }
}
exports.ReleaseReportDto = ReleaseReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], ReleaseReportDto.prototype, "note", void 0);
class AmendReportDto {
    reason;
    data;
    coding;
    static _OPENAPI_METADATA_FACTORY() {
        return { reason: { required: true, type: () => String, minLength: 10, maxLength: 2000 }, data: { required: false, type: "object", additionalProperties: true }, coding: { required: false, type: () => require("./report.dto").CodingDto } };
    }
}
exports.AmendReportDto = AmendReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Corrected HER2 score after repeat ISH.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(2_000),
    __metadata("design:type", String)
], AmendReportDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AmendReportDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: CodingDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CodingDto),
    __metadata("design:type", CodingDto)
], AmendReportDto.prototype, "coding", void 0);
//# sourceMappingURL=report.dto.js.map