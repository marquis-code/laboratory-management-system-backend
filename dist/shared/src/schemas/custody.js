"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locatorQuerySchema = exports.scanSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
exports.scanSchema = zod_1.z.object({
    barcode: zod_1.z
        .string()
        .trim()
        .min(3, 'Scan or type a barcode.')
        .max(128)
        .transform((value) => value.toUpperCase().replace(/\s+/g, '')),
    station: zod_1.z.enum(constants_1.STATIONS),
    eventType: zod_1.z.enum(['REJECTED', 'RECUT_REQUESTED']).optional(),
    reason: zod_1.z.string().trim().max(1_000).optional(),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
});
exports.locatorQuerySchema = zod_1.z.object({
    q: zod_1.z.string().trim().max(128).optional(),
});
//# sourceMappingURL=custody.js.map