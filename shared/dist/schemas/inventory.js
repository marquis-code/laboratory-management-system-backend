"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stainRunQuerySchema = exports.completeStainRunSchema = exports.stainRunSchema = exports.validateLotSchema = exports.reagentLotQuerySchema = exports.reagentLotSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
const common_1 = require("./common");
exports.reagentLotSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Name the reagent or antibody.').max(160),
    category: zod_1.z.enum(constants_1.REAGENT_CATEGORIES),
    vendor: zod_1.z.string().trim().min(2, 'Vendor is required.').max(160),
    catalogNumber: zod_1.z.string().trim().max(80).optional(),
    lotNumber: zod_1.z.string().trim().min(1, 'Lot number is required.').max(80),
    storageLocation: zod_1.z.string().trim().max(120).optional(),
    quantity: zod_1.z.coerce.number().min(0).max(1_000_000),
    unit: zod_1.z.string().trim().min(1).max(32),
    receivedAt: zod_1.z.string().datetime({ offset: true }),
    expiresAt: zod_1.z.string().datetime({ offset: true }),
    openedAt: zod_1.z.string().datetime({ offset: true }).optional(),
    notes: zod_1.z.string().trim().max(2_000).optional(),
});
exports.reagentLotQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(30),
    q: zod_1.z.string().trim().max(120).optional(),
    category: zod_1.z.enum(constants_1.REAGENT_CATEGORIES).optional(),
    status: zod_1.z.enum(['QUARANTINED', 'ACTIVE', 'EXPIRED', 'DEPLETED', 'REJECTED']).optional(),
    expiringWithinDays: zod_1.z.coerce.number().int().min(0).max(365).optional(),
});
exports.validateLotSchema = zod_1.z.object({
    note: zod_1.z.string().trim().max(500).optional(),
});
exports.stainRunSchema = zod_1.z
    .object({
    caseId: common_1.objectIdSchema,
    slideId: common_1.objectIdSchema.optional(),
    blockId: common_1.objectIdSchema.optional(),
    stainType: zod_1.z.enum(constants_1.STAIN_TYPES),
    stainName: zod_1.z.string().trim().min(1).max(160),
    equipment: zod_1.z.string().trim().max(120).optional(),
    lots: zod_1.z
        .array(zod_1.z.object({
        lotId: common_1.objectIdSchema,
        quantityUsed: zod_1.z.coerce.number().min(0).max(1_000_000),
    }))
        .min(1, 'Select at least one reagent lot.'),
    notes: zod_1.z.string().trim().max(2_000).optional(),
})
    .refine((value) => Boolean(value.slideId || value.blockId), {
    message: 'A stain run must reference a slide or a block.',
    path: ['slideId'],
});
exports.completeStainRunSchema = zod_1.z.object({
    qcResult: zod_1.z.enum(constants_1.STAIN_QC_RESULTS),
    notes: zod_1.z.string().trim().max(2_000).optional(),
});
exports.stainRunQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(30),
    caseId: common_1.objectIdSchema.optional(),
    status: zod_1.z.enum(constants_1.STAIN_RUN_STATUSES).optional(),
});
void constants_1.STAIN_TYPES;
//# sourceMappingURL=inventory.js.map