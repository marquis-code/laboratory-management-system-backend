"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.platformLabQuerySchema = exports.acceptInviteSchema = exports.labOrganizationSchema = exports.organizationUpdateSchema = exports.onboardingAdminSchema = exports.onboardingSchema = exports.labProvisionSchema = exports.administratorSchema = exports.organizationCreateSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
const optionalText = (max) => zod_1.z.string().trim().max(max).nullable().optional();
exports.organizationCreateSchema = zod_1.z.object({
    code: zod_1.z.string().trim().min(2).max(32),
    name: zod_1.z.string().trim().min(2).max(200),
    type: zod_1.z.enum(constants_1.ORGANIZATION_TYPES),
    country: zod_1.z.string().trim().min(2).max(80).default('Nigeria'),
    state: optionalText(80),
    city: optionalText(80),
    address: optionalText(300),
    phone: optionalText(40),
    email: zod_1.z.string().trim().email().max(160).nullable().optional(),
    website: optionalText(160),
    plan: zod_1.z.enum(constants_1.SUBSCRIPTION_PLANS).optional(),
    seats: zod_1.z.number().int().min(1).max(10_000).optional(),
    trialDays: zod_1.z.number().int().min(1).max(365).optional(),
    notes: optionalText(1_000),
});
exports.administratorSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(150),
    email: zod_1.z.string().trim().email().max(160),
    phone: zod_1.z.string().trim().max(40).nullable().optional(),
});
exports.labProvisionSchema = zod_1.z.object({
    code: zod_1.z.string().trim().min(2).max(32),
    name: zod_1.z.string().trim().min(2).max(200),
    address: optionalText(300),
    phone: optionalText(40),
    email: zod_1.z.string().trim().email().max(160).nullable().optional(),
    enabledDisciplines: zod_1.z.array(zod_1.z.enum(constants_1.DISCIPLINES)).min(1),
    accessionPrefix: zod_1.z.string().trim().min(1).max(8).optional(),
    timezone: zod_1.z.string().trim().max(60).optional(),
    currency: zod_1.z.string().trim().length(3).optional(),
    qaSamplingPercent: zod_1.z.number().int().min(0).max(100).optional(),
    administrator: exports.administratorSchema.optional(),
});
exports.onboardingSchema = zod_1.z.object({
    organization: exports.organizationCreateSchema,
    lab: exports.labProvisionSchema,
    administrator: exports.administratorSchema,
});
exports.onboardingAdminSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(150),
    email: zod_1.z.string().trim().email().max(160),
    phone: zod_1.z.string().trim().max(40).nullable().optional(),
});
exports.organizationUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(200).optional(),
    status: zod_1.z.enum(constants_1.ORGANIZATION_STATUSES).optional(),
    plan: zod_1.z.enum(constants_1.SUBSCRIPTION_PLANS).optional(),
    seats: zod_1.z.number().int().min(1).max(10_000).optional(),
    notes: optionalText(1_000),
    email: zod_1.z.string().trim().email().max(160).nullable().optional(),
    phone: optionalText(40),
});
exports.labOrganizationSchema = zod_1.z.object({
    organizationId: zod_1.z.string().trim().nullable(),
});
exports.acceptInviteSchema = zod_1.z.object({
    token: zod_1.z.string().trim().min(20).max(200),
    password: zod_1.z.string().min(8).max(128),
});
exports.platformLabQuerySchema = zod_1.z.object({
    organizationId: zod_1.z.string().optional(),
    status: zod_1.z.enum(['ACTIVE', 'SUSPENDED', 'ONBOARDING']).optional(),
});
//# sourceMappingURL=platform.js.map