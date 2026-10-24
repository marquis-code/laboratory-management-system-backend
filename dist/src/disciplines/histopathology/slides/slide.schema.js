"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlideSchema = exports.SlideModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../../common/database/schema-options");
const tenant_plugin_1 = require("../../../common/database/tenant.plugin");
exports.SlideModelName = 'Slide';
exports.SlideSchema = new mongoose_1.Schema({
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    specimenId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Specimen', required: true },
    blockId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Block', required: true },
    blockLabel: { type: String, required: true, uppercase: true, trim: true },
    slideNumber: { type: Number, required: true, min: 1 },
    label: { type: String, required: true, uppercase: true, trim: true },
    barcode: { type: String, required: true, uppercase: true, trim: true },
    stainType: { type: String, enum: shared_1.STAIN_TYPES, required: true, default: 'H_AND_E' },
    specialStain: { type: String, default: null },
    status: { type: String, enum: shared_1.PHYSICAL_STATES, required: true, default: 'ACCESSIONED' },
    currentStation: { type: String, default: null },
    recutOfSlideId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Slide', default: null },
    requestReason: { type: String, default: null },
    notes: { type: String, default: null },
    stainRunId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'StainRun', default: null },
    wsiStatus: { type: String, enum: ['LINKED', 'PROCESSING', 'FAILED'], default: null },
    wsiUrl: { type: String, default: null },
    wsiViewerUrl: { type: String, default: null },
    wsiScanner: { type: String, default: null },
    wsiMagnification: { type: String, default: null },
    wsiAddedAt: { type: Date, default: null },
    wsiAddedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    wsiMetadata: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    lastEventAt: { type: Date, default: null },
}, (0, schema_options_1.baseSchemaOptions)('slides'));
exports.SlideSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.SlideSchema.index({ labId: 1, barcode: 1 }, { unique: true });
exports.SlideSchema.index({ labId: 1, caseId: 1, blockId: 1, slideNumber: 1 });
exports.SlideSchema.index({ labId: 1, status: 1 });
exports.SlideSchema.index({ labId: 1, stainRunId: 1 });
//# sourceMappingURL=slide.schema.js.map