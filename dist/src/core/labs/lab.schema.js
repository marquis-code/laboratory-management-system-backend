"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabSchema = exports.LabModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
exports.LabModelName = 'Lab';
const letterheadSchema = new mongoose_1.Schema({
    phone: { type: String, default: null },
    email: { type: String, default: null },
    website: { type: String, default: null },
    pathologistName: { type: String, default: null },
    pathologistTitle: { type: String, default: null },
    qualifications: { type: String, default: null },
    signatureText: { type: String, default: null },
    footerNote: { type: String, default: null },
}, { _id: false });
exports.LabSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        maxlength: 32,
    },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    address: { type: String, default: null },
    phone: { type: String, default: null },
    email: { type: String, default: null },
    accessionPrefix: { type: String, default: shared_1.DEFAULT_ACCESSION_PREFIX, uppercase: true },
    accessionFormat: { type: String, default: shared_1.DEFAULT_ACCESSION_FORMAT },
    accessionCounters: { type: Map, of: Number, default: {} },
    tatHours: {
        FROZEN: { type: Number, default: shared_1.DEFAULT_TAT_HOURS.FROZEN },
        URGENT: { type: Number, default: shared_1.DEFAULT_TAT_HOURS.URGENT },
        ROUTINE: { type: Number, default: shared_1.DEFAULT_TAT_HOURS.ROUTINE },
    },
    tatWarningPercent: { type: Number, default: shared_1.DEFAULT_TAT_WARNING_PERCENT, min: 50, max: 95 },
    timezone: { type: String, default: 'Africa/Lagos' },
    qaSamplingPercent: { type: Number, default: 10, min: 0, max: 100 },
    currency: { type: String, default: 'NGN', uppercase: true, maxlength: 3 },
    enabledDisciplines: {
        type: [
            {
                type: String,
                enum: ['HISTOPATHOLOGY', 'HAEMATOLOGY', 'CHEMICAL_PATHOLOGY', 'MICROBIOLOGY'],
            },
        ],
        default: ['HISTOPATHOLOGY'],
        validate: {
            validator: (value) => value.length > 0,
            message: 'At least one discipline must be enabled.',
        },
    },
    accessionPrefixes: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    organizationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization', default: null },
    onboardingCompletedAt: { type: Date, default: null },
    letterhead: { type: letterheadSchema, default: () => ({}) },
    active: { type: Boolean, default: true },
}, (0, schema_options_1.baseSchemaOptions)('labs'));
//# sourceMappingURL=lab.schema.js.map