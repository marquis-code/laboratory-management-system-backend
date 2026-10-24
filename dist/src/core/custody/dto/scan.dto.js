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
exports.ScanDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const shared_1 = require("@lims/shared");
class ScanDto {
    barcode;
    station;
    eventType;
    reason;
    reasonCode;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { barcode: { required: true, type: () => String, minLength: 3, maxLength: 128 }, station: { required: true, enum: ["PATHOLOGIST", "PROCESSING", "GROSSING", "EMBEDDING", "MICROTOMY", "STAINING", "ARCHIVE"] }, eventType: { required: false, enum: ["RECUT_REQUESTED", "REJECTED"], enum: ['REJECTED', 'RECUT_REQUESTED'] }, reason: { required: false, type: () => String, maxLength: 1000 }, reasonCode: { required: false, type: () => String, maxLength: 60 }, metadata: { required: false, type: "object", additionalProperties: true } };
    }
}
exports.ScanDto = ScanDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'BL-01J8Z9K3QW' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(128),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value)),
    __metadata("design:type", String)
], ScanDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.STATIONS, example: 'PROCESSING' }),
    (0, class_validator_1.IsEnum)(shared_1.STATIONS),
    __metadata("design:type", String)
], ScanDto.prototype, "station", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['REJECTED', 'RECUT_REQUESTED'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['REJECTED', 'RECUT_REQUESTED']),
    __metadata("design:type", String)
], ScanDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1_000),
    __metadata("design:type", String)
], ScanDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'MISLABELLED' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], ScanDto.prototype, "reasonCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ScanDto.prototype, "metadata", void 0);
//# sourceMappingURL=scan.dto.js.map