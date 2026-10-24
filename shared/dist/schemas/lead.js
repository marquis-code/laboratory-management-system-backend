"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadUpdateSchema = exports.leadCreateSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
exports.leadCreateSchema = zod_1.z.object({
    type: zod_1.z.enum(constants_1.LEAD_TYPES).default('DEMO'),
    organizationName: zod_1.z.string().trim().min(2).max(200),
    contactName: zod_1.z.string().trim().min(2).max(150),
    email: zod_1.z.string().trim().email().max(160),
    phone: zod_1.z.string().trim().max(40).nullable().optional(),
    role: zod_1.z.string().trim().max(120).nullable().optional(),
    departments: zod_1.z.array(zod_1.z.string().trim().max(80)).max(10).optional(),
    monthlyVolume: zod_1.z.string().trim().max(80).nullable().optional(),
    message: zod_1.z.string().trim().max(2_000).nullable().optional(),
});
exports.leadUpdateSchema = zod_1.z.object({
    status: zod_1.z.enum(constants_1.LEAD_STATUSES),
});
//# sourceMappingURL=lead.js.map