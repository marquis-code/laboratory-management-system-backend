import { z } from 'zod';
export declare const qcMaterialSchema: z.ZodObject<{
    discipline: z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>;
    name: z.ZodString;
    lotNumber: z.ZodString;
    level: z.ZodEnum<["LOW", "NORMAL", "HIGH"]>;
    testCode: z.ZodString;
    analyteKey: z.ZodString;
    targetMean: z.ZodNumber;
    targetSd: z.ZodNumber;
    unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    discipline: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY";
    testCode: string;
    lotNumber: string;
    analyteKey: string;
    level: "NORMAL" | "LOW" | "HIGH";
    targetMean: number;
    targetSd: number;
    unit?: string | null | undefined;
    active?: boolean | undefined;
}, {
    name: string;
    discipline: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY";
    testCode: string;
    lotNumber: string;
    analyteKey: string;
    level: "NORMAL" | "LOW" | "HIGH";
    targetMean: number;
    targetSd: number;
    unit?: string | null | undefined;
    active?: boolean | undefined;
}>;
export declare const qcRunSchema: z.ZodObject<{
    materialId: z.ZodString;
    values: z.ZodArray<z.ZodNumber, "many">;
    comment: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    values: number[];
    materialId: string;
    comment?: string | null | undefined;
}, {
    values: number[];
    materialId: string;
    comment?: string | null | undefined;
}>;
export declare const qcQuerySchema: z.ZodObject<{
    discipline: z.ZodOptional<z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>>;
    materialId: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    discipline?: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY" | undefined;
    materialId?: string | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    discipline?: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY" | undefined;
    materialId?: string | undefined;
}>;
//# sourceMappingURL=qc.d.ts.map