"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminologyIdSchema = exports.cumulativeQuerySchema = exports.panelQuerySchema = exports.panelSchema = exports.testDefinitionQuerySchema = exports.testDefinitionSchema = exports.analyteDefinitionSchema = exports.referenceRangeSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
const common_1 = require("./common");
exports.referenceRangeSchema = zod_1.z.object({
    low: zod_1.z.number().nullable().optional(),
    high: zod_1.z.number().nullable().optional(),
    sex: zod_1.z.enum(constants_1.SEXES).nullable().optional(),
    minAge: zod_1.z.number().int().min(0).nullable().optional(),
    maxAge: zod_1.z.number().int().min(0).nullable().optional(),
});
exports.analyteDefinitionSchema = zod_1.z.object({
    key: zod_1.z
        .string()
        .trim()
        .min(1)
        .max(60)
        .regex(/^[a-z][a-zA-Z0-9_]*$/, 'Analyte keys must be camelCase and start with a letter.'),
    name: zod_1.z.string().trim().min(1).max(120),
    unit: zod_1.z.string().trim().max(30).nullable().optional(),
    resultType: zod_1.z.enum(constants_1.RESULT_TYPES),
    decimals: zod_1.z.number().int().min(0).max(6).optional(),
    options: zod_1.z
        .array(zod_1.z.object({
        value: zod_1.z.string().trim().min(1).max(80),
        label: zod_1.z.string().trim().min(1).max(120),
    }))
        .max(100)
        .optional(),
    referenceRanges: zod_1.z.array(exports.referenceRangeSchema).max(20).default([]),
    criticalLow: zod_1.z.number().nullable().optional(),
    criticalHigh: zod_1.z.number().nullable().optional(),
    formula: zod_1.z.string().trim().max(200).nullable().optional(),
    required: zod_1.z.boolean().optional(),
});
exports.testDefinitionSchema = zod_1.z.object({
    discipline: zod_1.z.enum(constants_1.DISCIPLINES),
    code: zod_1.z.string().trim().min(1).max(40),
    name: zod_1.z.string().trim().min(1).max(160),
    specimenType: zod_1.z.string().trim().min(1).max(80),
    method: zod_1.z.string().trim().max(120).nullable().optional(),
    analytes: zod_1.z.array(exports.analyteDefinitionSchema).min(1).max(60),
    active: zod_1.z.boolean().optional(),
});
exports.testDefinitionQuerySchema = zod_1.z.object({
    discipline: zod_1.z.enum(constants_1.DISCIPLINES).optional(),
    q: zod_1.z.string().trim().max(80).optional(),
    active: zod_1.z.coerce.boolean().optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(50),
});
exports.panelSchema = zod_1.z.object({
    discipline: zod_1.z.enum(constants_1.DISCIPLINES),
    code: zod_1.z.string().trim().min(1).max(40),
    name: zod_1.z.string().trim().min(1).max(160),
    testCodes: zod_1.z.array(zod_1.z.string().trim().min(1).max(40)).min(1).max(40),
    active: zod_1.z.boolean().optional(),
});
exports.panelQuerySchema = zod_1.z.object({
    discipline: zod_1.z.enum(constants_1.DISCIPLINES).optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(50),
});
exports.cumulativeQuerySchema = zod_1.z.object({
    from: zod_1.z.string().optional(),
    to: zod_1.z.string().optional(),
    disciplines: zod_1.z.string().optional(),
});
exports.terminologyIdSchema = common_1.objectIdSchema;
//# sourceMappingURL=catalog.js.map