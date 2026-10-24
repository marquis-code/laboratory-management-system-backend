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
exports.PaymentEventDto = exports.ClaimQueryDto = exports.ManualPaymentDto = exports.InitializePaymentDto = exports.InvoiceQueryDto = exports.CreateInvoiceDto = exports.InvoiceItemDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const shared_1 = require("@lims/shared");
const pagination_query_dto_1 = require("../../../common/dto/pagination-query.dto");
class InvoiceItemDto {
    description;
    quantity;
    unitPrice;
    category;
    static _OPENAPI_METADATA_FACTORY() {
        return { description: { required: true, type: () => String, minLength: 2, maxLength: 200 }, quantity: { required: true, type: () => Number, minimum: 0.01 }, unitPrice: { required: true, type: () => Number, minimum: 0 }, category: { required: false, type: () => String, maxLength: 60 } };
    }
}
exports.InvoiceItemDto = InvoiceItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], InvoiceItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], InvoiceItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], InvoiceItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], InvoiceItemDto.prototype, "category", void 0);
class CreateInvoiceDto {
    caseId;
    payerType;
    hmoName;
    hmoCode;
    authorizationNumber;
    items;
    discount;
    currency;
    dueAt;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { caseId: { required: true, type: () => String }, payerType: { required: true, enum: ["SELF", "HMO", "CORPORATE", "INSURANCE", "WAIVER"] }, hmoName: { required: false, type: () => String, maxLength: 160 }, hmoCode: { required: false, type: () => String, maxLength: 80 }, authorizationNumber: { required: false, type: () => String, maxLength: 80 }, items: { required: true, type: () => [require("./billing.dto").InvoiceItemDto], minItems: 1 }, discount: { required: false, type: () => Number, minimum: 0 }, currency: { required: false, type: () => String, maxLength: 3 }, dueAt: { required: false, type: () => String }, notes: { required: false, type: () => String, maxLength: 2000 } };
    }
}
exports.CreateInvoiceDto = CreateInvoiceDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "caseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.PAYER_TYPES }),
    (0, class_validator_1.IsEnum)(shared_1.PAYER_TYPES),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "payerType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "hmoName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "hmoCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "authorizationNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [InvoiceItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => InvoiceItemDto),
    __metadata("design:type", Array)
], CreateInvoiceDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "discount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "dueAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2_000),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "notes", void 0);
class InvoiceQueryDto extends pagination_query_dto_1.PaginationQueryDto {
    status;
    payerType;
    q;
    from;
    to;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: ["DRAFT", "ISSUED", "PARTIALLY_PAID", "PAID", "OVERDUE", "VOID"] }, payerType: { required: false, enum: ["SELF", "HMO", "CORPORATE", "INSURANCE", "WAIVER"] }, q: { required: false, type: () => String, maxLength: 120 }, from: { required: false, type: () => String }, to: { required: false, type: () => String } };
    }
}
exports.InvoiceQueryDto = InvoiceQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.INVOICE_STATUSES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.INVOICE_STATUSES),
    __metadata("design:type", String)
], InvoiceQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: shared_1.PAYER_TYPES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.PAYER_TYPES),
    __metadata("design:type", String)
], InvoiceQueryDto.prototype, "payerType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], InvoiceQueryDto.prototype, "q", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], InvoiceQueryDto.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], InvoiceQueryDto.prototype, "to", void 0);
class InitializePaymentDto {
    provider;
    amount;
    static _OPENAPI_METADATA_FACTORY() {
        return { provider: { required: true, enum: ["HMO", "PAYSTACK", "FLUTTERWAVE", "CASH", "TRANSFER"] }, amount: { required: false, type: () => Number, minimum: 1 } };
    }
}
exports.InitializePaymentDto = InitializePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.PAYMENT_PROVIDERS }),
    (0, class_validator_1.IsEnum)(shared_1.PAYMENT_PROVIDERS),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], InitializePaymentDto.prototype, "amount", void 0);
class ManualPaymentDto {
    provider;
    amount;
    reference;
    note;
    static _OPENAPI_METADATA_FACTORY() {
        return { provider: { required: true, enum: ["HMO", "CASH", "TRANSFER"] }, amount: { required: true, type: () => Number, minimum: 1 }, reference: { required: true, type: () => String, minLength: 1, maxLength: 120 }, note: { required: false, type: () => String, maxLength: 500 } };
    }
}
exports.ManualPaymentDto = ManualPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['CASH', 'TRANSFER', 'HMO'] }),
    (0, class_validator_1.IsEnum)(['CASH', 'TRANSFER', 'HMO']),
    __metadata("design:type", String)
], ManualPaymentDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ManualPaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], ManualPaymentDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], ManualPaymentDto.prototype, "note", void 0);
class ClaimQueryDto {
    from;
    to;
    format;
    hmoName;
    static _OPENAPI_METADATA_FACTORY() {
        return { from: { required: true, type: () => String }, to: { required: true, type: () => String }, format: { required: false, enum: ["csv", "json"] }, hmoName: { required: false, type: () => String, maxLength: 160 } };
    }
}
exports.ClaimQueryDto = ClaimQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], ClaimQueryDto.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], ClaimQueryDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['csv', 'json'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['csv', 'json']),
    __metadata("design:type", String)
], ClaimQueryDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], ClaimQueryDto.prototype, "hmoName", void 0);
class PaymentEventDto {
    data;
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: "object", additionalProperties: true } };
    }
}
exports.PaymentEventDto = PaymentEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], PaymentEventDto.prototype, "data", void 0);
void class_validator_1.Max;
//# sourceMappingURL=billing.dto.js.map