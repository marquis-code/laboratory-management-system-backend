"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOutUpdateSchema = exports.sendOutSchema = exports.capaSchema = exports.nonConformanceUpdateSchema = exports.nonConformanceSchema = exports.temperatureLogSchema = exports.equipmentSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
exports.equipmentSchema = zod_1.z.object({
    code: zod_1.z.string().trim().min(1).max(40),
    name: zod_1.z.string().trim().min(1).max(160),
    type: zod_1.z.string().trim().min(1).max(80),
    serialNumber: zod_1.z.string().trim().max(80).nullable().optional(),
    location: zod_1.z.string().trim().max(160).nullable().optional(),
    status: zod_1.z.enum(constants_1.EQUIPMENT_STATUSES).optional(),
    lastCalibrationAt: zod_1.z.string().optional(),
    nextCalibrationAt: zod_1.z.string().optional(),
    active: zod_1.z.boolean().optional(),
});
exports.temperatureLogSchema = zod_1.z.object({
    temperature: zod_1.z.number(),
    unit: zod_1.z.string().trim().max(10).default('°C'),
    minAllowed: zod_1.z.number().nullable().optional(),
    maxAllowed: zod_1.z.number().nullable().optional(),
    notes: zod_1.z.string().trim().max(500).nullable().optional(),
});
exports.nonConformanceSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(3).max(200),
    description: zod_1.z.string().trim().min(5).max(3_000),
    category: zod_1.z.string().trim().min(1).max(80),
    severity: zod_1.z.enum(constants_1.NC_SEVERITIES),
    assignedToId: zod_1.z.string().trim().optional(),
    dueAt: zod_1.z.string().optional(),
});
exports.nonConformanceUpdateSchema = zod_1.z.object({
    status: zod_1.z.enum(constants_1.NC_STATUSES).optional(),
    severity: zod_1.z.enum(constants_1.NC_SEVERITIES).optional(),
    rootCause: zod_1.z.string().trim().max(2_000).nullable().optional(),
    assignedToId: zod_1.z.string().trim().nullable().optional(),
});
exports.capaSchema = zod_1.z.object({
    action: zod_1.z.string().trim().min(3).max(1_000),
    owner: zod_1.z.string().trim().max(120).nullable().optional(),
    dueAt: zod_1.z.string().optional(),
    status: zod_1.z.enum(constants_1.CAPA_STATUSES).optional(),
});
exports.sendOutSchema = zod_1.z.object({
    testRequestId: zod_1.z.string().trim().min(1),
    referenceLab: zod_1.z.string().trim().min(2).max(160),
    reason: zod_1.z.string().trim().max(500).nullable().optional(),
    courier: zod_1.z.string().trim().max(120).nullable().optional(),
    trackingNumber: zod_1.z.string().trim().max(120).nullable().optional(),
});
exports.sendOutUpdateSchema = zod_1.z.object({
    status: zod_1.z.enum(constants_1.SEND_OUT_STATUSES).optional(),
    resultSummary: zod_1.z.string().trim().max(3_000).nullable().optional(),
});
//# sourceMappingURL=quality.js.map