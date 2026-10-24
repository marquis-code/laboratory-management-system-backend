"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QaReviewSchema = exports.QaReviewModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.QaReviewModelName = 'QaReview';
exports.QaReviewSchema = new mongoose_1.Schema({
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    reportId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Report', default: null },
    type: { type: String, enum: shared_1.QA_REVIEW_TYPES, required: true },
    status: { type: String, enum: shared_1.QA_REVIEW_STATUSES, required: true, default: 'PENDING' },
    reason: { type: String, default: null },
    requestedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    dueAt: { type: Date, default: null },
    originalDiagnosis: { type: String, default: null },
    reviewDiagnosis: { type: String, default: null },
    discrepancyCode: { type: String, enum: shared_1.QA_DISCREPANCY_CODES, default: null },
    severity: { type: String, enum: shared_1.QA_SEVERITIES, default: null },
    findings: { type: String, default: null },
    actionPlan: { type: String, default: null },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    metadata: { type: mongoose_1.Schema.Types.Mixed, default: {} },
}, (0, schema_options_1.baseSchemaOptions)('qa_reviews'));
exports.QaReviewSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.QaReviewSchema.index({ labId: 1, status: 1, dueAt: 1 });
exports.QaReviewSchema.index({ labId: 1, reviewerId: 1, status: 1 });
exports.QaReviewSchema.index({ labId: 1, caseId: 1, createdAt: -1 });
exports.QaReviewSchema.index({ labId: 1, reportId: 1, status: 1 });
//# sourceMappingURL=qa-review.schema.js.map