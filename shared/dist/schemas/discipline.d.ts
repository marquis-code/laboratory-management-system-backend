import { z } from 'zod';
export declare const disciplineSchema: z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>;
export declare const testRequestSchema: z.ZodObject<{
    discipline: z.ZodDefault<z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>>;
    code: z.ZodDefault<z.ZodString>;
    name: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    discipline: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY";
}, {
    code?: string | undefined;
    name?: string | undefined;
    discipline?: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY" | undefined;
}>;
export type TestRequestInput = z.infer<typeof testRequestSchema>;
export declare const testRequestQuerySchema: z.ZodObject<{
    caseId: z.ZodOptional<z.ZodString>;
    discipline: z.ZodOptional<z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>>;
    status: z.ZodOptional<z.ZodEnum<["RECEIVED", "COLLECTED", "IN_PROGRESS", "PENDING_REVIEW", "RESULTED", "VERIFIED", "RELEASED", "CANCELLED"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "RECEIVED" | "IN_PROGRESS" | "PENDING_REVIEW" | "RELEASED" | "CANCELLED" | "COLLECTED" | "RESULTED" | "VERIFIED" | undefined;
    discipline?: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY" | undefined;
    caseId?: string | undefined;
}, {
    status?: "RECEIVED" | "IN_PROGRESS" | "PENDING_REVIEW" | "RELEASED" | "CANCELLED" | "COLLECTED" | "RESULTED" | "VERIFIED" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    discipline?: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY" | undefined;
    caseId?: string | undefined;
}>;
export type TestRequestQuery = z.infer<typeof testRequestQuerySchema>;
//# sourceMappingURL=discipline.d.ts.map