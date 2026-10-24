import { z } from 'zod';
export declare const referringClinicianSchema: z.ZodObject<{
    name: z.ZodString;
    facility: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
    phone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
    email: z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>, string | undefined, string | undefined>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email?: string | undefined;
    phone?: string | undefined;
    facility?: string | undefined;
}, {
    name: string;
    email?: string | undefined;
    phone?: string | undefined;
    facility?: string | undefined;
}>;
export type ReferringClinicianInput = z.infer<typeof referringClinicianSchema>;
export declare const specimenInputSchema: z.ZodObject<{
    specimenType: z.ZodString;
    site: z.ZodString;
    laterality: z.ZodOptional<z.ZodEnum<["LEFT", "RIGHT", "BILATERAL", "NOT_APPLICABLE"]>>;
    description: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
    collectedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    specimenType: string;
    site: string;
    description?: string | undefined;
    laterality?: "LEFT" | "RIGHT" | "BILATERAL" | "NOT_APPLICABLE" | undefined;
    collectedAt?: string | undefined;
}, {
    specimenType: string;
    site: string;
    description?: string | undefined;
    laterality?: "LEFT" | "RIGHT" | "BILATERAL" | "NOT_APPLICABLE" | undefined;
    collectedAt?: string | undefined;
}>;
export type SpecimenInput = z.infer<typeof specimenInputSchema>;
export declare const accessionSchema: z.ZodObject<{
    patient: z.ZodObject<{
        mrn: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
        firstName: z.ZodString;
        lastName: z.ZodString;
        sex: z.ZodEnum<["FEMALE", "MALE", "OTHER", "UNKNOWN"]>;
        dateOfBirth: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
        age: z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, unknown>;
        phone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
        email: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
        address: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
        nationalId: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
        nextOfKin: z.ZodOptional<z.ZodObject<{
            name: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
            phone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
            relationship: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
        }, "strip", z.ZodTypeAny, {
            name?: string | undefined;
            phone?: string | undefined;
            relationship?: string | undefined;
        }, {
            name?: unknown;
            phone?: unknown;
            relationship?: unknown;
        }>>;
    }, "strip", z.ZodTypeAny, {
        firstName: string;
        lastName: string;
        sex: "FEMALE" | "MALE" | "OTHER" | "UNKNOWN";
        email?: string | undefined;
        phone?: string | undefined;
        mrn?: string | undefined;
        dateOfBirth?: string | undefined;
        age?: number | undefined;
        address?: string | undefined;
        nationalId?: string | undefined;
        nextOfKin?: {
            name?: string | undefined;
            phone?: string | undefined;
            relationship?: string | undefined;
        } | undefined;
    }, {
        firstName: string;
        lastName: string;
        sex: "FEMALE" | "MALE" | "OTHER" | "UNKNOWN";
        email?: unknown;
        phone?: unknown;
        mrn?: unknown;
        dateOfBirth?: unknown;
        age?: unknown;
        address?: unknown;
        nationalId?: unknown;
        nextOfKin?: {
            name?: unknown;
            phone?: unknown;
            relationship?: unknown;
        } | undefined;
    }>;
    referringClinician: z.ZodObject<{
        name: z.ZodString;
        facility: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
        phone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
        email: z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>, string | undefined, string | undefined>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        email?: string | undefined;
        phone?: string | undefined;
        facility?: string | undefined;
    }, {
        name: string;
        email?: string | undefined;
        phone?: string | undefined;
        facility?: string | undefined;
    }>;
    clinicalHistory: z.ZodString;
    clinicalDiagnosis: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
    priority: z.ZodEnum<["ROUTINE", "URGENT", "FROZEN"]>;
    discipline: z.ZodDefault<z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>>;
    testCode: z.ZodOptional<z.ZodString>;
    testName: z.ZodOptional<z.ZodString>;
    subspecialty: z.ZodOptional<z.ZodString>;
    assignedPathologistId: z.ZodOptional<z.ZodString>;
    specimens: z.ZodArray<z.ZodObject<{
        specimenType: z.ZodString;
        site: z.ZodString;
        laterality: z.ZodOptional<z.ZodEnum<["LEFT", "RIGHT", "BILATERAL", "NOT_APPLICABLE"]>>;
        description: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
        collectedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        specimenType: string;
        site: string;
        description?: string | undefined;
        laterality?: "LEFT" | "RIGHT" | "BILATERAL" | "NOT_APPLICABLE" | undefined;
        collectedAt?: string | undefined;
    }, {
        specimenType: string;
        site: string;
        description?: string | undefined;
        laterality?: "LEFT" | "RIGHT" | "BILATERAL" | "NOT_APPLICABLE" | undefined;
        collectedAt?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    patient: {
        firstName: string;
        lastName: string;
        sex: "FEMALE" | "MALE" | "OTHER" | "UNKNOWN";
        email?: string | undefined;
        phone?: string | undefined;
        mrn?: string | undefined;
        dateOfBirth?: string | undefined;
        age?: number | undefined;
        address?: string | undefined;
        nationalId?: string | undefined;
        nextOfKin?: {
            name?: string | undefined;
            phone?: string | undefined;
            relationship?: string | undefined;
        } | undefined;
    };
    referringClinician: {
        name: string;
        email?: string | undefined;
        phone?: string | undefined;
        facility?: string | undefined;
    };
    clinicalHistory: string;
    priority: "ROUTINE" | "URGENT" | "FROZEN";
    discipline: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY";
    specimens: {
        specimenType: string;
        site: string;
        description?: string | undefined;
        laterality?: "LEFT" | "RIGHT" | "BILATERAL" | "NOT_APPLICABLE" | undefined;
        collectedAt?: string | undefined;
    }[];
    subspecialty?: string | undefined;
    clinicalDiagnosis?: string | undefined;
    testCode?: string | undefined;
    testName?: string | undefined;
    assignedPathologistId?: string | undefined;
}, {
    patient: {
        firstName: string;
        lastName: string;
        sex: "FEMALE" | "MALE" | "OTHER" | "UNKNOWN";
        email?: unknown;
        phone?: unknown;
        mrn?: unknown;
        dateOfBirth?: unknown;
        age?: unknown;
        address?: unknown;
        nationalId?: unknown;
        nextOfKin?: {
            name?: unknown;
            phone?: unknown;
            relationship?: unknown;
        } | undefined;
    };
    referringClinician: {
        name: string;
        email?: string | undefined;
        phone?: string | undefined;
        facility?: string | undefined;
    };
    clinicalHistory: string;
    priority: "ROUTINE" | "URGENT" | "FROZEN";
    specimens: {
        specimenType: string;
        site: string;
        description?: string | undefined;
        laterality?: "LEFT" | "RIGHT" | "BILATERAL" | "NOT_APPLICABLE" | undefined;
        collectedAt?: string | undefined;
    }[];
    subspecialty?: string | undefined;
    clinicalDiagnosis?: string | undefined;
    discipline?: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY" | undefined;
    testCode?: string | undefined;
    testName?: string | undefined;
    assignedPathologistId?: string | undefined;
}>;
export type AccessionInput = z.infer<typeof accessionSchema>;
export declare const updateCaseSchema: z.ZodObject<{
    clinicalHistory: z.ZodOptional<z.ZodString>;
    clinicalDiagnosis: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    priority: z.ZodOptional<z.ZodEnum<["ROUTINE", "URGENT", "FROZEN"]>>;
    subspecialty: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    subspecialty?: string | null | undefined;
    clinicalHistory?: string | undefined;
    clinicalDiagnosis?: string | null | undefined;
    priority?: "ROUTINE" | "URGENT" | "FROZEN" | undefined;
}, {
    subspecialty?: string | null | undefined;
    clinicalHistory?: string | undefined;
    clinicalDiagnosis?: string | null | undefined;
    priority?: "ROUTINE" | "URGENT" | "FROZEN" | undefined;
}>;
export type UpdateCaseInput = z.infer<typeof updateCaseSchema>;
export declare const assignCaseSchema: z.ZodObject<{
    pathologistId: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    pathologistId: string | null;
}, {
    pathologistId: string | null;
}>;
export type AssignCaseInput = z.infer<typeof assignCaseSchema>;
export declare const caseListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    q: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["RECEIVED", "IN_PROGRESS", "PENDING_REVIEW", "REPORTED", "AMENDED"]>>;
    priority: z.ZodOptional<z.ZodEnum<["ROUTINE", "URGENT", "FROZEN"]>>;
    pathologistId: z.ZodOptional<z.ZodString>;
    discipline: z.ZodOptional<z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>>;
    subspecialty: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "RECEIVED" | "IN_PROGRESS" | "PENDING_REVIEW" | "REPORTED" | "AMENDED" | undefined;
    subspecialty?: string | undefined;
    q?: string | undefined;
    priority?: "ROUTINE" | "URGENT" | "FROZEN" | undefined;
    discipline?: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY" | undefined;
    pathologistId?: string | undefined;
    from?: string | undefined;
    to?: string | undefined;
}, {
    status?: "RECEIVED" | "IN_PROGRESS" | "PENDING_REVIEW" | "REPORTED" | "AMENDED" | undefined;
    subspecialty?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    q?: string | undefined;
    priority?: "ROUTINE" | "URGENT" | "FROZEN" | undefined;
    discipline?: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY" | undefined;
    pathologistId?: string | undefined;
    from?: string | undefined;
    to?: string | undefined;
}>;
export type CaseListQuery = z.infer<typeof caseListQuerySchema>;
export declare const grossBlockSchema: z.ZodObject<{
    specimenId: z.ZodString;
    grossDescription: z.ZodString;
    blockCount: z.ZodNumber;
    blockDescriptions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    specimenId: string;
    grossDescription: string;
    blockCount: number;
    blockDescriptions?: string[] | undefined;
}, {
    specimenId: string;
    grossDescription: string;
    blockCount: number;
    blockDescriptions?: string[] | undefined;
}>;
export type GrossBlockInput = z.infer<typeof grossBlockSchema>;
export declare const cutSlidesSchema: z.ZodEffects<z.ZodObject<{
    blockId: z.ZodString;
    count: z.ZodNumber;
    stainType: z.ZodDefault<z.ZodEnum<["H_AND_E", "SPECIAL", "IMMUNOHISTOCHEMISTRY"]>>;
    specialStain: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    blockId: string;
    count: number;
    stainType: "H_AND_E" | "SPECIAL" | "IMMUNOHISTOCHEMISTRY";
    specialStain?: string | undefined;
    notes?: string | undefined;
}, {
    blockId: string;
    count: number;
    stainType?: "H_AND_E" | "SPECIAL" | "IMMUNOHISTOCHEMISTRY" | undefined;
    specialStain?: string | undefined;
    notes?: string | undefined;
}>, {
    blockId: string;
    count: number;
    stainType: "H_AND_E" | "SPECIAL" | "IMMUNOHISTOCHEMISTRY";
    specialStain?: string | undefined;
    notes?: string | undefined;
}, {
    blockId: string;
    count: number;
    stainType?: "H_AND_E" | "SPECIAL" | "IMMUNOHISTOCHEMISTRY" | undefined;
    specialStain?: string | undefined;
    notes?: string | undefined;
}>;
export type CutSlidesInput = z.infer<typeof cutSlidesSchema>;
export declare const stainRequestSchema: z.ZodObject<{
    blockId: z.ZodString;
    stainType: z.ZodEnum<["SPECIAL", "IMMUNOHISTOCHEMISTRY"]>;
    specialStain: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    blockId: string;
    stainType: "SPECIAL" | "IMMUNOHISTOCHEMISTRY";
    specialStain: string;
    reason: string;
}, {
    blockId: string;
    stainType: "SPECIAL" | "IMMUNOHISTOCHEMISTRY";
    specialStain: string;
    reason: string;
}>;
export type StainRequestInput = z.infer<typeof stainRequestSchema>;
export declare const rejectSpecimenSchema: z.ZodObject<{
    reasonCode: z.ZodDefault<z.ZodEnum<["MISLABELLED", "WRONG_CONTAINER", "FIXATION_DELAY", "INSUFFICIENT_TISSUE", "CONTAMINATION", "BROKEN_SLIDE", "LOST_IN_PROCESSING", "UNREPRESENTATIVE", "OTHER"]>>;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    reasonCode: "OTHER" | "MISLABELLED" | "WRONG_CONTAINER" | "FIXATION_DELAY" | "INSUFFICIENT_TISSUE" | "CONTAMINATION" | "BROKEN_SLIDE" | "LOST_IN_PROCESSING" | "UNREPRESENTATIVE";
}, {
    reason: string;
    reasonCode?: "OTHER" | "MISLABELLED" | "WRONG_CONTAINER" | "FIXATION_DELAY" | "INSUFFICIENT_TISSUE" | "CONTAMINATION" | "BROKEN_SLIDE" | "LOST_IN_PROCESSING" | "UNREPRESENTATIVE" | undefined;
}>;
export type RejectSpecimenInput = z.infer<typeof rejectSpecimenSchema>;
//# sourceMappingURL=case.d.ts.map