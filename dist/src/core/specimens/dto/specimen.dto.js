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
exports.RejectSpecimenDto = exports.SpecimenListQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const pagination_query_dto_1 = require("../../../common/dto/pagination-query.dto");
class SpecimenListQueryDto extends pagination_query_dto_1.PaginationQueryDto {
    caseId;
    static _OPENAPI_METADATA_FACTORY() {
        return { caseId: { required: false, type: () => String } };
    }
}
exports.SpecimenListQueryDto = SpecimenListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], SpecimenListQueryDto.prototype, "caseId", void 0);
class RejectSpecimenDto {
    reasonCode;
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { reasonCode: { required: false, type: () => String }, reason: { required: true, type: () => String, minLength: 5, maxLength: 1000 } };
    }
}
exports.RejectSpecimenDto = RejectSpecimenDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: [
            'MISLABELLED',
            'WRONG_CONTAINER',
            'FIXATION_DELAY',
            'INSUFFICIENT_TISSUE',
            'CONTAMINATION',
            'BROKEN_SLIDE',
            'LOST_IN_PROCESSING',
            'UNREPRESENTATIVE',
            'OTHER',
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)([
        'MISLABELLED',
        'WRONG_CONTAINER',
        'FIXATION_DELAY',
        'INSUFFICIENT_TISSUE',
        'CONTAMINATION',
        'BROKEN_SLIDE',
        'LOST_IN_PROCESSING',
        'UNREPRESENTATIVE',
        'OTHER',
    ]),
    __metadata("design:type", String)
], RejectSpecimenDto.prototype, "reasonCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Container leaked; tissue uninterpretable.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(1_000),
    __metadata("design:type", String)
], RejectSpecimenDto.prototype, "reason", void 0);
//# sourceMappingURL=specimen.dto.js.map