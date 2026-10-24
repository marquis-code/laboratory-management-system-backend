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
exports.TestRequestQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const shared_1 = require("@lims/shared");
const pagination_query_dto_1 = require("../../../common/dto/pagination-query.dto");
class TestRequestQueryDto extends pagination_query_dto_1.PaginationQueryDto {
    caseId;
    discipline;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { caseId: { required: false, type: () => String }, discipline: { required: false, enum: ["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"] }, status: { required: false, enum: ["RECEIVED", "IN_PROGRESS", "PENDING_REVIEW", "RELEASED", "CANCELLED", "COLLECTED", "RESULTED", "VERIFIED"] } };
    }
}
exports.TestRequestQueryDto = TestRequestQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], TestRequestQueryDto.prototype, "caseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.DISCIPLINES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.DISCIPLINES),
    __metadata("design:type", String)
], TestRequestQueryDto.prototype, "discipline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.TEST_REQUEST_STATUSES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.TEST_REQUEST_STATUSES),
    __metadata("design:type", String)
], TestRequestQueryDto.prototype, "status", void 0);
//# sourceMappingURL=test-request.dto.js.map