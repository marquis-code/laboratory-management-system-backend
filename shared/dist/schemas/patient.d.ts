import { z } from 'zod';
export declare const nextOfKinSchema: z.ZodObject<{
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
}>;
export type NextOfKinInput = z.infer<typeof nextOfKinSchema>;
export declare const patientInputSchema: z.ZodObject<{
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
export type PatientInput = z.infer<typeof patientInputSchema>;
export declare const patientListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    q: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    q?: string | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    q?: string | undefined;
}>;
export type PatientListQuery = z.infer<typeof patientListQuerySchema>;
//# sourceMappingURL=patient.d.ts.map