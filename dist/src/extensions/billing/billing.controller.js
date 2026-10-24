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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const parse_object_id_pipe_1 = require("../../common/pipes/parse-object-id.pipe");
const billing_dto_1 = require("./dto/billing.dto");
const billing_service_1 = require("./billing.service");
const BILLING_ROLES = ['SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST'];
let BillingController = class BillingController {
    billing;
    constructor(billing) {
        this.billing = billing;
    }
    createInvoice(dto, user) {
        return this.billing.create(dto, user);
    }
    invoices(query) {
        return this.billing.list(query);
    }
    caseInvoices(caseId) {
        return this.billing.forCase(caseId);
    }
    payments(id) {
        return this.billing.listPayments(id);
    }
    initialize(id, dto, user) {
        return this.billing.initializePayment(id, dto, user);
    }
    manual(id, dto, user) {
        return this.billing.manualPayment(id, dto, user);
    }
    payment(reference) {
        return this.billing.getPayment(reference);
    }
    mockComplete(reference) {
        return this.billing.completeMock(reference);
    }
    async paystack(req, signature, body) {
        const raw = req.rawBody?.toString('utf8') ?? JSON.stringify(body);
        return this.billing.paystackWebhook(raw, signature, body);
    }
    flutterwave(signature, body) {
        return this.billing.flutterwaveWebhook(signature, body);
    }
    async claims(query, res) {
        const result = await this.billing.exportClaims(query);
        if (query.format === 'json')
            return { rows: result.rows };
        res.set({
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="hmo-claims-${query.from}-to-${query.to}.csv"`,
        });
        return result.csv;
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.Post)('invoices'),
    (0, auth_decorators_1.Roles)(...BILLING_ROLES),
    (0, swagger_1.ApiOperation)({ summary: 'Create an invoice for a case (self-pay, HMO or corporate)' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [billing_dto_1.CreateInvoiceDto, Object]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Get)('invoices'),
    (0, auth_decorators_1.Roles)(...BILLING_ROLES),
    (0, swagger_1.ApiOperation)({ summary: 'List invoices with payer and status filters' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [billing_dto_1.InvoiceQueryDto]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "invoices", null);
__decorate([
    (0, common_1.Get)('invoices/case/:caseId'),
    (0, auth_decorators_1.Roles)(...BILLING_ROLES, 'PATHOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'Invoices belonging to one case' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('caseId', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "caseInvoices", null);
__decorate([
    (0, common_1.Get)('invoices/:id/payments'),
    (0, auth_decorators_1.Roles)(...BILLING_ROLES),
    (0, swagger_1.ApiOperation)({ summary: 'Payment attempts for an invoice' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "payments", null);
__decorate([
    (0, common_1.Post)('invoices/:id/payments/initialize'),
    (0, auth_decorators_1.Roles)(...BILLING_ROLES),
    (0, swagger_1.ApiOperation)({ summary: 'Create a Paystack or Flutterwave checkout for the balance' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, billing_dto_1.InitializePaymentDto, Object]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "initialize", null);
__decorate([
    (0, common_1.Post)('invoices/:id/payments/manual'),
    (0, auth_decorators_1.Roles)(...BILLING_ROLES),
    (0, swagger_1.ApiOperation)({ summary: 'Record cash, transfer or HMO payment' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, billing_dto_1.ManualPaymentDto, Object]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "manual", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('payments/:reference'),
    (0, swagger_1.ApiOperation)({ summary: 'Public payment status used by the checkout callback page' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('reference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "payment", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Post)('payments/mock/:reference/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete a mock-mode payment (local demonstrations only)' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('reference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "mockComplete", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Post)('payments/webhooks/paystack'),
    (0, swagger_1.ApiOperation)({ summary: 'Paystack webhook (HMAC SHA-512 verified)' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('x-paystack-signature')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, billing_dto_1.PaymentEventDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "paystack", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Post)('payments/webhooks/flutterwave'),
    (0, swagger_1.ApiOperation)({ summary: 'Flutterwave webhook (verif-hash verified)' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Headers)('verif-hash')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, billing_dto_1.PaymentEventDto]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "flutterwave", null);
__decorate([
    (0, common_1.Get)('claims/export'),
    (0, auth_decorators_1.Roles)(...BILLING_ROLES),
    (0, swagger_1.ApiOperation)({ summary: 'HMO claims export as CSV or JSON' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [billing_dto_1.ClaimQueryDto, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "claims", null);
exports.BillingController = BillingController = __decorate([
    (0, swagger_1.ApiTags)('Billing'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [billing_service_1.BillingService])
], BillingController);
//# sourceMappingURL=billing.controller.js.map