"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.susceptibilitySchema = exports.cultureUpdateSchema = exports.cultureSchema = exports.breakpointSchema = exports.antibioticSchema = exports.organismSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
exports.organismSchema = zod_1.z.object({
    code: zod_1.z.string().trim().min(1).max(40),
    name: zod_1.z.string().trim().min(1).max(160),
    gram: zod_1.z.enum(constants_1.ORGANISM_GRAMS),
    whonetCode: zod_1.z.string().trim().max(40).nullable().optional(),
    active: zod_1.z.boolean().optional(),
});
exports.antibioticSchema = zod_1.z.object({
    code: zod_1.z.string().trim().min(1).max(40),
    name: zod_1.z.string().trim().min(1).max(160),
    className: zod_1.z.string().trim().min(1).max(80),
    whonetCode: zod_1.z.string().trim().max(40).nullable().optional(),
    active: zod_1.z.boolean().optional(),
});
exports.breakpointSchema = zod_1.z.object({
    standard: zod_1.z.enum(constants_1.BREAKPOINT_STANDARDS),
    version: zod_1.z.string().trim().min(1).max(40),
    organismCode: zod_1.z.string().trim().min(1).max(40),
    antibioticCode: zod_1.z.string().trim().min(1).max(40),
    method: zod_1.z.enum(constants_1.AST_METHODS),
    susceptibleThreshold: zod_1.z.number(),
    resistantThreshold: zod_1.z.number(),
    unit: zod_1.z.string().trim().max(30).nullable().optional(),
    firstLine: zod_1.z.boolean().optional(),
    active: zod_1.z.boolean().optional(),
});
exports.cultureSchema = zod_1.z.object({
    testRequestId: zod_1.z.string().trim().min(1),
    specimenType: zod_1.z.string().trim().min(1).max(80),
    plateType: zod_1.z.string().trim().max(80).nullable().optional(),
    media: zod_1.z.string().trim().max(80).nullable().optional(),
    incubation: zod_1.z.string().trim().max(120).nullable().optional(),
    notes: zod_1.z.string().trim().max(2_000).nullable().optional(),
});
exports.cultureUpdateSchema = zod_1.z.object({
    status: zod_1.z
        .enum(['PLATED', 'INCUBATING', 'READ', 'ID_DONE', 'AST_DONE', 'REPORTED', 'REJECTED'])
        .optional(),
    plateType: zod_1.z.string().trim().max(80).nullable().optional(),
    media: zod_1.z.string().trim().max(80).nullable().optional(),
    incubation: zod_1.z.string().trim().max(120).nullable().optional(),
    organismCode: zod_1.z.string().trim().max(40).nullable().optional(),
    colonyCount: zod_1.z.string().trim().max(80).nullable().optional(),
    notes: zod_1.z.string().trim().max(2_000).nullable().optional(),
    resistanceFlags: zod_1.z.array(zod_1.z.string().trim().max(30)).max(10).optional(),
});
exports.susceptibilitySchema = zod_1.z.object({
    isolateId: zod_1.z.string().trim().min(1),
    antibioticCode: zod_1.z.string().trim().min(1),
    method: zod_1.z.enum(constants_1.AST_METHODS),
    value: zod_1.z.number(),
    notes: zod_1.z.string().trim().max(500).nullable().optional(),
});
//# sourceMappingURL=microbiology.js.map