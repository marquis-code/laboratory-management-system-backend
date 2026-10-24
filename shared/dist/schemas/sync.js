"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanIdempotencySchema = exports.syncBatchSchema = exports.syncMutationSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
const common_1 = require("./common");
exports.syncMutationSchema = zod_1.z.object({
    id: zod_1.z.string().min(8).max(80),
    type: zod_1.z.enum(constants_1.SYNC_MUTATION_TYPES),
    payload: zod_1.z.record(zod_1.z.unknown()),
    createdAt: zod_1.z.string().datetime({ offset: true }).optional(),
});
exports.syncBatchSchema = zod_1.z.object({
    mutations: zod_1.z.array(exports.syncMutationSchema).max(100),
});
exports.scanIdempotencySchema = zod_1.z.object({
    barcode: zod_1.z.string().trim().min(3).max(128),
    station: zod_1.z.enum(constants_1.STATIONS),
    eventType: zod_1.z.enum(['REJECTED', 'RECUT_REQUESTED']).optional(),
    reason: zod_1.z.string().trim().max(1_000).optional(),
    reasonCode: zod_1.z.string().trim().max(60).optional(),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
});
void common_1.objectIdSchema;
//# sourceMappingURL=sync.js.map