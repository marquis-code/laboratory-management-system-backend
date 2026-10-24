"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchema = exports.NotificationModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.NotificationModelName = 'Notification';
exports.NotificationSchema = new mongoose_1.Schema({
    channel: {
        type: String,
        enum: ['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP'],
        required: true,
        default: 'IN_APP',
    },
    status: {
        type: String,
        enum: ['QUEUED', 'SENDING', 'SENT', 'FAILED', 'SKIPPED'],
        required: true,
        default: 'SENT',
    },
    type: { type: String, required: true, maxlength: 60 },
    title: { type: String, required: true, maxlength: 200 },
    body: { type: String, required: true, maxlength: 2_000 },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    role: { type: String, enum: shared_1.ROLES, default: null },
    entityType: { type: String, default: null },
    entityId: { type: String, default: null },
    caseId: { type: String, default: null },
    recipient: { type: String, default: null },
    provider: { type: String, default: null },
    providerMessageId: { type: String, default: null },
    attempts: { type: Number, default: 0 },
    lastError: { type: String, default: null },
    sentAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    readAt: { type: Date, default: null },
    metadata: { type: mongoose_1.Schema.Types.Mixed, default: {} },
}, (0, schema_options_1.baseSchemaOptions)('notifications'));
exports.NotificationSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.NotificationSchema.index({ labId: 1, createdAt: -1 });
exports.NotificationSchema.index({ labId: 1, userId: 1, readAt: 1 });
exports.NotificationSchema.index({ labId: 1, channel: 1, status: 1, createdAt: -1 });
exports.NotificationSchema.index({ labId: 1, recipient: 1, createdAt: -1 });
//# sourceMappingURL=notification.schema.js.map