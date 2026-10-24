"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientSchema = exports.PatientModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.PatientModelName = 'Patient';
const nextOfKinSchema = new mongoose_1.Schema({
    name: { type: String, default: null },
    phone: { type: String, default: null },
    relationship: { type: String, default: null },
}, { _id: false });
exports.PatientSchema = new mongoose_1.Schema({
    mrn: { type: String, required: true, uppercase: true, trim: true, maxlength: 40 },
    firstName: { type: String, required: true, trim: true, maxlength: 100 },
    lastName: { type: String, required: true, trim: true, maxlength: 100 },
    sex: { type: String, enum: shared_1.SEXES, required: true },
    dateOfBirth: { type: Date, default: null },
    age: { type: Number, default: null, min: 0, max: 130 },
    phone: { type: String, default: null },
    email: { type: String, default: null, lowercase: true },
    address: { type: String, default: null },
    nationalId: { type: String, default: null },
    nextOfKin: { type: nextOfKinSchema, default: null },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, (0, schema_options_1.baseSchemaOptions)('patients'));
exports.PatientSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.PatientSchema.index({ labId: 1, mrn: 1 }, { unique: true });
exports.PatientSchema.index({ labId: 1, lastName: 1, firstName: 1 });
exports.PatientSchema.index({ labId: 1, phone: 1 });
//# sourceMappingURL=patient.schema.js.map