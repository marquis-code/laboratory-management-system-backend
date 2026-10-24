"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdempotencySchema = exports.IdempotencyModelName = void 0;
const mongoose_1 = require("mongoose");
const schema_options_1 = require("../database/schema-options");
const tenant_plugin_1 = require("../database/tenant.plugin");
exports.IdempotencyModelName = 'IdempotencyKey';
exports.IdempotencySchema = new mongoose_1.Schema({
    key: { type: String, required: true, maxlength: 120 },
    scope: { type: String, required: true, maxlength: 80 },
    requestHash: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'COMPLETED'], default: 'PENDING' },
    response: { type: mongoose_1.Schema.Types.Mixed, default: null },
    statusCode: { type: Number, default: null },
    expiresAt: { type: Date, required: true },
}, (0, schema_options_1.baseSchemaOptions)('idempotency_keys'));
exports.IdempotencySchema.plugin(tenant_plugin_1.tenantPlugin);
exports.IdempotencySchema.index({ labId: 1, key: 1, scope: 1 }, { unique: true });
exports.IdempotencySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
//# sourceMappingURL=idempotency.schema.js.map