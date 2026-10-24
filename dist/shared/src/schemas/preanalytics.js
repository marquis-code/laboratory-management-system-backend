"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveConsignmentSchema = exports.consignmentSchema = exports.collectionCentreSchema = void 0;
const zod_1 = require("zod");
exports.collectionCentreSchema = zod_1.z.object({
    code: zod_1.z.string().trim().min(1).max(30),
    name: zod_1.z.string().trim().min(1).max(160),
    address: zod_1.z.string().trim().max(300).nullable().optional(),
    phone: zod_1.z.string().trim().max(40).nullable().optional(),
    homeCollection: zod_1.z.boolean().optional(),
    active: zod_1.z.boolean().optional(),
});
exports.consignmentSchema = zod_1.z.object({
    centreId: zod_1.z.string().trim().min(1),
    testRequestIds: zod_1.z.array(zod_1.z.string().trim().min(1)).min(1).max(200),
    riderName: zod_1.z.string().trim().max(120).nullable().optional(),
    riderPhone: zod_1.z.string().trim().max(40).nullable().optional(),
    notes: zod_1.z.string().trim().max(500).nullable().optional(),
});
exports.receiveConsignmentSchema = zod_1.z.object({
    accepted: zod_1.z.boolean(),
    rejectionReason: zod_1.z.string().trim().max(500).nullable().optional(),
});
//# sourceMappingURL=preanalytics.js.map