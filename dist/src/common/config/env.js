"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = validateEnv;
exports.parseTtlSeconds = parseTtlSeconds;
const zod_1 = require("zod");
const boolFromEnv = (defaultValue) => zod_1.z
    .enum(['true', 'false'])
    .default(defaultValue)
    .transform((value) => value === 'true');
const envSchema = zod_1.z
    .object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().int().min(1).max(65_535).optional(),
    API_PORT: zod_1.z.coerce.number().int().min(1).max(65_535).default(4000),
    API_PREFIX: zod_1.z.string().min(1).max(40).default('api'),
    CORS_ORIGINS: zod_1.z.string().default('http://localhost:3000'),
    PUBLIC_WEB_URL: zod_1.z.string().url().default('http://localhost:3000'),
    PUBLIC_API_URL: zod_1.z.string().url().default('http://localhost:4000/api'),
    SWAGGER_ENABLED: boolFromEnv('false'),
    LOG_LEVEL: zod_1.z
        .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
        .default('info'),
    MONGODB_URI: zod_1.z
        .string()
        .min(10)
        .default('mongodb://localhost:27017/histo_lims?replicaSet=rs0&directConnection=true'),
    REDIS_URL: zod_1.z.string().min(5).default('redis://localhost:6379'),
    QUEUES_ENABLED: boolFromEnv('true'),
    JWT_ACCESS_SECRET: zod_1.z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters.'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters.'),
    JWT_ACCESS_TTL: zod_1.z
        .string()
        .regex(/^\d+[smhd]$/)
        .default('15m'),
    JWT_REFRESH_TTL: zod_1.z
        .string()
        .regex(/^\d+[smhd]$/)
        .default('7d'),
    STORAGE_DIR: zod_1.z.string().min(1).default('./storage'),
    TRUST_PROXY: zod_1.z.coerce.number().int().min(1).max(10).default(1),
    SEED_RESET: boolFromEnv('false'),
    // Phase 2 — referral portal and notification delivery
    PORTAL_DEBUG: boolFromEnv('false'),
    PORTAL_TOKEN_TTL_MINUTES: zod_1.z.coerce.number().int().min(5).max(120).default(15),
    NOTIFICATIONS_MODE: zod_1.z.enum(['outbox', 'live']).default('outbox'),
    EMAIL_PROVIDER: zod_1.z.enum(['log', 'smtp', 'resend']).default('log'),
    RESEND_API_KEY: zod_1.z.string().optional(),
    SMTP_HOST: zod_1.z.string().min(1).optional(),
    SMTP_PORT: zod_1.z.coerce.number().int().min(1).max(65_535).default(587),
    SMTP_SECURE: boolFromEnv('false'),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
    EMAIL_FROM: zod_1.z.string().email().default('no-reply@histopathology.local'),
    SMS_PROVIDER: zod_1.z.enum(['log', 'termii', 'twilio']).default('log'),
    TERMII_API_KEY: zod_1.z.string().optional(),
    TERMII_SENDER_ID: zod_1.z.string().max(20).default('HISTOLIMS'),
    TWILIO_ACCOUNT_SID: zod_1.z.string().optional(),
    TWILIO_AUTH_TOKEN: zod_1.z.string().optional(),
    TWILIO_FROM_NUMBER: zod_1.z.string().optional(),
    TWILIO_WHATSAPP_FROM: zod_1.z.string().optional(),
    // Cloudinary asset storage
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().optional(),
    CLOUDINARY_API_KEY: zod_1.z.string().optional(),
    CLOUDINARY_API_SECRET: zod_1.z.string().optional(),
    CLOUDINARY_URL: zod_1.z.string().optional(),
    // Phase 3 — interoperability
    FHIR_ENABLED: boolFromEnv('true'),
    HL7_ENABLED: boolFromEnv('false'),
    HL7_MLLP_PORT: zod_1.z.coerce.number().int().min(1).max(65_535).default(2575),
    HL7_LAB_CODE: zod_1.z.string().min(2).max(32).default('HISTO'),
    HL7_ALLOWED_IPS: zod_1.z.string().optional(),
    WSI_WEBHOOK_SECRET: zod_1.z.string().min(16).optional(),
    PAYMENTS_MODE: zod_1.z.enum(['mock', 'live']).default('mock'),
    PAYSTACK_SECRET_KEY: zod_1.z.string().optional(),
    PAYSTACK_PUBLIC_KEY: zod_1.z.string().optional(),
    FLUTTERWAVE_SECRET_KEY: zod_1.z.string().optional(),
    FLUTTERWAVE_WEBHOOK_HASH: zod_1.z.string().optional(),
    DEFAULT_CURRENCY: zod_1.z.string().length(3).default('NGN'),
})
    .superRefine((value, ctx) => {
    if (value.NODE_ENV === 'production') {
        for (const key of ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']) {
            if (value[key].includes('change-me') ||
                value[key].includes('dev-') ||
                value[key].includes('local-')) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    path: [key],
                    message: `${key} must not use the development default in production.`,
                });
            }
        }
    }
    if (value.NODE_ENV === 'production') {
        if (value.PORTAL_DEBUG) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ['PORTAL_DEBUG'],
                message: 'PORTAL_DEBUG must be false in production.',
            });
        }
        if (value.SEED_RESET) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ['SEED_RESET'],
                message: 'SEED_RESET must be false in production.',
            });
        }
        if (!value.CORS_ORIGINS.split(',').every((origin) => origin.trim().startsWith('https://'))) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ['CORS_ORIGINS'],
                message: 'Production CORS_ORIGINS must contain only HTTPS origins.',
            });
        }
        if (!value.PUBLIC_WEB_URL.startsWith('https://') ||
            !value.PUBLIC_API_URL.startsWith('https://')) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ['PUBLIC_WEB_URL'],
                message: 'Production PUBLIC_WEB_URL and PUBLIC_API_URL must use HTTPS.',
            });
        }
    }
    if (value.PAYMENTS_MODE === 'live') {
        if (!value.PAYSTACK_SECRET_KEY && !value.FLUTTERWAVE_SECRET_KEY) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ['PAYMENTS_MODE'],
                message: 'PAYMENTS_MODE=live requires PAYSTACK_SECRET_KEY or FLUTTERWAVE_SECRET_KEY.',
            });
        }
    }
    if (value.NOTIFICATIONS_MODE === 'live' && (value.EMAIL_PROVIDER === 'smtp' || value.EMAIL_PROVIDER === 'resend')) {
        if (value.EMAIL_PROVIDER === 'resend') {
            if (!value.RESEND_API_KEY && !value.SMTP_PASS) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    path: ['RESEND_API_KEY'],
                    message: 'Resend delivery requires RESEND_API_KEY or SMTP_PASS.',
                });
            }
        }
        else if (!value.SMTP_HOST || !value.SMTP_USER || !value.SMTP_PASS) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ['SMTP_HOST'],
                message: 'SMTP delivery requires SMTP_HOST, SMTP_USER and SMTP_PASS.',
            });
        }
    }
});
function validateEnv(raw) {
    const parsed = envSchema.safeParse(raw);
    if (!parsed.success) {
        const details = parsed.error.issues
            .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
            .join('\n  ');
        throw new Error(`Invalid environment configuration:\n  ${details}`);
    }
    return parsed.data;
}
function parseTtlSeconds(ttl, fallbackSeconds) {
    const match = /^(\d+)([smhd])$/.exec(ttl.trim());
    if (!match)
        return fallbackSeconds;
    const value = Number(match[1]);
    const unit = match[2];
    switch (unit) {
        case 's':
            return value;
        case 'm':
            return value * 60;
        case 'h':
            return value * 3_600;
        case 'd':
            return value * 86_400;
        default:
            return fallbackSeconds;
    }
}
//# sourceMappingURL=env.js.map