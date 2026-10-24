"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendOutSchema = exports.CapaActionSchema = exports.NonConformanceSchema = exports.TemperatureLogSchema = exports.EquipmentSchema = exports.SendOutModelName = exports.CapaActionModelName = exports.NonConformanceModelName = exports.TemperatureLogModelName = exports.EquipmentModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.EquipmentModelName = 'Equipment';
exports.TemperatureLogModelName = 'TemperatureLog';
exports.NonConformanceModelName = 'NonConformance';
exports.CapaActionModelName = 'CapaAction';
exports.SendOutModelName = 'SendOut';
exports.EquipmentSchema = new mongoose_1.Schema({
    code: { type: String, required: true, trim: true, uppercase: true, maxlength: 40 },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    type: { type: String, required: true, trim: true, maxlength: 80 },
    serialNumber: { type: String, trim: true, maxlength: 80, default: null },
    location: { type: String, trim: true, maxlength: 160, default: null },
    status: { type: String, enum: shared_1.EQUIPMENT_STATUSES, default: 'ACTIVE' },
    lastCalibrationAt: { type: Date, default: null },
    nextCalibrationAt: { type: Date, default: null },
    active: { type: Boolean, default: true },
}, (0, schema_options_1.baseSchemaOptions)('equipment'));
exports.EquipmentSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.EquipmentSchema.index({ labId: 1, code: 1 }, { unique: true });
exports.TemperatureLogSchema = new mongoose_1.Schema({
    equipmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: exports.EquipmentModelName, required: true },
    temperature: { type: Number, required: true },
    unit: { type: String, default: '°C' },
    minAllowed: { type: Number, default: null },
    maxAllowed: { type: Number, default: null },
    inRange: { type: Boolean, default: true },
    recordedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    notes: { type: String, maxlength: 500, default: null },
}, (0, schema_options_1.baseSchemaOptions)('temperature_logs'));
exports.TemperatureLogSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.TemperatureLogSchema.index({ labId: 1, equipmentId: 1, createdAt: -1 });
exports.NonConformanceSchema = new mongoose_1.Schema({
    code: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 3_000 },
    category: { type: String, required: true, maxlength: 80 },
    severity: { type: String, enum: shared_1.NC_SEVERITIES, default: 'MINOR' },
    status: { type: String, enum: shared_1.NC_STATUSES, default: 'OPEN' },
    reportedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedTo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    dueAt: { type: Date, default: null },
    rootCause: { type: String, maxlength: 2_000, default: null },
}, (0, schema_options_1.baseSchemaOptions)('non_conformances'));
exports.NonConformanceSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.NonConformanceSchema.index({ labId: 1, code: 1 }, { unique: true });
exports.NonConformanceSchema.index({ labId: 1, status: 1, createdAt: -1 });
exports.CapaActionSchema = new mongoose_1.Schema({
    nonConformanceId: { type: mongoose_1.Schema.Types.ObjectId, ref: exports.NonConformanceModelName, required: true },
    action: { type: String, required: true, maxlength: 1_000 },
    owner: { type: String, maxlength: 120, default: null },
    dueAt: { type: Date, default: null },
    status: { type: String, enum: shared_1.CAPA_STATUSES, default: 'OPEN' },
    completedAt: { type: Date, default: null },
}, (0, schema_options_1.baseSchemaOptions)('capa_actions'));
exports.CapaActionSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.CapaActionSchema.index({ labId: 1, nonConformanceId: 1 });
exports.SendOutSchema = new mongoose_1.Schema({
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    testRequestId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TestRequest', required: true },
    referenceLab: { type: String, required: true, trim: true, maxlength: 160 },
    reason: { type: String, maxlength: 500, default: null },
    courier: { type: String, maxlength: 120, default: null },
    trackingNumber: { type: String, maxlength: 120, default: null },
    status: { type: String, enum: shared_1.SEND_OUT_STATUSES, default: 'SENT' },
    sentAt: { type: Date, default: null },
    receivedAt: { type: Date, default: null },
    reportedAt: { type: Date, default: null },
    resultSummary: { type: String, maxlength: 3_000, default: null },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, (0, schema_options_1.baseSchemaOptions)('send_outs'));
exports.SendOutSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.SendOutSchema.index({ labId: 1, status: 1, createdAt: -1 });
exports.SendOutSchema.index({ labId: 1, testRequestId: 1 }, { unique: true });
//# sourceMappingURL=quality.schema.js.map