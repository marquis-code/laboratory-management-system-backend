"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalTokenSchema = exports.PortalTokenModelName = void 0;
const mongoose_1 = require("mongoose");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.PortalTokenModelName = 'PortalToken';
exports.PortalTokenSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 160 },
    tokenHash: { type: String, required: true, select: false },
    codeHash: { type: String, required: true, select: false },
    type: { type: String, enum: ['MAGIC_LINK', 'OTP'], required: true, default: 'OTP' },
    expiresAt: { type: Date, required: true },
    consumedAt: { type: Date, default: null },
    attempts: { type: Number, default: 0 },
    ip: { type: String, default: null },
    userAgent: { type: String, default: null },
}, (0, schema_options_1.baseSchemaOptions)('portal_tokens'));
exports.PortalTokenSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.PortalTokenSchema.index({ labId: 1, userId: 1, consumedAt: 1, createdAt: -1 });
exports.PortalTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
//# sourceMappingURL=portal-token.schema.js.map