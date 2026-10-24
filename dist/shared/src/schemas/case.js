"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectSpecimenSchema = exports.stainRequestSchema = exports.cutSlidesSchema = exports.grossBlockSchema = exports.caseListQuerySchema = exports.assignCaseSchema = exports.updateCaseSchema = exports.accessionSchema = exports.specimenInputSchema = exports.referringClinicianSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
const patient_1 = require("./patient");
const common_1 = require("./common");
exports.referringClinicianSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Referring clinician is required.').max(160),
    facility: zod_1.z
        .string()
        .trim()
        .max(200)
        .optional()
        .transform((value) => value || undefined),
    phone: zod_1.z
        .string()
        .trim()
        .max(40)
        .optional()
        .transform((value) => value || undefined),
    email: zod_1.z
        .string()
        .trim()
        .max(160)
        .optional()
        .transform((value) => value || undefined)
        .refine((value) => !value || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value), 'Enter a valid email address.'),
});
exports.specimenInputSchema = zod_1.z.object({
    specimenType: zod_1.z.string().trim().min(2, 'Specimen type is required.').max(120),
    site: zod_1.z.string().trim().min(1, 'Anatomical site is required.').max(200),
    laterality: zod_1.z.enum(constants_1.LATERALITIES).optional(),
    description: zod_1.z
        .string()
        .trim()
        .max(2_000)
        .optional()
        .transform((value) => value || undefined),
    collectedAt: zod_1.z.string().datetime({ offset: true }).optional(),
});
exports.accessionSchema = zod_1.z.object({
    patient: patient_1.patientInputSchema,
    referringClinician: exports.referringClinicianSchema,
    clinicalHistory: zod_1.z
        .string()
        .trim()
        .min(5, 'Record the clinical history (at least 5 characters).')
        .max(5_000),
    clinicalDiagnosis: zod_1.z
        .string()
        .trim()
        .max(2_000)
        .optional()
        .transform((value) => value || undefined),
    priority: zod_1.z.enum(constants_1.PRIORITIES),
    discipline: zod_1.z
        .enum(['HISTOPATHOLOGY', 'HAEMATOLOGY', 'CHEMICAL_PATHOLOGY', 'MICROBIOLOGY'])
        .default('HISTOPATHOLOGY'),
    testCode: zod_1.z.string().trim().max(80).optional(),
    testName: zod_1.z.string().trim().max(160).optional(),
    subspecialty: zod_1.z.string().trim().max(80).optional(),
    assignedPathologistId: common_1.objectIdSchema.optional(),
    specimens: zod_1.z
        .array(exports.specimenInputSchema)
        .min(1, 'Add at least one specimen.')
        .max(20, 'A single accession can contain at most 20 specimens.'),
});
exports.updateCaseSchema = zod_1.z.object({
    clinicalHistory: zod_1.z.string().trim().min(5).max(5_000).optional(),
    clinicalDiagnosis: zod_1.z.string().trim().max(2_000).nullable().optional(),
    priority: zod_1.z.enum(constants_1.PRIORITIES).optional(),
    subspecialty: zod_1.z.string().trim().max(80).nullable().optional(),
});
exports.assignCaseSchema = zod_1.z.object({
    pathologistId: common_1.objectIdSchema.nullable(),
});
exports.caseListQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    q: zod_1.z.string().trim().max(120).optional(),
    status: zod_1.z.enum(constants_1.CASE_STATUSES).optional(),
    priority: zod_1.z.enum(constants_1.PRIORITIES).optional(),
    pathologistId: common_1.objectIdSchema.optional(),
    discipline: zod_1.z
        .enum(['HISTOPATHOLOGY', 'HAEMATOLOGY', 'CHEMICAL_PATHOLOGY', 'MICROBIOLOGY'])
        .optional(),
    subspecialty: zod_1.z.string().trim().max(80).optional(),
    from: zod_1.z.string().trim().max(40).optional(),
    to: zod_1.z.string().trim().max(40).optional(),
});
exports.grossBlockSchema = zod_1.z.object({
    specimenId: common_1.objectIdSchema,
    grossDescription: zod_1.z.string().trim().min(5, 'Describe the gross specimen.').max(10_000),
    blockCount: zod_1.z.coerce.number().int().min(1).max(constants_1.MAX_BLOCK_COUNT),
    blockDescriptions: zod_1.z.array(zod_1.z.string().trim().max(2_000)).max(constants_1.MAX_BLOCK_COUNT).optional(),
});
exports.cutSlidesSchema = zod_1.z
    .object({
    blockId: common_1.objectIdSchema,
    count: zod_1.z.coerce.number().int().min(1).max(constants_1.MAX_SLIDE_COUNT),
    stainType: zod_1.z.enum(constants_1.STAIN_TYPES).default('H_AND_E'),
    specialStain: zod_1.z.string().trim().max(160).optional(),
    notes: zod_1.z.string().trim().max(2_000).optional(),
})
    .refine((value) => value.stainType === 'H_AND_E' || Boolean(value.specialStain), {
    path: ['specialStain'],
    message: 'Name the special stain or antibody.',
});
exports.stainRequestSchema = zod_1.z.object({
    blockId: common_1.objectIdSchema,
    stainType: zod_1.z.enum(['SPECIAL', 'IMMUNOHISTOCHEMISTRY']),
    specialStain: zod_1.z.string().trim().min(1, 'Name the stain or antibody.').max(160),
    reason: zod_1.z.string().trim().min(5, 'Record why the extra stain is needed.').max(1_000),
});
exports.rejectSpecimenSchema = zod_1.z.object({
    reasonCode: zod_1.z
        .enum([
        'MISLABELLED',
        'WRONG_CONTAINER',
        'FIXATION_DELAY',
        'INSUFFICIENT_TISSUE',
        'CONTAMINATION',
        'BROKEN_SLIDE',
        'LOST_IN_PROCESSING',
        'UNREPRESENTATIVE',
        'OTHER',
    ])
        .default('OTHER'),
    reason: zod_1.z.string().trim().min(5, 'Record a rejection reason.').max(1_000),
});
//# sourceMappingURL=case.js.map