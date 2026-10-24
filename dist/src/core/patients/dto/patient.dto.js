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
exports.PatientListQueryDto = exports.UpdatePatientDto = exports.CreatePatientDto = exports.NextOfKinDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const shared_1 = require("@lims/shared");
const pagination_query_dto_1 = require("../../../common/dto/pagination-query.dto");
class NextOfKinDto {
    name;
    phone;
    relationship;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String, maxLength: 150 }, phone: { required: false, type: () => String, maxLength: 40 }, relationship: { required: false, type: () => String, maxLength: 80 } };
    }
}
exports.NextOfKinDto = NextOfKinDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], NextOfKinDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], NextOfKinDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], NextOfKinDto.prototype, "relationship", void 0);
class CreatePatientDto {
    mrn;
    firstName;
    lastName;
    sex;
    dateOfBirth;
    age;
    phone;
    email;
    address;
    nationalId;
    nextOfKin;
    static _OPENAPI_METADATA_FACTORY() {
        return { mrn: { required: false, type: () => String, maxLength: 40 }, firstName: { required: true, type: () => String, minLength: 1, maxLength: 100 }, lastName: { required: true, type: () => String, minLength: 1, maxLength: 100 }, sex: { required: true, enum: ["FEMALE", "MALE", "OTHER", "UNKNOWN"] }, dateOfBirth: { required: false, type: () => String, pattern: "^\\d{4}-\\d{2}-\\d{2}$" }, age: { required: false, type: () => Number, minimum: 0, maximum: 130 }, phone: { required: false, type: () => String, maxLength: 40 }, email: { required: false, type: () => String, maxLength: 160, format: "email" }, address: { required: false, type: () => String, maxLength: 500 }, nationalId: { required: false, type: () => String, maxLength: 60 }, nextOfKin: { required: false, type: () => require("./patient.dto").NextOfKinDto } };
    }
}
exports.CreatePatientDto = CreatePatientDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Leave blank to auto-generate an MRN.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "mrn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.SEXES }),
    (0, class_validator_1.IsEnum)(shared_1.SEXES),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "sex", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1979-04-12' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, { message: 'dateOfBirth must be YYYY-MM-DD.' }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 46 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(130),
    __metadata("design:type", Number)
], CreatePatientDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "nationalId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: NextOfKinDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => NextOfKinDto),
    __metadata("design:type", NextOfKinDto)
], CreatePatientDto.prototype, "nextOfKin", void 0);
class UpdatePatientDto {
    firstName;
    lastName;
    sex;
    dateOfBirth;
    age;
    phone;
    email;
    address;
    nationalId;
    nextOfKin;
    static _OPENAPI_METADATA_FACTORY() {
        return { firstName: { required: false, type: () => String, minLength: 1, maxLength: 100 }, lastName: { required: false, type: () => String, minLength: 1, maxLength: 100 }, sex: { required: false, enum: ["FEMALE", "MALE", "OTHER", "UNKNOWN"] }, dateOfBirth: { required: false, type: () => String, pattern: "^\\d{4}-\\d{2}-\\d{2}$" }, age: { required: false, type: () => Number, minimum: 0, maximum: 130 }, phone: { required: false, type: () => String, maxLength: 40 }, email: { required: false, type: () => String, maxLength: 160, format: "email" }, address: { required: false, type: () => String, maxLength: 500 }, nationalId: { required: false, type: () => String, maxLength: 60 }, nextOfKin: { required: false, type: () => require("./patient.dto").NextOfKinDto } };
    }
}
exports.UpdatePatientDto = UpdatePatientDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.SEXES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.SEXES),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "sex", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(130),
    __metadata("design:type", Number)
], UpdatePatientDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "nationalId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: NextOfKinDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => NextOfKinDto),
    __metadata("design:type", NextOfKinDto)
], UpdatePatientDto.prototype, "nextOfKin", void 0);
class PatientListQueryDto extends pagination_query_dto_1.PaginationQueryDto {
    q;
    static _OPENAPI_METADATA_FACTORY() {
        return { q: { required: false, type: () => String, maxLength: 120 } };
    }
}
exports.PatientListQueryDto = PatientListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'MRN, name or phone' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], PatientListQueryDto.prototype, "q", void 0);
//# sourceMappingURL=patient.dto.js.map