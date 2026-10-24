"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockSchema = exports.BlockModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../../common/database/schema-options");
const tenant_plugin_1 = require("../../../common/database/tenant.plugin");
exports.BlockModelName = 'Block';
exports.BlockSchema = new mongoose_1.Schema({
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    specimenId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Specimen', required: true },
    specimenSequence: { type: Number, required: true },
    blockNumber: { type: Number, required: true, min: 1 },
    label: { type: String, required: true, uppercase: true, trim: true },
    barcode: { type: String, required: true, uppercase: true, trim: true },
    grossDescription: { type: String, default: null },
    status: { type: String, enum: shared_1.PHYSICAL_STATES, required: true, default: 'ACCESSIONED' },
    currentStation: { type: String, default: null },
    slideCount: { type: Number, default: 0 },
    lastEventAt: { type: Date, default: null },
    notes: { type: String, default: null },
}, (0, schema_options_1.baseSchemaOptions)('blocks'));
exports.BlockSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.BlockSchema.index({ labId: 1, barcode: 1 }, { unique: true });
exports.BlockSchema.index({ labId: 1, caseId: 1, specimenId: 1, blockNumber: 1 });
exports.BlockSchema.index({ labId: 1, status: 1 });
//# sourceMappingURL=block.schema.js.map