"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSchema = exports.PaymentModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.PaymentModelName = 'Payment';
exports.PaymentSchema = new mongoose_1.Schema({
    invoiceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    provider: { type: String, enum: shared_1.PAYMENT_PROVIDERS, required: true },
    status: { type: String, enum: shared_1.PAYMENT_STATUSES, required: true, default: 'PENDING' },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, maxlength: 3 },
    reference: { type: String, required: true, trim: true, maxlength: 100 },
    providerReference: { type: String, default: null },
    checkoutUrl: { type: String, default: null },
    paidAt: { type: Date, default: null },
    metadata: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, (0, schema_options_1.baseSchemaOptions)('payments'));
exports.PaymentSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.PaymentSchema.index({ labId: 1, reference: 1 }, { unique: true });
exports.PaymentSchema.index({ labId: 1, invoiceId: 1, createdAt: -1 });
exports.PaymentSchema.index({ labId: 1, status: 1, createdAt: -1 });
//# sourceMappingURL=payment.schema.js.map