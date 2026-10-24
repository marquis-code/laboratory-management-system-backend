"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReagentLotSchema = exports.ReagentLotModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.ReagentLotModelName = 'ReagentLot';
exports.ReagentLotSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, maxlength: 160 },
    category: { type: String, enum: shared_1.REAGENT_CATEGORIES, required: true },
    vendor: { type: String, required: true, trim: true, maxlength: 160 },
    catalogNumber: { type: String, default: null, maxlength: 80 },
    lotNumber: { type: String, required: true, trim: true, maxlength: 80 },
    storageLocation: { type: String, default: null, maxlength: 120 },
    quantity: { type: Number, required: true, min: 0 },
    initialQuantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, maxlength: 32 },
    receivedAt: { type: Date, required: true },
    openedAt: { type: Date, default: null },
    expiresAt: { type: Date, required: true },
    status: { type: String, enum: shared_1.REAGENT_LOT_STATUSES, default: 'QUARANTINED' },
    validationStatus: { type: String, enum: shared_1.LOT_VALIDATION_STATUSES, default: 'PENDING' },
    validatedAt: { type: Date, default: null },
    validatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    validationNote: { type: String, default: null },
    reorderLevel: { type: Number, default: 0, min: 0 },
    expiryAlertedAt: { type: Date, default: null },
    notes: { type: String, default: null },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, (0, schema_options_1.baseSchemaOptions)('reagent_lots'));
exports.ReagentLotSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.ReagentLotSchema.index({ labId: 1, lotNumber: 1, vendor: 1 }, { unique: true });
exports.ReagentLotSchema.index({ labId: 1, status: 1, expiresAt: 1 });
exports.ReagentLotSchema.index({ labId: 1, category: 1, name: 1 });
//# sourceMappingURL=reagent-lot.schema.js.map