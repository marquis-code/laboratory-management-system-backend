"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ruleQuerySchema = exports.ruleSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
const conditionSchema = zod_1.z.lazy(() => zod_1.z.union([
    zod_1.z.object({
        field: zod_1.z.string().trim().min(1).max(160),
        op: zod_1.z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'between', 'contains', 'exists']),
        value: zod_1.z.unknown().optional(),
    }),
    zod_1.z.object({ all: zod_1.z.array(conditionSchema).min(1).max(50) }),
    zod_1.z.object({ any: zod_1.z.array(conditionSchema).min(1).max(50) }),
    zod_1.z.object({ not: conditionSchema }),
]));
exports.ruleSchema = zod_1.z.object({
    code: zod_1.z.string().trim().min(1).max(60),
    name: zod_1.z.string().trim().min(1).max(160),
    description: zod_1.z.string().trim().max(1_000).nullable().optional(),
    discipline: zod_1.z.enum(constants_1.DISCIPLINES),
    testCodes: zod_1.z.array(zod_1.z.string().trim().min(1).max(40)).max(60).default([]),
    trigger: zod_1.z.enum(constants_1.RULE_TRIGGERS),
    priority: zod_1.z.number().int().min(0).max(1_000).default(100),
    active: zod_1.z.boolean().optional(),
    conditions: conditionSchema,
    actions: zod_1.z
        .array(zod_1.z.object({
        type: zod_1.z.enum(constants_1.RULE_ACTIONS),
        testCode: zod_1.z.string().trim().max(40).optional(),
        message: zod_1.z.string().trim().max(500).optional(),
        severity: zod_1.z.enum(['INFO', 'WARNING', 'CRITICAL']).optional(),
    }))
        .min(1)
        .max(10),
});
exports.ruleQuerySchema = zod_1.z.object({
    discipline: zod_1.z.enum(constants_1.DISCIPLINES).optional(),
    active: zod_1.z.coerce.boolean().optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(50),
});
//# sourceMappingURL=rules.js.map