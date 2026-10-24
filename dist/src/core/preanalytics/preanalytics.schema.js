"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsignmentSchema = exports.CollectionCentreSchema = exports.ConsignmentModelName = exports.CollectionCentreModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.CollectionCentreModelName = 'CollectionCentre';
exports.ConsignmentModelName = 'Consignment';
exports.CollectionCentreSchema = new mongoose_1.Schema({
    code: { type: String, required: true, trim: true, uppercase: true, maxlength: 30 },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    address: { type: String, trim: true, maxlength: 300, default: null },
    phone: { type: String, trim: true, maxlength: 40, default: null },
    homeCollection: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
}, (0, schema_options_1.baseSchemaOptions)('collection_centres'));
exports.CollectionCentreSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.CollectionCentreSchema.index({ labId: 1, code: 1 }, { unique: true });
exports.ConsignmentSchema = new mongoose_1.Schema({
    code: { type: String, required: true, trim: true, uppercase: true },
    centreId: { type: mongoose_1.Schema.Types.ObjectId, ref: exports.CollectionCentreModelName, required: true },
    riderName: { type: String, trim: true, maxlength: 120, default: null },
    riderPhone: { type: String, trim: true, maxlength: 40, default: null },
    status: { type: String, enum: shared_1.CONSIGNMENT_STATUSES, default: 'CREATED' },
    testRequestIds: { type: [mongoose_1.Schema.Types.ObjectId], default: [] },
    dispatchedAt: { type: Date, default: null },
    receivedAt: { type: Date, default: null },
    rejectedAt: { type: Date, default: null },
    rejectionReason: { type: String, maxlength: 500, default: null },
    notes: { type: String, maxlength: 500, default: null },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, (0, schema_options_1.baseSchemaOptions)('consignments'));
exports.ConsignmentSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.ConsignmentSchema.index({ labId: 1, code: 1 }, { unique: true });
exports.ConsignmentSchema.index({ labId: 1, status: 1, createdAt: -1 });
//# sourceMappingURL=preanalytics.schema.js.map