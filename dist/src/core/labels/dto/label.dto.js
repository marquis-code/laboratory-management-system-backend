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
exports.CaseLabelQueryDto = exports.LabelQueryDto = exports.LABEL_INCLUDES = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const shared_1 = require("@lims/shared");
exports.LABEL_INCLUDES = ['all', 'specimens', 'blocks', 'slides'];
class LabelQueryDto {
    format;
    symbology;
    static _OPENAPI_METADATA_FACTORY() {
        return { format: { required: false, enum: ["pdf", "zpl", "svg"] }, symbology: { required: false, enum: ["datamatrix", "qr"] } };
    }
}
exports.LabelQueryDto = LabelQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.LABEL_FORMATS, default: 'pdf' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.LABEL_FORMATS),
    __metadata("design:type", String)
], LabelQueryDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.LABEL_SYMBOLOGIES, default: 'datamatrix' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.LABEL_SYMBOLOGIES),
    __metadata("design:type", String)
], LabelQueryDto.prototype, "symbology", void 0);
class CaseLabelQueryDto extends LabelQueryDto {
    include;
    static _OPENAPI_METADATA_FACTORY() {
        return { include: { required: false, enum: ["specimens", "all", "slides", "blocks"] } };
    }
}
exports.CaseLabelQueryDto = CaseLabelQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: exports.LABEL_INCLUDES, default: 'all' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(exports.LABEL_INCLUDES),
    __metadata("design:type", String)
], CaseLabelQueryDto.prototype, "include", void 0);
//# sourceMappingURL=label.dto.js.map