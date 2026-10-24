"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qcQuerySchema = exports.qcRunSchema = exports.qcMaterialSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
exports.qcMaterialSchema = zod_1.z.object({
    discipline: zod_1.z.enum(constants_1.DISCIPLINES),
    name: zod_1.z.string().trim().min(1).max(160),
    lotNumber: zod_1.z.string().trim().min(1).max(80),
    level: zod_1.z.enum(constants_1.QC_LEVELS),
    testCode: zod_1.z.string().trim().min(1).max(40),
    analyteKey: zod_1.z.string().trim().min(1).max(60),
    targetMean: zod_1.z.number(),
    targetSd: zod_1.z.number().positive(),
    unit: zod_1.z.string().trim().max(30).nullable().optional(),
    active: zod_1.z.boolean().optional(),
});
exports.qcRunSchema = zod_1.z.object({
    materialId: zod_1.z.string().trim().min(1),
    values: zod_1.z.array(zod_1.z.number()).min(2).max(30),
    comment: zod_1.z.string().trim().max(1_000).nullable().optional(),
});
exports.qcQuerySchema = zod_1.z.object({
    discipline: zod_1.z.enum(constants_1.DISCIPLINES).optional(),
    materialId: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(50),
});
//# sourceMappingURL=qc.js.map