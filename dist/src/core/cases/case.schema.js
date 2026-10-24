"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseSchema = exports.CaseModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.CaseModelName = 'Case';
const referringClinicianSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, maxlength: 160 },
    facility: { type: String, default: null },
    phone: { type: String, default: null },
    email: { type: String, default: null },
    referrerUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, { _id: false });
const summarySchema = new mongoose_1.Schema({
    specimenCount: { type: Number, default: 0 },
    blockCount: { type: Number, default: 0 },
    slideCount: { type: Number, default: 0 },
}, { _id: false });
exports.CaseSchema = new mongoose_1.Schema({
    accessionNumber: { type: String, required: true, trim: true, maxlength: 64 },
    patientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Patient', required: true },
    priority: { type: String, enum: shared_1.PRIORITIES, required: true, default: 'ROUTINE' },
    priorityRank: { type: Number, required: true, default: 2 },
    status: { type: String, enum: shared_1.CASE_STATUSES, required: true, default: 'RECEIVED' },
    statusChangedAt: { type: Date, default: Date.now },
    clinicalHistory: { type: String, required: true, maxlength: 5_000 },
    clinicalDiagnosis: { type: String, default: null },
    subspecialty: { type: String, default: null },
    referringClinician: { type: referringClinicianSchema, required: true },
    assignedPathologistId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    receivedAt: { type: Date, required: true, default: Date.now },
    tatDeadline: { type: Date, required: true },
    reportedAt: { type: Date, default: null },
    amendedAt: { type: Date, default: null },
    tatBreachedAt: { type: Date, default: null },
    summary: { type: summarySchema, default: () => ({}) },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    reportedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    lastScannedAt: { type: Date, default: null },
}, (0, schema_options_1.baseSchemaOptions)('cases'));
exports.CaseSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.CaseSchema.index({ labId: 1, accessionNumber: 1 }, { unique: true });
exports.CaseSchema.index({ labId: 1, status: 1, priorityRank: 1, tatDeadline: 1 });
exports.CaseSchema.index({ labId: 1, patientId: 1 });
exports.CaseSchema.index({ labId: 1, assignedPathologistId: 1, status: 1 });
exports.CaseSchema.index({ labId: 1, receivedAt: -1 });
exports.CaseSchema.index({ labId: 1, 'referringClinician.email': 1 });
exports.CaseSchema.index({ labId: 1, 'referringClinician.referrerUserId': 1 });
exports.CaseSchema.index({ labId: 1, tatDeadline: 1, tatBreachedAt: 1 });
//# sourceMappingURL=case.schema.js.map