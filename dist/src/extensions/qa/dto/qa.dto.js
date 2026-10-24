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
exports.QaQueryDto = exports.CompleteQaReviewDto = exports.StartQaReviewDto = exports.AssignQaReviewDto = exports.CreateQaReviewDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const shared_1 = require("@lims/shared");
const pagination_query_dto_1 = require("../../../common/dto/pagination-query.dto");
class CreateQaReviewDto {
    caseId;
    reportId;
    type;
    reviewerId;
    reason;
    dueAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { caseId: { required: true, type: () => String }, reportId: { required: false, type: () => String }, type: { required: true, enum: ["PEER_REVIEW", "SECOND_OPINION", "DISCREPANCY"] }, reviewerId: { required: false, type: () => String }, reason: { required: true, type: () => String, minLength: 5, maxLength: 1000 }, dueAt: { required: false, type: () => String } };
    }
}
exports.CreateQaReviewDto = CreateQaReviewDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateQaReviewDto.prototype, "caseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateQaReviewDto.prototype, "reportId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.QA_REVIEW_TYPES }),
    (0, class_validator_1.IsEnum)(shared_1.QA_REVIEW_TYPES),
    __metadata("design:type", String)
], CreateQaReviewDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateQaReviewDto.prototype, "reviewerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(1_000),
    __metadata("design:type", String)
], CreateQaReviewDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], CreateQaReviewDto.prototype, "dueAt", void 0);
class AssignQaReviewDto {
    reviewerId;
    dueAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { reviewerId: { required: true, type: () => String }, dueAt: { required: false, type: () => String } };
    }
}
exports.AssignQaReviewDto = AssignQaReviewDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], AssignQaReviewDto.prototype, "reviewerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], AssignQaReviewDto.prototype, "dueAt", void 0);
class StartQaReviewDto {
    findings;
    static _OPENAPI_METADATA_FACTORY() {
        return { findings: { required: false, type: () => String, maxLength: 5000 } };
    }
}
exports.StartQaReviewDto = StartQaReviewDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5_000),
    __metadata("design:type", String)
], StartQaReviewDto.prototype, "findings", void 0);
class CompleteQaReviewDto {
    outcome;
    reviewDiagnosis;
    disagreementCode;
    severity;
    findings;
    actionPlan;
    static _OPENAPI_METADATA_FACTORY() {
        return { outcome: { required: true, enum: ["AGREED", "DISCREPANT"] }, reviewDiagnosis: { required: false, type: () => String, maxLength: 5000 }, disagreementCode: { required: false, enum: ["OTHER", "NONE", "MAJOR_DIAGNOSTIC", "MINOR_DIAGNOSTIC", "GRADING", "STAGING", "BIOMARKER", "MARGIN", "LYMPH_NODE", "TRANSCRIPTION"] }, severity: { required: false, enum: ["MINOR", "MAJOR", "CRITICAL"] }, findings: { required: true, type: () => String, minLength: 10, maxLength: 5000 }, actionPlan: { required: false, type: () => String, maxLength: 2000 } };
    }
}
exports.CompleteQaReviewDto = CompleteQaReviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['AGREED', 'DISCREPANT'] }),
    (0, class_validator_1.IsEnum)(['AGREED', 'DISCREPANT']),
    __metadata("design:type", String)
], CompleteQaReviewDto.prototype, "outcome", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5_000),
    __metadata("design:type", String)
], CompleteQaReviewDto.prototype, "reviewDiagnosis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.QA_DISCREPANCY_CODES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.QA_DISCREPANCY_CODES),
    __metadata("design:type", String)
], CompleteQaReviewDto.prototype, "disagreementCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.QA_SEVERITIES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.QA_SEVERITIES),
    __metadata("design:type", String)
], CompleteQaReviewDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(5_000),
    __metadata("design:type", String)
], CompleteQaReviewDto.prototype, "findings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2_000),
    __metadata("design:type", String)
], CompleteQaReviewDto.prototype, "actionPlan", void 0);
class QaQueryDto extends pagination_query_dto_1.PaginationQueryDto {
    status;
    type;
    reviewerId;
    mine;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: ["PENDING", "ASSIGNED", "IN_REVIEW", "AGREED", "DISCREPANT", "CLOSED", "CANCELLED"] }, type: { required: false, enum: ["PEER_REVIEW", "SECOND_OPINION", "DISCREPANCY"] }, reviewerId: { required: false, type: () => String }, mine: { required: false, type: () => Boolean } };
    }
}
exports.QaQueryDto = QaQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.QA_REVIEW_STATUSES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.QA_REVIEW_STATUSES),
    __metadata("design:type", String)
], QaQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.QA_REVIEW_TYPES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.QA_REVIEW_TYPES),
    __metadata("design:type", String)
], QaQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], QaQueryDto.prototype, "reviewerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], QaQueryDto.prototype, "mine", void 0);
void class_transformer_1.Type;
//# sourceMappingURL=qa.dto.js.map