"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resultListQuerySchema = exports.acknowledgeCriticalSchema = exports.updateResultSchema = exports.createResultSchema = exports.resultValueInputSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.resultValueInputSchema = zod_1.z.object({
    analyteKey: zod_1.z.string().trim().min(1).max(60),
    value: zod_1.z.union([zod_1.z.number(), zod_1.z.string(), zod_1.z.null()]),
});
exports.createResultSchema = zod_1.z.object({
    testRequestId: common_1.objectIdSchema,
});
exports.updateResultSchema = zod_1.z.object({
    values: zod_1.z.array(exports.resultValueInputSchema).min(1).max(100),
    comment: zod_1.z.string().trim().max(2_000).nullable().optional(),
});
exports.acknowledgeCriticalSchema = zod_1.z.object({
    note: zod_1.z.string().trim().min(3).max(1_000),
});
exports.resultListQuerySchema = zod_1.z.object({
    discipline: zod_1.z
        .enum(['HISTOPATHOLOGY', 'HAEMATOLOGY', 'CHEMICAL_PATHOLOGY', 'MICROBIOLOGY'])
        .optional(),
    status: zod_1.z.enum(['DRAFT', 'RESULTED', 'VERIFIED', 'RELEASED', 'CANCELLED']).optional(),
    caseId: common_1.objectIdSchema.optional(),
    patientId: common_1.objectIdSchema.optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(50),
});
//# sourceMappingURL=results.js.map