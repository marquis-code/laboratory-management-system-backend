"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSchema = exports.OrganizationModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
exports.OrganizationModelName = 'Organization';
exports.OrganizationSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        maxlength: 32,
    },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    type: { type: String, enum: shared_1.ORGANIZATION_TYPES, required: true },
    status: { type: String, enum: shared_1.ORGANIZATION_STATUSES, default: 'ONBOARDING' },
    plan: { type: String, enum: shared_1.SUBSCRIPTION_PLANS, default: 'TRIAL' },
    seats: { type: Number, default: 10, min: 1 },
    country: { type: String, default: 'Nigeria', trim: true, maxlength: 80 },
    state: { type: String, trim: true, maxlength: 80, default: null },
    city: { type: String, trim: true, maxlength: 80, default: null },
    address: { type: String, trim: true, maxlength: 300, default: null },
    phone: { type: String, trim: true, maxlength: 40, default: null },
    email: { type: String, lowercase: true, trim: true, maxlength: 160, default: null },
    website: { type: String, trim: true, maxlength: 160, default: null },
    trialEndsAt: { type: Date, default: null },
    notes: { type: String, maxlength: 1_000, default: null },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, (0, schema_options_1.baseSchemaOptions)('organizations'));
exports.OrganizationSchema.index({ status: 1, createdAt: -1 });
exports.OrganizationSchema.index({ plan: 1 });
//# sourceMappingURL=organization.schema.js.map