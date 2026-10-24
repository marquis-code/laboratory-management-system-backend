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
exports.PortalVerifyDto = exports.PortalRequestDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PortalRequestDto {
    labCode;
    email;
    static _OPENAPI_METADATA_FACTORY() {
        return { labCode: { required: true, type: () => String, minLength: 2, maxLength: 32 }, email: { required: true, type: () => String, maxLength: 160, format: "email" } };
    }
}
exports.PortalRequestDto = PortalRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HISTO' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(32),
    __metadata("design:type", String)
], PortalRequestDto.prototype, "labCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'referrer@clinic.ng' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], PortalRequestDto.prototype, "email", void 0);
class PortalVerifyDto {
    labCode;
    email;
    code;
    token;
    static _OPENAPI_METADATA_FACTORY() {
        return { labCode: { required: true, type: () => String, minLength: 2, maxLength: 32 }, email: { required: true, type: () => String, maxLength: 160, format: "email" }, code: { required: false, type: () => String, pattern: "^\\d{6}$" }, token: { required: false, type: () => String, minLength: 20, maxLength: 200 } };
    }
}
exports.PortalVerifyDto = PortalVerifyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HISTO' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(32),
    __metadata("design:type", String)
], PortalVerifyDto.prototype, "labCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'referrer@clinic.ng' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], PortalVerifyDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123456' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{6}$/),
    __metadata("design:type", String)
], PortalVerifyDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(20),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], PortalVerifyDto.prototype, "token", void 0);
//# sourceMappingURL=portal.dto.js.map