"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardQuerySchema = exports.worklistQuerySchema = exports.protocolListQuerySchema = exports.auditListQuerySchema = exports.updateLabSchema = exports.letterheadSchema = exports.userListQuerySchema = exports.resetPasswordSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
const formats_1 = require("../formats");
const common_1 = require("./common");
const optionalTrimmed = (max) => zod_1.z.preprocess((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value), zod_1.z.string().trim().max(max).optional());
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Enter the staff member’s name.').max(150),
    email: zod_1.z
        .string()
        .trim()
        .email('Enter a valid email address.')
        .max(160)
        .transform((value) => value.toLowerCase()),
    password: zod_1.z
        .string()
        .min(8, 'Use at least 8 characters.')
        .max(128)
        .regex(/[A-Za-z]/, 'Include a letter.')
        .regex(/\d/, 'Include a number.'),
    role: zod_1.z.enum(constants_1.ROLES),
    phone: optionalTrimmed(40),
    disciplines: zod_1.z.array(zod_1.z.enum(constants_1.DISCIPLINES)).max(4).optional(),
    subspecialties: zod_1.z.array(zod_1.z.string().trim().max(80)).max(20).default([]),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(150).optional(),
    role: zod_1.z.enum(constants_1.ROLES).optional(),
    phone: optionalTrimmed(40),
    disciplines: zod_1.z.array(zod_1.z.enum(constants_1.DISCIPLINES)).max(4).optional(),
    active: zod_1.z.boolean().optional(),
    subspecialties: zod_1.z.array(zod_1.z.string().trim().max(80)).max(20).optional(),
});
exports.resetPasswordSchema = zod_1.z.object({
    password: zod_1.z
        .string()
        .min(8, 'Use at least 8 characters.')
        .max(128)
        .regex(/[A-Za-z]/, 'Include a letter.')
        .regex(/\d/, 'Include a number.'),
});
exports.userListQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    role: zod_1.z.enum(constants_1.ROLES).optional(),
    phone: optionalTrimmed(40),
    disciplines: zod_1.z.array(zod_1.z.enum(constants_1.DISCIPLINES)).max(4).optional(),
    active: zod_1.z
        .enum(['true', 'false'])
        .optional()
        .transform((value) => (value === undefined ? undefined : value === 'true')),
    q: zod_1.z.string().trim().max(120).optional(),
});
exports.letterheadSchema = zod_1.z.object({
    phone: optionalTrimmed(60),
    email: optionalTrimmed(160),
    website: optionalTrimmed(200),
    pathologistName: optionalTrimmed(160),
    pathologistTitle: optionalTrimmed(160),
    qualifications: optionalTrimmed(200),
    signatureText: optionalTrimmed(300),
    footerNote: optionalTrimmed(500),
});
exports.updateLabSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(200).optional(),
    address: zod_1.z.string().trim().max(500).optional(),
    phone: optionalTrimmed(60),
    email: zod_1.z.preprocess((value) => (value === '' ? undefined : value), zod_1.z.string().trim().email('Enter a valid email address.').max(160).optional()),
    accessionPrefix: zod_1.z
        .string()
        .trim()
        .min(2)
        .max(6)
        .regex(/^[A-Za-z0-9]+$/, 'Use 2–6 letters or digits.')
        .transform((value) => value.toUpperCase())
        .optional(),
    accessionFormat: zod_1.z
        .string()
        .trim()
        .max(48)
        .refine((value) => (0, formats_1.validateAccessionFormat)(value) === null, {
        message: 'Use tokens {PREFIX}, {YYYY}, {YY} and a required {SEQ} or {SEQ:n}.',
    })
        .optional(),
    tatHours: zod_1.z
        .object({
        FROZEN: zod_1.z.coerce.number().min(0.25).max(168),
        URGENT: zod_1.z.coerce.number().min(0.5).max(720),
        ROUTINE: zod_1.z.coerce.number().min(1).max(1_440),
    })
        .optional(),
    tatWarningPercent: zod_1.z.coerce.number().int().min(50).max(95).optional(),
    timezone: zod_1.z.string().trim().max(80).optional(),
    qaSamplingPercent: zod_1.z.coerce.number().int().min(0).max(100).optional(),
    enabledDisciplines: zod_1.z.array(zod_1.z.enum(constants_1.DISCIPLINES)).min(1).max(4).optional(),
    accessionPrefixes: zod_1.z.record(zod_1.z.enum(constants_1.DISCIPLINES), zod_1.z.string().trim().max(8)).optional(),
    currency: zod_1.z.string().trim().length(3).optional(),
    letterhead: exports.letterheadSchema.optional(),
});
exports.auditListQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    action: zod_1.z.enum(constants_1.AUDIT_ACTIONS).optional(),
    entityType: zod_1.z.string().trim().max(60).optional(),
    entityId: zod_1.z.string().trim().max(60).optional(),
    userId: common_1.objectIdSchema.optional(),
    from: zod_1.z.string().trim().max(40).optional(),
    to: zod_1.z.string().trim().max(40).optional(),
});
exports.protocolListQuerySchema = zod_1.z.object({
    subspecialty: zod_1.z.string().trim().max(80).optional(),
    active: zod_1.z
        .enum(['true', 'false'])
        .optional()
        .transform((value) => (value === undefined ? undefined : value === 'true')),
});
exports.worklistQuerySchema = zod_1.z.object({
    status: zod_1.z.enum(['RECEIVED', 'IN_PROGRESS', 'PENDING_REVIEW', 'AMENDED']).optional(),
    priority: zod_1.z.enum(['ROUTINE', 'URGENT', 'FROZEN']).optional(),
    assigned: zod_1.z.enum(['me', 'unassigned', 'all']).default('all'),
    subspecialty: zod_1.z.string().trim().max(80).optional(),
    pathologistId: common_1.objectIdSchema.optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(50),
});
exports.dashboardQuerySchema = zod_1.z.object({
    days: zod_1.z.coerce.number().int().min(1).max(365).default(30),
});
//# sourceMappingURL=admin.js.map