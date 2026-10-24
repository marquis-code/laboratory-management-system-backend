"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportListQuerySchema = exports.amendReportSchema = exports.signOutReportSchema = exports.updateReportSchema = exports.createReportSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
const common_1 = require("./common");
const report_data_1 = require("./report-data");
exports.createReportSchema = zod_1.z.object({
    protocolId: common_1.objectIdSchema,
});
exports.updateReportSchema = zod_1.z.object({
    data: report_data_1.reportDataSchema,
});
exports.signOutReportSchema = zod_1.z.object({
    statement: zod_1.z.string().trim().max(500).optional(),
});
exports.amendReportSchema = zod_1.z.object({
    reason: zod_1.z.string().trim().min(10, 'Give a clear reason for the amendment.').max(2_000),
    data: report_data_1.reportDataSchema.optional(),
});
exports.reportListQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    status: zod_1.z.enum(constants_1.REPORT_STATUSES).optional(),
    q: zod_1.z.string().trim().max(120).optional(),
});
//# sourceMappingURL=report.js.map