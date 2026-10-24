"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultVersionSchema = exports.ResultSetSchema = exports.ResultVersionModelName = exports.ResultSetModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.ResultSetModelName = 'ResultSet';
exports.ResultVersionModelName = 'ResultVersion';
const valueSchema = new mongoose_1.Schema({
    analyteKey: { type: String, required: true },
    analyteName: { type: String, default: null },
    value: { type: mongoose_1.Schema.Types.Mixed, default: null },
    unit: { type: String, default: null },
    flag: { type: String, enum: shared_1.RESULT_FLAGS, default: 'NORMAL' },
    critical: { type: Boolean, default: false },
    referenceText: { type: String, default: null },
}, { _id: false });
exports.ResultSetSchema = new mongoose_1.Schema({
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    patientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Patient', required: true },
    testRequestId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TestRequest', required: true },
    discipline: { type: String, enum: shared_1.DISCIPLINES, required: true },
    testCode: { type: String, required: true, uppercase: true },
    testName: { type: String, required: true },
    status: { type: String, enum: shared_1.RESULT_STATUSES, default: 'DRAFT' },
    currentVersion: { type: Number, default: 1 },
    values: { type: [valueSchema], default: [] },
    comment: { type: String, maxlength: 2_000, default: null },
    critical: { type: Boolean, default: false },
    criticalAcknowledgedAt: { type: Date, default: null },
    criticalAcknowledgedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    criticalAckNote: { type: String, maxlength: 1_000, default: null },
    enteredBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    verifiedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    verifiedAt: { type: Date, default: null },
    releasedAt: { type: Date, default: null },
    autoVerified: { type: Boolean, default: false },
}, (0, schema_options_1.baseSchemaOptions)('result_sets'));
exports.ResultSetSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.ResultSetSchema.index({ labId: 1, testRequestId: 1 }, { unique: true });
exports.ResultSetSchema.index({ labId: 1, patientId: 1, testCode: 1, createdAt: -1 });
exports.ResultSetSchema.index({ labId: 1, discipline: 1, status: 1 });
exports.ResultVersionSchema = new mongoose_1.Schema({
    resultSetId: { type: mongoose_1.Schema.Types.ObjectId, ref: exports.ResultSetModelName, required: true },
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    version: { type: Number, required: true },
    action: { type: String, required: true },
    values: { type: [valueSchema], default: [] },
    comment: { type: String, maxlength: 2_000, default: null },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, (0, schema_options_1.baseSchemaOptions)('results'));
exports.ResultVersionSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.ResultVersionSchema.index({ labId: 1, resultSetId: 1, version: -1 });
exports.ResultVersionSchema.pre('updateOne', function (next) {
    next(new Error('Result versions are append-only.'));
});
exports.ResultVersionSchema.pre('findOneAndUpdate', function (next) {
    next(new Error('Result versions are append-only.'));
});
exports.ResultVersionSchema.pre('deleteOne', function (next) {
    next(new Error('Result versions are append-only.'));
});
exports.ResultVersionSchema.pre('deleteMany', function (next) {
    next(new Error('Result versions are append-only.'));
});
//# sourceMappingURL=result.schema.js.map