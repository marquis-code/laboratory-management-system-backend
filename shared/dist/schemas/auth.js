"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    labCode: zod_1.z
        .string()
        .trim()
        .min(2, 'Enter your laboratory code.')
        .max(32)
        .transform((value) => value.toUpperCase()),
    email: zod_1.z
        .string()
        .trim()
        .min(1, 'Enter your email address.')
        .email('Enter a valid email address.')
        .transform((value) => value.toLowerCase()),
    password: zod_1.z.string().min(1, 'Enter your password.').max(200),
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(20),
});
//# sourceMappingURL=auth.js.map