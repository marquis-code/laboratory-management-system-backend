"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectWithCodeSchema = exports.qaQuerySchema = exports.qaCompleteSchema = exports.qaStartSchema = exports.qaAssignSchema = exports.qaReviewSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
const common_1 = require("./common");
exports.qaReviewSchema = zod_1.z.object({
    caseId: common_1.objectIdSchema,
    reportId: common_1.objectIdSchema.optional(),
    type: zod_1.z.enum(constants_1.QA_REVIEW_TYPES),
    reviewerId: common_1.objectIdSchema.optional(),
    reason: zod_1.z.string().trim().min(5, 'Record why review is needed.').max(1_000),
    dueAt: zod_1.z.string().datetime({ offset: true }).optional(),
});
exports.qaAssignSchema = zod_1.z.object({
    reviewerId: common_1.objectIdSchema,
    dueAt: zod_1.z.string().datetime({ offset: true }).optional(),
});
exports.qaStartSchema = zod_1.z.object({
    findings: zod_1.z.string().trim().min(10, 'Record your review findings.').max(5_000).optional(),
});
exports.qaCompleteSchema = zod_1.z.object({
    outcome: zod_1.z.enum(['AGREED', 'DISCREPANT']),
    reviewDiagnosis: zod_1.z.string().trim().max(5_000).optional(),
    disagreementCode: zod_1.z.enum(constants_1.QA_DISCREPANCY_CODES).optional(),
    severity: zod_1.z.enum(constants_1.QA_SEVERITIES).optional(),
    findings: zod_1.z.string().trim().min(10, 'Record the peer-review findings.').max(5_000),
    actionPlan: zod_1.z.string().trim().max(2_000).optional(),
});
exports.qaQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(30),
    status: zod_1.z.enum(constants_1.QA_REVIEW_STATUSES).optional(),
    type: zod_1.z.enum(constants_1.QA_REVIEW_TYPES).optional(),
    reviewerId: common_1.objectIdSchema.optional(),
    mine: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.enum(['true', 'false'])])
        .optional()
        .transform((value) => value === true || value === 'true'),
});
exports.rejectWithCodeSchema = zod_1.z.object({
    reasonCode: zod_1.z.enum(constants_1.REJECTION_REASON_CODES),
    reason: zod_1.z.string().trim().min(5, 'Add a short note explaining the rejection.').max(1_000),
});
//# sourceMappingURL=qa.js.map