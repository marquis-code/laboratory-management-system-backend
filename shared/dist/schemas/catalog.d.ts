import { z } from 'zod';
export declare const referenceRangeSchema: z.ZodObject<{
    low: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    high: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    sex: z.ZodOptional<z.ZodNullable<z.ZodEnum<["FEMALE", "MALE", "OTHER", "UNKNOWN"]>>>;
    minAge: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    maxAge: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    sex?: "FEMALE" | "MALE" | "OTHER" | "UNKNOWN" | null | undefined;
    low?: number | null | undefined;
    high?: number | null | undefined;
    minAge?: number | null | undefined;
    maxAge?: number | null | undefined;
}, {
    sex?: "FEMALE" | "MALE" | "OTHER" | "UNKNOWN" | null | undefined;
    low?: number | null | undefined;
    high?: number | null | undefined;
    minAge?: number | null | undefined;
    maxAge?: number | null | undefined;
}>;
export declare const analyteDefinitionSchema: z.ZodObject<{
    key: z.ZodString;
    name: z.ZodString;
    unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    resultType: z.ZodEnum<["NUMERIC", "CODED", "TEXT", "CALCULATED"]>;
    decimals: z.ZodOptional<z.ZodNumber>;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        value: z.ZodString;
        label: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        label: string;
    }, {
        value: string;
        label: string;
    }>, "many">>;
    referenceRanges: z.ZodDefault<z.ZodArray<z.ZodObject<{
        low: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        high: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        sex: z.ZodOptional<z.ZodNullable<z.ZodEnum<["FEMALE", "MALE", "OTHER", "UNKNOWN"]>>>;
        minAge: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        maxAge: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        sex?: "FEMALE" | "MALE" | "OTHER" | "UNKNOWN" | null | undefined;
        low?: number | null | undefined;
        high?: number | null | undefined;
        minAge?: number | null | undefined;
        maxAge?: number | null | undefined;
    }, {
        sex?: "FEMALE" | "MALE" | "OTHER" | "UNKNOWN" | null | undefined;
        low?: number | null | undefined;
        high?: number | null | undefined;
        minAge?: number | null | undefined;
        maxAge?: number | null | undefined;
    }>, "many">>;
    criticalLow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    criticalHigh: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    formula: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    required: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    key: string;
    name: string;
    resultType: "NUMERIC" | "CODED" | "TEXT" | "CALCULATED";
    referenceRanges: {
        sex?: "FEMALE" | "MALE" | "OTHER" | "UNKNOWN" | null | undefined;
        low?: number | null | undefined;
        high?: number | null | undefined;
        minAge?: number | null | undefined;
        maxAge?: number | null | undefined;
    }[];
    options?: {
        value: string;
        label: string;
    }[] | undefined;
    required?: boolean | undefined;
    unit?: string | null | undefined;
    decimals?: number | undefined;
    criticalLow?: number | null | undefined;
    criticalHigh?: number | null | undefined;
    formula?: string | null | undefined;
}, {
    key: string;
    name: string;
    resultType: "NUMERIC" | "CODED" | "TEXT" | "CALCULATED";
    options?: {
        value: string;
        label: string;
    }[] | undefined;
    required?: boolean | undefined;
    unit?: string | null | undefined;
    decimals?: number | undefined;
    referenceRanges?: {
        sex?: "FEMALE" | "MALE" | "OTHER" | "UNKNOWN" | null | undefined;
        low?: number | null | undefined;
        high?: number | null | undefined;
        minAge?: number | null | undefined;
        maxAge?: number | null | undefined;
    }[] | undefined;
    criticalLow?: number | null | undefined;
    criticalHigh?: number | null | undefined;
    formula?: string | null | undefined;
}>;
export declare const testDefinitionSchema: z.ZodObject<{
    discipline: z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>;
    code: z.ZodString;
    name: z.ZodString;
    specimenType: z.ZodString;
    method: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    analytes: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        name: z.ZodString;
        unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        resultType: z.ZodEnum<["NUMERIC", "CODED", "TEXT", "CALCULATED"]>;
        decimals: z.ZodOptional<z.ZodNumber>;
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
            value: z.ZodString;
            label: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label: string;
        }, {
            value: string;
            label: string;
        }>, "many">>;
        referenceRanges: z.ZodDefault<z.ZodArray<z.ZodObject<{
            low: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            high: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            sex: z.ZodOptional<z.ZodNullable<z.ZodEnum<["FEMALE", "MALE", "OTHER", "UNKNOWN"]>>>;
            minAge: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            maxAge: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            sex?: "FEMALE" | "MALE" | "OTHER" | "UNKNOWN" | null | undefined;
            low?: number | null | undefined;
            high?: number | null | undefined;
            minAge?: number | null | undefined;
            maxAge?: number | null | undefined;
        }, {
            sex?: "FEMALE" | "MALE" | "OTHER" | "UNKNOWN" | null | undefined;
            low?: number | null | undefined;
            high?: number | null | undefined;
            minAge?: number | null | undefined;
            maxAge?: number | null | undefined;
        }>, "many">>;
        criticalLow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        criticalHigh: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        formula: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        required: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        key: string;
        name: string;
        resultType: "NUMERIC" | "CODED" | "TEXT" | "CALCULATED";
        referenceRanges: {
            sex?: "FEMALE" | "MALE" | "OTHER" | "UNKNOWN" | null | undefined;
            low?: number | null | undefined;
            high?: number | null | undefined;
            minAge?: number | null | undefined;
            maxAge?: number | null | undefined;
        }[];
        options?: {
            value: string;
            label: string;
        }[] | undefined;
        required?: boolean | undefined;
        unit?: string | null | undefined;
        decimals?: number | undefined;
        criticalLow?: number | null | undefined;
        criticalHigh?: number | null | undefined;
        formula?: string | null | undefined;
    }, {
        key: string;
        name: string;
        resultType: "NUMERIC" | "CODED" | "TEXT" | "CALCULATED";
        options?: {
            value: string;
            label: string;
        }[] | undefined;
        required?: boolean | undefined;
        unit?: string | null | undefined;
        decimals?: number | undefined;
        referenceRanges?: {
            sex?: "FEMALE" | "MALE" | "OTHER" | "UNKNOWN" | null | undefined;
            low?: number | null | undefined;
            high?: number | null | undefined;
            minAge?: number | null | undefined;
            maxAge?: number | null | undefined;
        }[] | undefined;
        criticalLow?: number | null | undefined;
        criticalHigh?: number | null | undefined;
        formula?: string | null | undefined;
    }>, "many">;
    active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    specimenType: string;
    discipline: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY";
    analytes: {
        key: string;
        name: string;
        resultType: "NUMERIC" | "CODED" | "TEXT" | "CALCULATED";
        referenceRanges: {
            sex?: "FEMALE" | "MALE" | "OTHER" | "UNKNOWN" | null | undefined;
            low?: number | null | undefined;
            high?: number | null | undefined;
            minAge?: number | null | undefined;
            maxAge?: number | null | undefined;
        }[];
        options?: {
            value: string;
            label: string;
        }[] | undefined;
        required?: boolean | undefined;
        unit?: string | null | undefined;
        decimals?: number | undefined;
        criticalLow?: number | null | undefined;
        criticalHigh?: number | null | undefined;
        formula?: string | null | undefined;
    }[];
    active?: boolean | undefined;
    method?: string | null | undefined;
}, {
    code: string;
    name: string;
    specimenType: string;
    discipline: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY";
    analytes: {
        key: string;
        name: string;
        resultType: "NUMERIC" | "CODED" | "TEXT" | "CALCULATED";
        options?: {
            value: string;
            label: string;
        }[] | undefined;
        required?: boolean | undefined;
        unit?: string | null | undefined;
        decimals?: number | undefined;
        referenceRanges?: {
            sex?: "FEMALE" | "MALE" | "OTHER" | "UNKNOWN" | null | undefined;
            low?: number | null | undefined;
            high?: number | null | undefined;
            minAge?: number | null | undefined;
            maxAge?: number | null | undefined;
        }[] | undefined;
        criticalLow?: number | null | undefined;
        criticalHigh?: number | null | undefined;
        formula?: string | null | undefined;
    }[];
    active?: boolean | undefined;
    method?: string | null | undefined;
}>;
export type TestDefinitionInput = z.infer<typeof testDefinitionSchema>;
export declare const testDefinitionQuerySchema: z.ZodObject<{
    discipline: z.ZodOptional<z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>>;
    q: z.ZodOptional<z.ZodString>;
    active: z.ZodOptional<z.ZodBoolean>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    active?: boolean | undefined;
    q?: string | undefined;
    discipline?: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY" | undefined;
}, {
    active?: boolean | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    q?: string | undefined;
    discipline?: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY" | undefined;
}>;
export declare const panelSchema: z.ZodObject<{
    discipline: z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>;
    code: z.ZodString;
    name: z.ZodString;
    testCodes: z.ZodArray<z.ZodString, "many">;
    active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    discipline: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY";
    testCodes: string[];
    active?: boolean | undefined;
}, {
    code: string;
    name: string;
    discipline: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY";
    testCodes: string[];
    active?: boolean | undefined;
}>;
export declare const panelQuerySchema: z.ZodObject<{
    discipline: z.ZodOptional<z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    discipline?: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY" | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    discipline?: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY" | undefined;
}>;
export declare const cumulativeQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    disciplines: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    disciplines?: string | undefined;
    from?: string | undefined;
    to?: string | undefined;
}, {
    disciplines?: string | undefined;
    from?: string | undefined;
    to?: string | undefined;
}>;
export declare const terminologyIdSchema: z.ZodString;
//# sourceMappingURL=catalog.d.ts.map