"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimQuerySchema = exports.recordManualPaymentSchema = exports.initializePaymentSchema = exports.invoiceQuerySchema = exports.createInvoiceSchema = exports.invoiceItemSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
const common_1 = require("./common");
exports.invoiceItemSchema = zod_1.z.object({
    description: zod_1.z.string().trim().min(2).max(200),
    quantity: zod_1.z.coerce.number().min(0.01).max(10_000),
    unitPrice: zod_1.z.coerce.number().min(0).max(100_000_000),
    category: zod_1.z.string().trim().min(1).max(60).default('PROFESSIONAL'),
});
exports.createInvoiceSchema = zod_1.z.object({
    caseId: common_1.objectIdSchema,
    payerType: zod_1.z.enum(constants_1.PAYER_TYPES),
    hmoName: zod_1.z.string().trim().max(160).optional(),
    hmoCode: zod_1.z.string().trim().max(80).optional(),
    authorizationNumber: zod_1.z.string().trim().max(80).optional(),
    items: zod_1.z.array(exports.invoiceItemSchema).min(1).max(50),
    discount: zod_1.z.coerce.number().min(0).max(100_000_000).default(0),
    currency: zod_1.z.string().trim().length(3).default('NGN'),
    dueAt: zod_1.z.string().datetime({ offset: true }).optional(),
    notes: zod_1.z.string().trim().max(2_000).optional(),
});
exports.invoiceQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(30),
    status: zod_1.z.enum(constants_1.INVOICE_STATUSES).optional(),
    payerType: zod_1.z.enum(constants_1.PAYER_TYPES).optional(),
    from: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
    to: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
    q: zod_1.z.string().trim().max(120).optional(),
});
exports.initializePaymentSchema = zod_1.z.object({
    provider: zod_1.z.enum(constants_1.PAYMENT_PROVIDERS),
    amount: zod_1.z.coerce.number().min(1).max(100_000_000).optional(),
});
exports.recordManualPaymentSchema = zod_1.z.object({
    provider: zod_1.z.enum(['CASH', 'TRANSFER', 'HMO']),
    amount: zod_1.z.coerce.number().min(1).max(100_000_000),
    reference: zod_1.z.string().trim().min(1).max(120),
    note: zod_1.z.string().trim().max(500).optional(),
});
exports.claimQuerySchema = zod_1.z.object({
    from: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    to: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    format: zod_1.z.enum(['csv', 'json']).default('csv'),
    hmoName: zod_1.z.string().trim().max(160).optional(),
});
//# sourceMappingURL=billing.js.map