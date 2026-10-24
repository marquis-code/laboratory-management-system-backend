"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogSchema = exports.AuditLogModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
const append_only_1 = require("../../common/database/append-only");
exports.AuditLogModelName = 'AuditLog';
exports.AuditLogSchema = new mongoose_1.Schema({
    action: { type: String, enum: shared_1.AUDIT_ACTIONS, required: true },
    entityType: { type: String, required: true, maxlength: 60 },
    entityId: { type: String, default: null },
    caseId: { type: String, default: null },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    userName: { type: String, required: true },
    userRole: { type: String, enum: shared_1.ROLES, default: null },
    before: { type: mongoose_1.Schema.Types.Mixed, default: null },
    after: { type: mongoose_1.Schema.Types.Mixed, default: null },
    metadata: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    ip: { type: String, default: null },
    userAgent: { type: String, default: null },
    requestId: { type: String, default: null },
}, (0, schema_options_1.baseSchemaOptions)('audit_logs'));
exports.AuditLogSchema.plugin(tenant_plugin_1.tenantPlugin);
(0, append_only_1.makeAppendOnly)(exports.AuditLogSchema, 'Audit log');
exports.AuditLogSchema.index({ labId: 1, createdAt: -1 });
exports.AuditLogSchema.index({ labId: 1, entityType: 1, entityId: 1 });
exports.AuditLogSchema.index({ labId: 1, userId: 1, createdAt: -1 });
exports.AuditLogSchema.index({ labId: 1, caseId: 1 });
//# sourceMappingURL=audit-log.schema.js.map