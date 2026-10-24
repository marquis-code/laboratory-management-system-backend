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
exports.UpdateLabDto = exports.TatHoursDto = exports.LetterheadDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const shared_1 = require("@lims/shared");
class LetterheadDto {
    phone;
    email;
    website;
    pathologistName;
    pathologistTitle;
    qualifications;
    signatureText;
    footerNote;
    static _OPENAPI_METADATA_FACTORY() {
        return { phone: { required: false, type: () => String, maxLength: 60 }, email: { required: false, type: () => String, maxLength: 160, format: "email" }, website: { required: false, type: () => String, maxLength: 200 }, pathologistName: { required: false, type: () => String, maxLength: 160 }, pathologistTitle: { required: false, type: () => String, maxLength: 160 }, qualifications: { required: false, type: () => String, maxLength: 200 }, signatureText: { required: false, type: () => String, maxLength: 300 }, footerNote: { required: false, type: () => String, maxLength: 500 } };
    }
}
exports.LetterheadDto = LetterheadDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], LetterheadDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], LetterheadDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], LetterheadDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], LetterheadDto.prototype, "pathologistName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], LetterheadDto.prototype, "pathologistTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], LetterheadDto.prototype, "qualifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], LetterheadDto.prototype, "signatureText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], LetterheadDto.prototype, "footerNote", void 0);
class TatHoursDto {
    FROZEN;
    URGENT;
    ROUTINE;
    static _OPENAPI_METADATA_FACTORY() {
        return { FROZEN: { required: false, type: () => Number, minimum: 0.25, maximum: 168 }, URGENT: { required: false, type: () => Number, minimum: 0.5, maximum: 720 }, ROUTINE: { required: false, type: () => Number, minimum: 1, maximum: 1440 } };
    }
}
exports.TatHoursDto = TatHoursDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.25),
    (0, class_validator_1.Max)(168),
    __metadata("design:type", Number)
], TatHoursDto.prototype, "FROZEN", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 24 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.5),
    (0, class_validator_1.Max)(720),
    __metadata("design:type", Number)
], TatHoursDto.prototype, "URGENT", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 72 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1_440),
    __metadata("design:type", Number)
], TatHoursDto.prototype, "ROUTINE", void 0);
class UpdateLabDto {
    name;
    address;
    phone;
    email;
    accessionPrefix;
    accessionFormat;
    tatHours;
    tatWarningPercent;
    timezone;
    qaSamplingPercent;
    currency;
    enabledDisciplines;
    accessionPrefixes;
    letterhead;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String, maxLength: 200 }, address: { required: false, type: () => String, maxLength: 500 }, phone: { required: false, type: () => String, maxLength: 60 }, email: { required: false, type: () => String, maxLength: 160, format: "email" }, accessionPrefix: { required: false, type: () => String, pattern: "^[A-Za-z0-9]{2,6}$" }, accessionFormat: { required: false, type: () => String, maxLength: 48, pattern: "^[A-Za-z0-9{}:_-]+$" }, tatHours: { required: false, type: () => require("./update-lab.dto").TatHoursDto }, tatWarningPercent: { required: false, type: () => Number, minimum: 50, maximum: 95 }, timezone: { required: false, type: () => String, maxLength: 80 }, qaSamplingPercent: { required: false, type: () => Number, minimum: 0, maximum: 100 }, currency: { required: false, type: () => String, pattern: "^[A-Za-z]{3}$" }, enabledDisciplines: { required: false, type: () => [Object], enum: ["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"], isArray: true }, accessionPrefixes: { required: false, type: () => Object }, letterhead: { required: false, type: () => require("./update-lab.dto").LetterheadDto } };
    }
}
exports.UpdateLabDto = UpdateLabDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateLabDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateLabDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], UpdateLabDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], UpdateLabDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'HP' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[A-Za-z0-9]{2,6}$/),
    __metadata("design:type", String)
], UpdateLabDto.prototype, "accessionPrefix", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '{PREFIX}-{YYYY}-{SEQ:6}' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(48),
    (0, class_validator_1.Matches)(/^[A-Za-z0-9{}:_-]+$/),
    __metadata("design:type", String)
], UpdateLabDto.prototype, "accessionFormat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: TatHoursDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TatHoursDto),
    __metadata("design:type", TatHoursDto)
], UpdateLabDto.prototype, "tatHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 80 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(50),
    (0, class_validator_1.Max)(95),
    __metadata("design:type", Number)
], UpdateLabDto.prototype, "tatWarningPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Africa/Lagos' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], UpdateLabDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 15 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateLabDto.prototype, "qaSamplingPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'NGN' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[A-Za-z]{3}$/),
    __metadata("design:type", String)
], UpdateLabDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.DISCIPLINES, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(shared_1.DISCIPLINES, { each: true }),
    __metadata("design:type", Array)
], UpdateLabDto.prototype, "enabledDisciplines", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Optional prefix override per discipline' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateLabDto.prototype, "accessionPrefixes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: LetterheadDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LetterheadDto),
    __metadata("design:type", LetterheadDto)
], UpdateLabDto.prototype, "letterhead", void 0);
//# sourceMappingURL=update-lab.dto.js.map