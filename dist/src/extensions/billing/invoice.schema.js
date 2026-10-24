"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceSchema = exports.InvoiceModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.InvoiceModelName = 'Invoice';
const itemSchema = new mongoose_1.Schema({
    description: { type: String, required: true, maxlength: 200 },
    quantity: { type: Number, required: true, min: 0.01 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, default: 'PROFESSIONAL' },
}, { _id: false });
exports.InvoiceSchema = new mongoose_1.Schema({
    number: { type: String, required: true, trim: true, maxlength: 40 },
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    patientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Patient', required: true },
    payerType: { type: String, enum: shared_1.PAYER_TYPES, required: true, default: 'SELF' },
    hmoName: { type: String, default: null, maxlength: 160 },
    hmoCode: { type: String, default: null, maxlength: 80 },
    authorizationNumber: { type: String, default: null, maxlength: 80 },
    status: { type: String, enum: shared_1.INVOICE_STATUSES, required: true, default: 'ISSUED' },
    currency: { type: String, required: true, uppercase: true, maxlength: 3, default: 'NGN' },
    items: { type: [itemSchema], default: [] },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    amountPaid: { type: Number, default: 0, min: 0 },
    balance: { type: Number, required: true, min: 0 },
    dueAt: { type: Date, default: null },
    issuedAt: { type: Date, default: null },
    paidAt: { type: Date, default: null },
    notes: { type: String, default: null },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, (0, schema_options_1.baseSchemaOptions)('invoices'));
exports.InvoiceSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.InvoiceSchema.index({ labId: 1, number: 1 }, { unique: true });
exports.InvoiceSchema.index({ labId: 1, caseId: 1, createdAt: -1 });
exports.InvoiceSchema.index({ labId: 1, status: 1, dueAt: 1 });
exports.InvoiceSchema.index({ labId: 1, payerType: 1, issuedAt: -1 });
//# sourceMappingURL=invoice.schema.js.map