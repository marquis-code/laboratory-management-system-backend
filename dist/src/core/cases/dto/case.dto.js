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
exports.CaseListQueryDto = exports.AssignCaseDto = exports.UpdateCaseDto = exports.AccessionDto = exports.SpecimenInputDto = exports.ReferringClinicianDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const shared_1 = require("@lims/shared");
const patient_dto_1 = require("../../patients/dto/patient.dto");
const pagination_query_dto_1 = require("../../../common/dto/pagination-query.dto");
class ReferringClinicianDto {
    name;
    facility;
    phone;
    email;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 2, maxLength: 160 }, facility: { required: false, type: () => String, maxLength: 200 }, phone: { required: false, type: () => String, maxLength: 40 }, email: { required: false, type: () => String, maxLength: 160, format: "email" } };
    }
}
exports.ReferringClinicianDto = ReferringClinicianDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dr Bola Adeyemi' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], ReferringClinicianDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'St Mary\u2019s Clinic, Ikeja' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], ReferringClinicianDto.prototype, "facility", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], ReferringClinicianDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], ReferringClinicianDto.prototype, "email", void 0);
class SpecimenInputDto {
    specimenType;
    site;
    laterality;
    description;
    collectedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { specimenType: { required: true, type: () => String, minLength: 2, maxLength: 120 }, site: { required: true, type: () => String, minLength: 1, maxLength: 200 }, laterality: { required: false, enum: ["LEFT", "RIGHT", "BILATERAL", "NOT_APPLICABLE"] }, description: { required: false, type: () => String, maxLength: 2000 }, collectedAt: { required: false, type: () => String } };
    }
}
exports.SpecimenInputDto = SpecimenInputDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Core biopsy' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], SpecimenInputDto.prototype, "specimenType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Left breast, upper outer quadrant' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], SpecimenInputDto.prototype, "site", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.LATERALITIES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.LATERALITIES),
    __metadata("design:type", String)
], SpecimenInputDto.prototype, "laterality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2_000),
    __metadata("design:type", String)
], SpecimenInputDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], SpecimenInputDto.prototype, "collectedAt", void 0);
class AccessionDto {
    patient;
    referringClinician;
    clinicalHistory;
    clinicalDiagnosis;
    priority;
    discipline;
    testCode;
    testName;
    subspecialty;
    assignedPathologistId;
    specimens;
    static _OPENAPI_METADATA_FACTORY() {
        return { patient: { required: true, type: () => require("../../patients/dto/patient.dto").CreatePatientDto }, referringClinician: { required: true, type: () => require("./case.dto").ReferringClinicianDto }, clinicalHistory: { required: true, type: () => String, minLength: 5, maxLength: 5000 }, clinicalDiagnosis: { required: false, type: () => String, maxLength: 2000 }, priority: { required: true, enum: ["ROUTINE", "URGENT", "FROZEN"] }, discipline: { required: false, enum: ["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"] }, testCode: { required: false, type: () => String, maxLength: 80 }, testName: { required: false, type: () => String, maxLength: 160 }, subspecialty: { required: false, type: () => String, maxLength: 80 }, assignedPathologistId: { required: false, type: () => String }, specimens: { required: true, type: () => [require("./case.dto").SpecimenInputDto], minItems: 1, maxItems: 20 } };
    }
}
exports.AccessionDto = AccessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: patient_dto_1.CreatePatientDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => patient_dto_1.CreatePatientDto),
    __metadata("design:type", patient_dto_1.CreatePatientDto)
], AccessionDto.prototype, "patient", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReferringClinicianDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ReferringClinicianDto),
    __metadata("design:type", ReferringClinicianDto)
], AccessionDto.prototype, "referringClinician", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(5_000),
    __metadata("design:type", String)
], AccessionDto.prototype, "clinicalHistory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2_000),
    __metadata("design:type", String)
], AccessionDto.prototype, "clinicalDiagnosis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.PRIORITIES }),
    (0, class_validator_1.IsEnum)(shared_1.PRIORITIES),
    __metadata("design:type", String)
], AccessionDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.DISCIPLINES, default: 'HISTOPATHOLOGY' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.DISCIPLINES),
    __metadata("design:type", String)
], AccessionDto.prototype, "discipline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'HISTO' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], AccessionDto.prototype, "testCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Histopathology examination' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], AccessionDto.prototype, "testName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], AccessionDto.prototype, "subspecialty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], AccessionDto.prototype, "assignedPathologistId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SpecimenInputDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(20),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SpecimenInputDto),
    __metadata("design:type", Array)
], AccessionDto.prototype, "specimens", void 0);
class UpdateCaseDto {
    clinicalHistory;
    clinicalDiagnosis;
    priority;
    subspecialty;
    static _OPENAPI_METADATA_FACTORY() {
        return { clinicalHistory: { required: false, type: () => String, minLength: 5, maxLength: 5000 }, clinicalDiagnosis: { required: false, type: () => String, maxLength: 2000 }, priority: { required: false, enum: ["ROUTINE", "URGENT", "FROZEN"] }, subspecialty: { required: false, type: () => String, maxLength: 80 } };
    }
}
exports.UpdateCaseDto = UpdateCaseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(5_000),
    __metadata("design:type", String)
], UpdateCaseDto.prototype, "clinicalHistory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2_000),
    __metadata("design:type", String)
], UpdateCaseDto.prototype, "clinicalDiagnosis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.PRIORITIES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.PRIORITIES),
    __metadata("design:type", String)
], UpdateCaseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], UpdateCaseDto.prototype, "subspecialty", void 0);
class AssignCaseDto {
    pathologistId;
    static _OPENAPI_METADATA_FACTORY() {
        return { pathologistId: { required: false, type: () => String, nullable: true } };
    }
}
exports.AssignCaseDto = AssignCaseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, description: 'Pass null to unassign.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", Object)
], AssignCaseDto.prototype, "pathologistId", void 0);
class CaseListQueryDto extends pagination_query_dto_1.PaginationQueryDto {
    q;
    status;
    priority;
    pathologistId;
    subspecialty;
    discipline;
    from;
    to;
    static _OPENAPI_METADATA_FACTORY() {
        return { q: { required: false, type: () => String, maxLength: 120 }, status: { required: false, enum: ["RECEIVED", "IN_PROGRESS", "PENDING_REVIEW", "REPORTED", "AMENDED"] }, priority: { required: false, enum: ["ROUTINE", "URGENT", "FROZEN"] }, pathologistId: { required: false, type: () => String }, subspecialty: { required: false, type: () => String, maxLength: 80 }, discipline: { required: false, enum: ["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"] }, from: { required: false, type: () => String, pattern: "^\\d{4}-\\d{2}-\\d{2}$" }, to: { required: false, type: () => String, pattern: "^\\d{4}-\\d{2}-\\d{2}$" } };
    }
}
exports.CaseListQueryDto = CaseListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Accession number, patient name or MRN' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CaseListQueryDto.prototype, "q", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.CASE_STATUSES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.CASE_STATUSES),
    __metadata("design:type", String)
], CaseListQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.PRIORITIES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.PRIORITIES),
    __metadata("design:type", String)
], CaseListQueryDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CaseListQueryDto.prototype, "pathologistId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CaseListQueryDto.prototype, "subspecialty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.DISCIPLINES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.DISCIPLINES),
    __metadata("design:type", String)
], CaseListQueryDto.prototype, "discipline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-01-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/),
    __metadata("design:type", String)
], CaseListQueryDto.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-12-31' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/),
    __metadata("design:type", String)
], CaseListQueryDto.prototype, "to", void 0);
//# sourceMappingURL=case.dto.js.map