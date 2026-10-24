"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationQuerySchema = exports.releaseReportSchema = exports.portalVerifySchema = exports.portalRequestSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
exports.portalRequestSchema = zod_1.z.object({
    labCode: zod_1.z
        .string()
        .trim()
        .min(2)
        .max(32)
        .transform((value) => value.toUpperCase()),
    email: zod_1.z
        .string()
        .trim()
        .email()
        .max(160)
        .transform((value) => value.toLowerCase()),
});
exports.portalVerifySchema = zod_1.z
    .object({
    labCode: zod_1.z
        .string()
        .trim()
        .min(2)
        .max(32)
        .transform((value) => value.toUpperCase()),
    email: zod_1.z
        .string()
        .trim()
        .email()
        .max(160)
        .transform((value) => value.toLowerCase()),
    code: zod_1.z
        .string()
        .trim()
        .regex(/^\d{6}$/, 'Enter the six-digit code.')
        .optional(),
    token: zod_1.z.string().trim().min(20).max(200).optional(),
})
    .refine((value) => Boolean(value.code || value.token), {
    message: 'Enter the one-time code or use the magic link.',
    path: ['code'],
});
exports.releaseReportSchema = zod_1.z.object({
    note: zod_1.z.string().trim().max(500).optional(),
});
exports.notificationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(30),
    channel: zod_1.z.enum(constants_1.NOTIFICATION_CHANNELS).optional(),
    status: zod_1.z.enum(['QUEUED', 'SENDING', 'SENT', 'FAILED', 'SKIPPED']).optional(),
    unreadOnly: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.enum(['true', 'false'])])
        .optional()
        .transform((value) => value === true || value === 'true'),
});
//# sourceMappingURL=portal.js.map