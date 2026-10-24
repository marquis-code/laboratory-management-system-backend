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
exports.UserListQueryDto = exports.ResetPasswordDto = exports.UpdateUserDto = exports.CreateUserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const shared_1 = require("@lims/shared");
const class_transformer_1 = require("class-transformer");
const pagination_query_dto_1 = require("../../../common/dto/pagination-query.dto");
class CreateUserDto {
    name;
    email;
    password;
    role;
    phone;
    disciplines;
    subspecialties;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 2, maxLength: 150 }, email: { required: true, type: () => String, maxLength: 160, format: "email" }, password: { required: true, type: () => String, minLength: 8, maxLength: 128, pattern: "[A-Za-z]" }, role: { required: true, enum: ["SUPER_ADMIN", "LAB_ADMIN", "RECEPTIONIST", "PHLEBOTOMIST", "GROSSER", "TECHNOLOGIST", "SCIENTIST", "PATHOLOGIST", "REFERRER"] }, phone: { required: false, type: () => String, maxLength: 40 }, disciplines: { required: false, type: () => [Object], enum: ["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"], isArray: true, maxItems: 4 }, subspecialties: { required: false, type: () => [String], maxLength: 80, maxItems: 20 } };
    }
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dr Adaeze Okafor' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pathologist@histo.ng' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ChangeMe#2026' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(128),
    (0, class_validator_1.Matches)(/[A-Za-z]/, { message: 'Password must include a letter.' }),
    (0, class_validator_1.Matches)(/\d/, { message: 'Password must include a number.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.ROLES }),
    (0, class_validator_1.IsEnum)(shared_1.ROLES),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+234 803 000 0000' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.DISCIPLINES, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(4),
    (0, class_validator_1.IsEnum)(shared_1.DISCIPLINES, { each: true }),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "disciplines", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], example: ['Breast', 'Gastrointestinal'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(20),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(80, { each: true }),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "subspecialties", void 0);
class UpdateUserDto {
    name;
    role;
    active;
    phone;
    disciplines;
    subspecialties;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String, minLength: 2, maxLength: 150 }, role: { required: false, enum: ["SUPER_ADMIN", "LAB_ADMIN", "RECEPTIONIST", "PHLEBOTOMIST", "GROSSER", "TECHNOLOGIST", "SCIENTIST", "PATHOLOGIST", "REFERRER"] }, active: { required: false, type: () => Boolean }, phone: { required: false, type: () => String, maxLength: 40 }, disciplines: { required: false, type: () => [Object], enum: ["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"], isArray: true, maxItems: 4 }, subspecialties: { required: false, type: () => [String], maxLength: 80, maxItems: 20 } };
    }
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.ROLES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.ROLES),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.DISCIPLINES, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(4),
    (0, class_validator_1.IsEnum)(shared_1.DISCIPLINES, { each: true }),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "disciplines", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(20),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(80, { each: true }),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "subspecialties", void 0);
class ResetPasswordDto {
    password;
    static _OPENAPI_METADATA_FACTORY() {
        return { password: { required: true, type: () => String, minLength: 8, maxLength: 128, pattern: "[A-Za-z]" } };
    }
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(128),
    (0, class_validator_1.Matches)(/[A-Za-z]/, { message: 'Password must include a letter.' }),
    (0, class_validator_1.Matches)(/\d/, { message: 'Password must include a number.' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "password", void 0);
class UserListQueryDto extends pagination_query_dto_1.PaginationQueryDto {
    role;
    active;
    q;
    static _OPENAPI_METADATA_FACTORY() {
        return { role: { required: false, enum: ["SUPER_ADMIN", "LAB_ADMIN", "RECEPTIONIST", "PHLEBOTOMIST", "GROSSER", "TECHNOLOGIST", "SCIENTIST", "PATHOLOGIST", "REFERRER"] }, active: { required: false, type: () => Boolean }, q: { required: false, type: () => String, maxLength: 120 } };
    }
}
exports.UserListQueryDto = UserListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.ROLES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.ROLES),
    __metadata("design:type", String)
], UserListQueryDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === 'true' ? true : value === 'false' ? false : undefined)),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UserListQueryDto.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], UserListQueryDto.prototype, "q", void 0);
//# sourceMappingURL=user.dto.js.map