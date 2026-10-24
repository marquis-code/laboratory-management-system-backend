import { z } from 'zod';
export declare const ruleSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    discipline: z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>;
    testCodes: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    trigger: z.ZodEnum<["RESULT_SAVE", "RESULT_VERIFY", "RESULT_RELEASE"]>;
    priority: z.ZodDefault<z.ZodNumber>;
    active: z.ZodOptional<z.ZodBoolean>;
    conditions: z.ZodType<unknown, z.ZodTypeDef, unknown>;
    actions: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["AUTO_VERIFY", "CRITICAL_ALERT", "REFLEX_TEST", "DELTA_CHECK", "CASCADE_ANTIBIOTIC", "REQUIRE_REVIEW"]>;
        testCode: z.ZodOptional<z.ZodString>;
        message: z.ZodOptional<z.ZodString>;
        severity: z.ZodOptional<z.ZodEnum<["INFO", "WARNING", "CRITICAL"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "AUTO_VERIFY" | "CRITICAL_ALERT" | "REFLEX_TEST" | "DELTA_CHECK" | "CASCADE_ANTIBIOTIC" | "REQUIRE_REVIEW";
        message?: string | undefined;
        testCode?: string | undefined;
        severity?: "CRITICAL" | "WARNING" | "INFO" | undefined;
    }, {
        type: "AUTO_VERIFY" | "CRITICAL_ALERT" | "REFLEX_TEST" | "DELTA_CHECK" | "CASCADE_ANTIBIOTIC" | "REQUIRE_REVIEW";
        message?: string | undefined;
        testCode?: string | undefined;
        severity?: "CRITICAL" | "WARNING" | "INFO" | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    priority: number;
    discipline: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY";
    testCodes: string[];
    trigger: "RESULT_SAVE" | "RESULT_VERIFY" | "RESULT_RELEASE";
    actions: {
        type: "AUTO_VERIFY" | "CRITICAL_ALERT" | "REFLEX_TEST" | "DELTA_CHECK" | "CASCADE_ANTIBIOTIC" | "REQUIRE_REVIEW";
        message?: string | undefined;
        testCode?: string | undefined;
        severity?: "CRITICAL" | "WARNING" | "INFO" | undefined;
    }[];
    description?: string | null | undefined;
    active?: boolean | undefined;
    conditions?: unknown;
}, {
    code: string;
    name: string;
    discipline: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY";
    trigger: "RESULT_SAVE" | "RESULT_VERIFY" | "RESULT_RELEASE";
    actions: {
        type: "AUTO_VERIFY" | "CRITICAL_ALERT" | "REFLEX_TEST" | "DELTA_CHECK" | "CASCADE_ANTIBIOTIC" | "REQUIRE_REVIEW";
        message?: string | undefined;
        testCode?: string | undefined;
        severity?: "CRITICAL" | "WARNING" | "INFO" | undefined;
    }[];
    description?: string | null | undefined;
    active?: boolean | undefined;
    priority?: number | undefined;
    testCodes?: string[] | undefined;
    conditions?: unknown;
}>;
export declare const ruleQuerySchema: z.ZodObject<{
    discipline: z.ZodOptional<z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>>;
    active: z.ZodOptional<z.ZodBoolean>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    active?: boolean | undefined;
    discipline?: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY" | undefined;
}, {
    active?: boolean | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    discipline?: "HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY" | undefined;
}>;
//# sourceMappingURL=rules.d.ts.map