"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecimenSchema = exports.SpecimenModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.SpecimenModelName = 'Specimen';
exports.SpecimenSchema = new mongoose_1.Schema({
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    sequence: { type: Number, required: true, min: 1 },
    label: { type: String, required: true, uppercase: true, trim: true },
    barcode: { type: String, required: true, uppercase: true, trim: true },
    specimenType: { type: String, required: true, trim: true, maxlength: 120 },
    site: { type: String, required: true, trim: true, maxlength: 200 },
    laterality: { type: String, enum: shared_1.LATERALITIES, default: null },
    description: { type: String, default: null },
    collectedAt: { type: Date, default: null },
    receivedAt: { type: Date, required: true, default: Date.now },
    grossDescription: { type: String, default: null },
    status: { type: String, enum: shared_1.PHYSICAL_STATES, required: true, default: 'ACCESSIONED' },
    currentStation: { type: String, default: null },
    rejectionReason: { type: String, default: null },
    rejectionCode: { type: String, default: null },
}, (0, schema_options_1.baseSchemaOptions)('specimens'));
exports.SpecimenSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.SpecimenSchema.index({ labId: 1, barcode: 1 }, { unique: true });
exports.SpecimenSchema.index({ labId: 1, caseId: 1, sequence: 1 });
//# sourceMappingURL=specimen.schema.js.map