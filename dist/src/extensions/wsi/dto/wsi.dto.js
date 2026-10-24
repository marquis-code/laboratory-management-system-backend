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
exports.WsiWebhookDto = exports.LinkWsiDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const shared_1 = require("@lims/shared");
class LinkWsiDto {
    url;
    viewerUrl;
    scanner;
    magnification;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { url: { required: true, type: () => String, maxLength: 2000, format: "uri" }, viewerUrl: { required: false, type: () => String, maxLength: 2000, format: "uri" }, scanner: { required: false, type: () => String, maxLength: 120 }, magnification: { required: false, type: () => String, maxLength: 40 }, notes: { required: false, type: () => String, maxLength: 1000 } };
    }
}
exports.LinkWsiDto = LinkWsiDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://wsi.example.org/scans/SL-01J8Z9.tif' }),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true }),
    (0, class_validator_1.MaxLength)(2_000),
    __metadata("design:type", String)
], LinkWsiDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://viewer.example.org/slide/SL-01J8Z9' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true }),
    (0, class_validator_1.MaxLength)(2_000),
    __metadata("design:type", String)
], LinkWsiDto.prototype, "viewerUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], LinkWsiDto.prototype, "scanner", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], LinkWsiDto.prototype, "magnification", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1_000),
    __metadata("design:type", String)
], LinkWsiDto.prototype, "notes", void 0);
class WsiWebhookDto {
    labCode;
    barcode;
    url;
    status;
    scanner;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { labCode: { required: false, type: () => String, maxLength: 32 }, barcode: { required: true, type: () => String, minLength: 3, maxLength: 128 }, url: { required: true, type: () => String, maxLength: 2000, format: "uri" }, status: { required: false, enum: ["PROCESSING", "FAILED", "LINKED"] }, scanner: { required: false, type: () => String, maxLength: 120 }, metadata: { required: false, type: "object", additionalProperties: true } };
    }
}
exports.WsiWebhookDto = WsiWebhookDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'HISTO' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    __metadata("design:type", String)
], WsiWebhookDto.prototype, "labCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SL-HP-2026-000023-A1-1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", String)
], WsiWebhookDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true }),
    (0, class_validator_1.MaxLength)(2_000),
    __metadata("design:type", String)
], WsiWebhookDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.WSI_STATUSES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.WSI_STATUSES),
    __metadata("design:type", String)
], WsiWebhookDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], WsiWebhookDto.prototype, "scanner", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], WsiWebhookDto.prototype, "metadata", void 0);
//# sourceMappingURL=wsi.dto.js.map