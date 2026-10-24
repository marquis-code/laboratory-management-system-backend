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
exports.ProtocolListQueryDto = exports.UpdateProtocolDto = exports.CreateProtocolDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateProtocolDto {
    key;
    title;
    cancerType;
    subspecialty;
    content;
    static _OPENAPI_METADATA_FACTORY() {
        return { key: { required: true, type: () => String, minLength: 2, maxLength: 60, pattern: "^[a-z][a-z0-9_]*$" }, title: { required: true, type: () => String, minLength: 2, maxLength: 200 }, cancerType: { required: true, type: () => String, minLength: 2, maxLength: 120 }, subspecialty: { required: true, type: () => String, minLength: 2, maxLength: 80 }, content: { required: true, type: "object", additionalProperties: true } };
    }
}
exports.CreateProtocolDto = CreateProtocolDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'breast_carcinoma' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(60),
    (0, class_validator_1.Matches)(/^[a-z][a-z0-9_]*$/, { message: 'key must be lower_snake_case.' }),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Breast carcinoma synoptic report' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Invasive breast carcinoma' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "cancerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Breast' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "subspecialty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object, description: 'ProtocolContent: sections and fields' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmptyObject)(),
    __metadata("design:type", Object)
], CreateProtocolDto.prototype, "content", void 0);
class UpdateProtocolDto {
    title;
    cancerType;
    subspecialty;
    content;
    active;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String, minLength: 2, maxLength: 200 }, cancerType: { required: false, type: () => String, minLength: 2, maxLength: 120 }, subspecialty: { required: false, type: () => String, minLength: 2, maxLength: 80 }, content: { required: false, type: "object", additionalProperties: true }, active: { required: false, type: () => Boolean } };
    }
}
exports.UpdateProtocolDto = UpdateProtocolDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateProtocolDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], UpdateProtocolDto.prototype, "cancerType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], UpdateProtocolDto.prototype, "subspecialty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmptyObject)(),
    __metadata("design:type", Object)
], UpdateProtocolDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProtocolDto.prototype, "active", void 0);
class ProtocolListQueryDto {
    subspecialty;
    active;
    static _OPENAPI_METADATA_FACTORY() {
        return { subspecialty: { required: false, type: () => String, maxLength: 80 }, active: { required: false, type: () => Boolean } };
    }
}
exports.ProtocolListQueryDto = ProtocolListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], ProtocolListQueryDto.prototype, "subspecialty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === 'true' ? true : value === 'false' ? false : undefined)),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProtocolListQueryDto.prototype, "active", void 0);
//# sourceMappingURL=protocol.dto.js.map