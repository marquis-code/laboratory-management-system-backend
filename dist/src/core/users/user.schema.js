"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.UserModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.UserModelName = 'User';
exports.UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, maxlength: 150 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 160 },
    phone: { type: String, default: null, maxlength: 40 },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: shared_1.ROLES, required: true },
    subspecialties: { type: [String], default: [] },
    disciplines: {
        type: [{ type: String, enum: shared_1.DISCIPLINES }],
        default: [],
    },
    active: { type: Boolean, default: true },
    refreshTokenHash: { type: String, default: null, select: false },
    mustChangePassword: { type: Boolean, default: false },
    invitationTokenHash: { type: String, default: null, select: false },
    invitationExpiresAt: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
}, (0, schema_options_1.baseSchemaOptions)('users'));
exports.UserSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.UserSchema.index({ labId: 1, email: 1 }, { unique: true });
exports.UserSchema.index({ labId: 1, role: 1, active: 1 });
//# sourceMappingURL=user.schema.js.map