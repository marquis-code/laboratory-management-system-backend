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
exports.SyncBatchDto = exports.SyncMutationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const shared_1 = require("@lims/shared");
class SyncMutationDto {
    id;
    type;
    payload;
    createdAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String, minLength: 8, maxLength: 80 }, type: { required: true, enum: ["SCAN", "REJECT", "RECUT"] }, payload: { required: true, type: "object", additionalProperties: true }, createdAt: { required: false, type: () => String } };
    }
}
exports.SyncMutationDto = SyncMutationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], SyncMutationDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.SYNC_MUTATION_TYPES }),
    (0, class_validator_1.IsEnum)(shared_1.SYNC_MUTATION_TYPES),
    __metadata("design:type", String)
], SyncMutationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SyncMutationDto.prototype, "payload", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], SyncMutationDto.prototype, "createdAt", void 0);
class SyncBatchDto {
    mutations;
    static _OPENAPI_METADATA_FACTORY() {
        return { mutations: { required: true, type: () => [require("./sync.dto").SyncMutationDto], maxItems: 100 } };
    }
}
exports.SyncBatchDto = SyncBatchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SyncMutationDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(100),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SyncMutationDto),
    __metadata("design:type", Array)
], SyncBatchDto.prototype, "mutations", void 0);
//# sourceMappingURL=sync.dto.js.map