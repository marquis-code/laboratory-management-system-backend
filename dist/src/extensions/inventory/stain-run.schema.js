"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StainRunSchema = exports.StainRunModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.StainRunModelName = 'StainRun';
exports.StainRunSchema = new mongoose_1.Schema({
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    slideId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Slide', default: null },
    blockId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Block', default: null },
    stainType: { type: String, enum: shared_1.STAIN_TYPES, required: true },
    stainName: { type: String, required: true, maxlength: 160 },
    status: { type: String, enum: shared_1.STAIN_RUN_STATUSES, default: 'RUNNING' },
    qcResult: { type: String, enum: shared_1.STAIN_QC_RESULTS, default: 'PENDING' },
    lots: {
        type: [
            new mongoose_1.Schema({
                lotId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ReagentLot', required: true },
                lotNumber: { type: String, required: true },
                name: { type: String, required: true },
                quantityUsed: { type: Number, required: true, min: 0 },
            }, { _id: false }),
        ],
        default: [],
    },
    equipment: { type: String, default: null },
    operatorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    notes: { type: String, default: null },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, (0, schema_options_1.baseSchemaOptions)('stain_runs'));
exports.StainRunSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.StainRunSchema.index({ labId: 1, caseId: 1, createdAt: -1 });
exports.StainRunSchema.index({ labId: 1, slideId: 1 });
exports.StainRunSchema.index({ labId: 1, status: 1, startedAt: -1 });
//# sourceMappingURL=stain-run.schema.js.map