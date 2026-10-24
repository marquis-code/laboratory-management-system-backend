"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QcRunSchema = exports.QcMaterialSchema = exports.QcRunModelName = exports.QcMaterialModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.QcMaterialModelName = 'QcMaterial';
exports.QcRunModelName = 'QcRun';
exports.QcMaterialSchema = new mongoose_1.Schema({
    discipline: { type: String, enum: shared_1.DISCIPLINES, required: true },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    lotNumber: { type: String, required: true, trim: true, maxlength: 80 },
    level: { type: String, enum: shared_1.QC_LEVELS, required: true },
    testCode: { type: String, required: true, trim: true, uppercase: true },
    analyteKey: { type: String, required: true, trim: true },
    targetMean: { type: Number, required: true },
    targetSd: { type: Number, required: true },
    unit: { type: String, trim: true, maxlength: 30, default: null },
    active: { type: Boolean, default: true },
}, (0, schema_options_1.baseSchemaOptions)('qc_materials'));
exports.QcMaterialSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.QcMaterialSchema.index({ labId: 1, discipline: 1, testCode: 1, level: 1 });
exports.QcRunSchema = new mongoose_1.Schema({
    materialId: { type: mongoose_1.Schema.Types.ObjectId, ref: exports.QcMaterialModelName, required: true },
    testCode: { type: String, required: true, uppercase: true },
    analyteKey: { type: String, required: true },
    mean: { type: Number, required: true },
    sd: { type: Number, required: true },
    values: { type: [Number], required: true },
    points: { type: [{ value: Number, z: Number }], default: [] },
    status: { type: String, enum: shared_1.QC_STATUSES, required: true },
    violations: {
        type: [{ rule: { type: String, enum: shared_1.WESTGARD_RULES }, message: String }],
        default: [],
    },
    comment: { type: String, maxlength: 1_000, default: null },
    performedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, (0, schema_options_1.baseSchemaOptions)('qc_runs'));
exports.QcRunSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.QcRunSchema.index({ labId: 1, materialId: 1, createdAt: -1 });
//# sourceMappingURL=qc.schema.js.map