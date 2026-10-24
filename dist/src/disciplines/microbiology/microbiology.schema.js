"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SusceptibilitySchema = exports.IsolateSchema = exports.CultureSchema = exports.BreakpointSchema = exports.AntibioticSchema = exports.OrganismSchema = exports.SusceptibilityModelName = exports.IsolateModelName = exports.CultureModelName = exports.BreakpointModelName = exports.AntibioticModelName = exports.OrganismModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.OrganismModelName = 'Organism';
exports.AntibioticModelName = 'Antibiotic';
exports.BreakpointModelName = 'Breakpoint';
exports.CultureModelName = 'Culture';
exports.IsolateModelName = 'Isolate';
exports.SusceptibilityModelName = 'SusceptibilityResult';
exports.OrganismSchema = new mongoose_1.Schema({
    code: { type: String, required: true, trim: true, uppercase: true, maxlength: 40 },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    gram: { type: String, enum: shared_1.ORGANISM_GRAMS, required: true },
    whonetCode: { type: String, trim: true, maxlength: 40, default: null },
    active: { type: Boolean, default: true },
}, (0, schema_options_1.baseSchemaOptions)('organisms'));
exports.OrganismSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.OrganismSchema.index({ labId: 1, code: 1 }, { unique: true });
exports.AntibioticSchema = new mongoose_1.Schema({
    code: { type: String, required: true, trim: true, uppercase: true, maxlength: 40 },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    className: { type: String, required: true, trim: true, maxlength: 80 },
    whonetCode: { type: String, trim: true, maxlength: 40, default: null },
    active: { type: Boolean, default: true },
}, (0, schema_options_1.baseSchemaOptions)('antibiotics'));
exports.AntibioticSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.AntibioticSchema.index({ labId: 1, code: 1 }, { unique: true });
exports.BreakpointSchema = new mongoose_1.Schema({
    standard: { type: String, enum: shared_1.BREAKPOINT_STANDARDS, required: true },
    version: { type: String, required: true, trim: true, maxlength: 40 },
    organismCode: { type: String, required: true, trim: true, uppercase: true },
    antibioticCode: { type: String, required: true, trim: true, uppercase: true },
    method: { type: String, enum: shared_1.AST_METHODS, required: true },
    susceptibleThreshold: { type: Number, required: true },
    resistantThreshold: { type: Number, required: true },
    unit: { type: String, trim: true, maxlength: 30, default: null },
    firstLine: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
}, (0, schema_options_1.baseSchemaOptions)('breakpoint_tables'));
exports.BreakpointSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.BreakpointSchema.index({ labId: 1, organismCode: 1, antibioticCode: 1, method: 1 }, { unique: true });
exports.CultureSchema = new mongoose_1.Schema({
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    patientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Patient', required: true },
    testRequestId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TestRequest', required: true },
    status: { type: String, default: 'RECEIVED' },
    specimenType: { type: String, required: true, trim: true, maxlength: 80 },
    plateType: { type: String, trim: true, maxlength: 80, default: null },
    media: { type: String, trim: true, maxlength: 80, default: null },
    incubation: { type: String, trim: true, maxlength: 120, default: null },
    organismCode: { type: String, trim: true, uppercase: true, default: null },
    colonyCount: { type: String, trim: true, maxlength: 80, default: null },
    notes: { type: String, maxlength: 2_000, default: null },
    resistanceFlags: { type: [String], default: [] },
    reportedAt: { type: Date, default: null },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, (0, schema_options_1.baseSchemaOptions)('cultures'));
exports.CultureSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.CultureSchema.index({ labId: 1, testRequestId: 1 }, { unique: true });
exports.CultureSchema.index({ labId: 1, status: 1, createdAt: -1 });
exports.IsolateSchema = new mongoose_1.Schema({
    cultureId: { type: mongoose_1.Schema.Types.ObjectId, ref: exports.CultureModelName, required: true },
    organismCode: { type: String, required: true, trim: true, uppercase: true },
    organismName: { type: String, required: true, trim: true },
    gram: { type: String, enum: shared_1.ORGANISM_GRAMS, default: null },
    notes: { type: String, maxlength: 1_000, default: null },
}, (0, schema_options_1.baseSchemaOptions)('isolates'));
exports.IsolateSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.IsolateSchema.index({ labId: 1, cultureId: 1 });
exports.SusceptibilitySchema = new mongoose_1.Schema({
    cultureId: { type: mongoose_1.Schema.Types.ObjectId, ref: exports.CultureModelName, required: true },
    isolateId: { type: mongoose_1.Schema.Types.ObjectId, ref: exports.IsolateModelName, required: true },
    antibioticCode: { type: String, required: true, uppercase: true },
    antibioticName: { type: String, required: true },
    method: { type: String, enum: shared_1.AST_METHODS, required: true },
    value: { type: Number, default: null },
    interpretation: { type: String, enum: shared_1.AST_INTERPRETATIONS, required: true },
    breakpointId: { type: mongoose_1.Schema.Types.ObjectId, ref: exports.BreakpointModelName, default: null },
    standard: { type: String, enum: shared_1.BREAKPOINT_STANDARDS, default: null },
    unit: { type: String, default: null },
    notes: { type: String, maxlength: 500, default: null },
}, (0, schema_options_1.baseSchemaOptions)('susceptibility_results'));
exports.SusceptibilitySchema.plugin(tenant_plugin_1.tenantPlugin);
exports.SusceptibilitySchema.index({ labId: 1, cultureId: 1, antibioticCode: 1 });
//# sourceMappingURL=microbiology.schema.js.map