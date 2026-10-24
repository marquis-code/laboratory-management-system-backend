"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadSchema = exports.LeadModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
exports.LeadModelName = 'Lead';
exports.LeadSchema = new mongoose_1.Schema({
    type: { type: String, enum: shared_1.LEAD_TYPES, default: 'DEMO' },
    organizationName: { type: String, required: true, trim: true, maxlength: 200 },
    contactName: { type: String, required: true, trim: true, maxlength: 150 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 40, default: null },
    role: { type: String, trim: true, maxlength: 120, default: null },
    departments: { type: [String], default: [] },
    monthlyVolume: { type: String, trim: true, maxlength: 80, default: null },
    message: { type: String, maxlength: 2_000, default: null },
    status: { type: String, enum: shared_1.LEAD_STATUSES, default: 'NEW' },
}, (0, schema_options_1.baseSchemaOptions)('leads'));
exports.LeadSchema.index({ status: 1, createdAt: -1 });
exports.LeadSchema.index({ type: 1, createdAt: -1 });
//# sourceMappingURL=lead.schema.js.map