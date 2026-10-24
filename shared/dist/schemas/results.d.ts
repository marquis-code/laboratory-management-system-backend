import { z } from 'zod';
export declare const resultValueInputSchema: z.ZodObject<{
    analyteKey: z.ZodString;
    value: z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodNull]>;
}, "strip", z.ZodTypeAny, {
    value: string | number | null;
    analyteKey: string;
}, {
    value: string | number | null;
    analyteKey: string;
}>;
export declare const createResultSchema: z.ZodObject<{
    testRequestId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    testRequestId: string;
}, {
    testRequestId: string;
}>;
export declare const updateResultSchema: z.ZodObject<{
    values: z.ZodArray<z.ZodObject<{
        analyteKey: z.ZodString;
        value: z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodNull]>;
    }, "strip", z.ZodTypeAny, {
        value: string | number | null;
        analyteKey: string;
    }, {
        value: string | number | null;
        analyteKey: string;
    }>, "many">;
    comment: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    values: {
        value: string | number | null;
        analyteKey: string;
    }[];
    comment?: string | null | undefined;
}, {
    values: {
        value: string | number | null;
        analyteKey: string;
    }[];
    comment?: string | null | undefined;
}>;
export declare const acknowledgeCriticalSchema: z.ZodObject<{
    note: z.ZodString;
}, "strip", z.ZodTypeAny, {
    note: string;
}, {
    note: string;
}>;
export declare const resultListQuerySchema: z.ZodObject<{
    discipline: z.ZodOptional<z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "RESULTED", "VERIFIED", "RELEASED", "CANCELLED"]>>;
    caseId: z.ZodOptional<z.ZodString>;
    patientId: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "DRAFT" | "RELEASED" | "CANCELLED" | "RESULTED" | "VERIFIED" | undefined;
    discipline?: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY" | undefined;
    caseId?: string | undefined;
    patientId?: string | undefined;
}, {
    status?: "DRAFT" | "RELEASED" | "CANCELLED" | "RESULTED" | "VERIFIED" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    discipline?: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY" | undefined;
    caseId?: string | undefined;
    patientId?: string | undefined;
}>;
//# sourceMappingURL=results.d.ts.map