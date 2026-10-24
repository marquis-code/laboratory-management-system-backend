"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientListQuerySchema = exports.patientInputSchema = exports.nextOfKinSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
const common_1 = require("./common");
const optionalText = (max) => zod_1.z.preprocess((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value), zod_1.z.string().trim().max(max).optional());
exports.nextOfKinSchema = zod_1.z.object({
    name: optionalText(150),
    phone: optionalText(40),
    relationship: optionalText(80),
});
exports.patientInputSchema = zod_1.z.object({
    mrn: optionalText(40),
    firstName: zod_1.z.string().trim().min(1, 'First name is required.').max(100),
    lastName: zod_1.z.string().trim().min(1, 'Surname is required.').max(100),
    sex: zod_1.z.enum(constants_1.SEXES),
    dateOfBirth: zod_1.z.preprocess((value) => (value === '' || value === null ? undefined : value), zod_1.z.string().regex(common_1.DATE_REGEX, 'Use YYYY-MM-DD.').optional()),
    age: zod_1.z.preprocess((value) => (value === '' || value === null || value === undefined ? undefined : Number(value)), zod_1.z.number().int().min(0, 'Age cannot be negative.').max(130).optional()),
    phone: optionalText(40),
    email: zod_1.z.preprocess((value) => (value === '' || value === null ? undefined : value), zod_1.z.string().trim().email('Enter a valid email address.').max(160).optional()),
    address: optionalText(500),
    nationalId: optionalText(60),
    nextOfKin: exports.nextOfKinSchema.optional(),
});
exports.patientListQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    q: zod_1.z.string().trim().max(120).optional(),
});
//# sourceMappingURL=patient.js.map