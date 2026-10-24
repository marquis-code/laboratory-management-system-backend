"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hl7OrderSchema = exports.hl7MessageSchema = exports.reportCodingSchema = exports.terminologyValidateSchema = exports.terminologyQuerySchema = exports.wsiWebhookSchema = exports.wsiLinkSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
const common_1 = require("./common");
exports.wsiLinkSchema = zod_1.z.object({
    url: zod_1.z.string().url().max(2_000),
    viewerUrl: zod_1.z.string().url().max(2_000).optional(),
    scanner: zod_1.z.string().trim().max(120).optional(),
    magnification: zod_1.z.string().trim().max(40).optional(),
    notes: zod_1.z.string().trim().max(1_000).optional(),
});
exports.wsiWebhookSchema = zod_1.z.object({
    labCode: zod_1.z.string().trim().min(2).max(32).optional(),
    barcode: zod_1.z.string().trim().min(3).max(128),
    url: zod_1.z.string().url().max(2_000),
    status: zod_1.z.enum(['LINKED', 'PROCESSING', 'FAILED']).default('LINKED'),
    scanner: zod_1.z.string().trim().max(120).optional(),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
});
exports.terminologyQuerySchema = zod_1.z.object({
    system: zod_1.z.enum(constants_1.CODING_SYSTEMS).optional(),
    q: zod_1.z.string().trim().max(120).optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(50).default(20),
});
exports.terminologyValidateSchema = zod_1.z.object({
    system: zod_1.z.enum(constants_1.CODING_SYSTEMS),
    code: zod_1.z.string().trim().min(1).max(40),
});
exports.reportCodingSchema = zod_1.z.object({
    snomedCode: zod_1.z.string().trim().max(40).nullable().optional(),
    snomedDisplay: zod_1.z.string().trim().max(240).nullable().optional(),
    icdo3MorphologyCode: zod_1.z.string().trim().max(40).nullable().optional(),
    icdo3MorphologyDisplay: zod_1.z.string().trim().max(240).nullable().optional(),
    icdo3TopographyCode: zod_1.z.string().trim().max(40).nullable().optional(),
    icdo3TopographyDisplay: zod_1.z.string().trim().max(240).nullable().optional(),
});
exports.hl7MessageSchema = zod_1.z.object({
    message: zod_1.z.string().min(10).max(500_000),
});
exports.hl7OrderSchema = zod_1.z.object({
    patient: common_1.objectIdSchema.optional(),
    labCode: zod_1.z.string().trim().max(32).optional(),
});
//# sourceMappingURL=interop.js.map