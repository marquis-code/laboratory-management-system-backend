"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportVersionSchema = exports.ReportVersionModelName = void 0;
const mongoose_1 = require("mongoose");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
const append_only_1 = require("../../common/database/append-only");
exports.ReportVersionModelName = 'ReportVersion';
exports.ReportVersionSchema = new mongoose_1.Schema({
    reportId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Report', required: true },
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    version: { type: Number, required: true },
    action: { type: String, enum: ['SIGN_OUT', 'AMEND'], required: true },
    data: { type: mongoose_1.Schema.Types.Mixed, required: true },
    narrative: { type: String, required: true },
    reason: { type: String, default: null },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, (0, schema_options_1.baseSchemaOptions)('report_versions'));
exports.ReportVersionSchema.plugin(tenant_plugin_1.tenantPlugin);
(0, append_only_1.makeAppendOnly)(exports.ReportVersionSchema, 'Report version');
exports.ReportVersionSchema.index({ labId: 1, reportId: 1, version: 1 }, { unique: true });
exports.ReportVersionSchema.index({ labId: 1, caseId: 1 });
//# sourceMappingURL=report-version.schema.js.map