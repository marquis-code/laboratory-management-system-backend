"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportSchema = exports.ReportModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.ReportModelName = 'Report';
exports.ReportSchema = new mongoose_1.Schema({
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    protocolId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Protocol', required: true },
    protocolSnapshot: { type: mongoose_1.Schema.Types.Mixed, required: true },
    protocolVersion: { type: Number, required: true },
    status: { type: String, enum: shared_1.REPORT_STATUSES, required: true, default: 'DRAFT' },
    data: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    narrative: { type: String, default: '' },
    version: { type: Number, required: true, default: 0 },
    requiredComplete: { type: Boolean, default: false },
    missingRequired: { type: [String], default: [] },
    signedOutBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    signedOutAt: { type: Date, default: null },
    amendedAt: { type: Date, default: null },
    amendmentReason: { type: String, default: null },
    verificationCode: { type: String, default: null },
    coding: {
        snomedCode: { type: String, default: null },
        snomedDisplay: { type: String, default: null },
        icdo3MorphologyCode: { type: String, default: null },
        icdo3MorphologyDisplay: { type: String, default: null },
        icdo3TopographyCode: { type: String, default: null },
        icdo3TopographyDisplay: { type: String, default: null },
    },
    releasedAt: { type: Date, default: null },
    releasedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    releaseNote: { type: String, default: null },
    secondOpinionStatus: { type: String, default: null },
    pdfPath: { type: String, default: null },
    pdfGeneratedAt: { type: Date, default: null },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, (0, schema_options_1.baseSchemaOptions)('reports'));
exports.ReportSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.ReportSchema.index({ labId: 1, caseId: 1 }, { unique: true });
exports.ReportSchema.index({ verificationCode: 1 }, { unique: true, partialFilterExpression: { verificationCode: { $type: 'string' } } });
exports.ReportSchema.index({ labId: 1, status: 1, signedOutAt: -1 });
exports.ReportSchema.index({ labId: 1, releasedAt: -1 });
//# sourceMappingURL=report.schema.js.map