"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustodyEventSchema = exports.CustodyEventModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
const append_only_1 = require("../../common/database/append-only");
exports.CustodyEventModelName = 'CustodyEvent';
exports.CustodyEventSchema = new mongoose_1.Schema({
    entityType: { type: String, enum: shared_1.CUSTODY_ENTITY_TYPES, required: true },
    entityId: { type: mongoose_1.Schema.Types.ObjectId, required: true, index: true },
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', default: null },
    eventType: { type: String, required: true, maxlength: 40 },
    station: { type: String, enum: shared_1.STATIONS, default: null },
    fromState: { type: String, default: null },
    toState: { type: String, required: true },
    reason: { type: String, default: null },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userRole: { type: String, enum: shared_1.ROLES, default: null },
    timestamp: { type: Date, required: true, default: Date.now },
    barcode: { type: String, default: null },
    metadata: { type: mongoose_1.Schema.Types.Mixed, default: {} },
}, (0, schema_options_1.baseSchemaOptions)('custody_events'));
exports.CustodyEventSchema.plugin(tenant_plugin_1.tenantPlugin);
(0, append_only_1.makeAppendOnly)(exports.CustodyEventSchema, 'Custody event');
exports.CustodyEventSchema.index({ labId: 1, entityType: 1, entityId: 1, timestamp: -1 });
exports.CustodyEventSchema.index({ labId: 1, caseId: 1, timestamp: -1 });
exports.CustodyEventSchema.index({ labId: 1, timestamp: -1 });
//# sourceMappingURL=custody-event.schema.js.map