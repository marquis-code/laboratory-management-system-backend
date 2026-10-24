import { z } from 'zod';
export declare const organismSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
    gram: z.ZodEnum<["POSITIVE", "NEGATIVE", "YEAST", "OTHER"]>;
    whonetCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    gram: "OTHER" | "POSITIVE" | "NEGATIVE" | "YEAST";
    active?: boolean | undefined;
    whonetCode?: string | null | undefined;
}, {
    code: string;
    name: string;
    gram: "OTHER" | "POSITIVE" | "NEGATIVE" | "YEAST";
    active?: boolean | undefined;
    whonetCode?: string | null | undefined;
}>;
export declare const antibioticSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
    className: z.ZodString;
    whonetCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    className: string;
    active?: boolean | undefined;
    whonetCode?: string | null | undefined;
}, {
    code: string;
    name: string;
    className: string;
    active?: boolean | undefined;
    whonetCode?: string | null | undefined;
}>;
export declare const breakpointSchema: z.ZodObject<{
    standard: z.ZodEnum<["CLSI", "EUCAST"]>;
    version: z.ZodString;
    organismCode: z.ZodString;
    antibioticCode: z.ZodString;
    method: z.ZodEnum<["MIC", "DISK"]>;
    susceptibleThreshold: z.ZodNumber;
    resistantThreshold: z.ZodNumber;
    unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    firstLine: z.ZodOptional<z.ZodBoolean>;
    active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    method: "MIC" | "DISK";
    standard: "CLSI" | "EUCAST";
    version: string;
    organismCode: string;
    antibioticCode: string;
    susceptibleThreshold: number;
    resistantThreshold: number;
    unit?: string | null | undefined;
    active?: boolean | undefined;
    firstLine?: boolean | undefined;
}, {
    method: "MIC" | "DISK";
    standard: "CLSI" | "EUCAST";
    version: string;
    organismCode: string;
    antibioticCode: string;
    susceptibleThreshold: number;
    resistantThreshold: number;
    unit?: string | null | undefined;
    active?: boolean | undefined;
    firstLine?: boolean | undefined;
}>;
export declare const cultureSchema: z.ZodObject<{
    testRequestId: z.ZodString;
    specimenType: z.ZodString;
    plateType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    media: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    incubation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    specimenType: string;
    testRequestId: string;
    notes?: string | null | undefined;
    plateType?: string | null | undefined;
    media?: string | null | undefined;
    incubation?: string | null | undefined;
}, {
    specimenType: string;
    testRequestId: string;
    notes?: string | null | undefined;
    plateType?: string | null | undefined;
    media?: string | null | undefined;
    incubation?: string | null | undefined;
}>;
export declare const cultureUpdateSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["PLATED", "INCUBATING", "READ", "ID_DONE", "AST_DONE", "REPORTED", "REJECTED"]>>;
    plateType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    media: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    incubation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    organismCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    colonyCount: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    resistanceFlags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    status?: "REPORTED" | "REJECTED" | "PLATED" | "INCUBATING" | "READ" | "ID_DONE" | "AST_DONE" | undefined;
    notes?: string | null | undefined;
    organismCode?: string | null | undefined;
    plateType?: string | null | undefined;
    media?: string | null | undefined;
    incubation?: string | null | undefined;
    colonyCount?: string | null | undefined;
    resistanceFlags?: string[] | undefined;
}, {
    status?: "REPORTED" | "REJECTED" | "PLATED" | "INCUBATING" | "READ" | "ID_DONE" | "AST_DONE" | undefined;
    notes?: string | null | undefined;
    organismCode?: string | null | undefined;
    plateType?: string | null | undefined;
    media?: string | null | undefined;
    incubation?: string | null | undefined;
    colonyCount?: string | null | undefined;
    resistanceFlags?: string[] | undefined;
}>;
export declare const susceptibilitySchema: z.ZodObject<{
    isolateId: z.ZodString;
    antibioticCode: z.ZodString;
    method: z.ZodEnum<["MIC", "DISK"]>;
    value: z.ZodNumber;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    value: number;
    method: "MIC" | "DISK";
    antibioticCode: string;
    isolateId: string;
    notes?: string | null | undefined;
}, {
    value: number;
    method: "MIC" | "DISK";
    antibioticCode: string;
    isolateId: string;
    notes?: string | null | undefined;
}>;
//# sourceMappingURL=microbiology.d.ts.map