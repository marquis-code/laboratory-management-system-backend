import { z } from 'zod';
export declare const leadCreateSchema: z.ZodObject<{
    type: z.ZodDefault<z.ZodEnum<["DEMO", "TRIAL", "SUPPORT"]>>;
    organizationName: z.ZodString;
    contactName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    role: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    departments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    monthlyVolume: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    type: "TRIAL" | "DEMO" | "SUPPORT";
    email: string;
    organizationName: string;
    contactName: string;
    message?: string | null | undefined;
    phone?: string | null | undefined;
    role?: string | null | undefined;
    departments?: string[] | undefined;
    monthlyVolume?: string | null | undefined;
}, {
    email: string;
    organizationName: string;
    contactName: string;
    message?: string | null | undefined;
    type?: "TRIAL" | "DEMO" | "SUPPORT" | undefined;
    phone?: string | null | undefined;
    role?: string | null | undefined;
    departments?: string[] | undefined;
    monthlyVolume?: string | null | undefined;
}>;
export declare const leadUpdateSchema: z.ZodObject<{
    status: z.ZodEnum<["NEW", "CONTACTED", "QUALIFIED", "CLOSED"]>;
}, "strip", z.ZodTypeAny, {
    status: "CLOSED" | "NEW" | "CONTACTED" | "QUALIFIED";
}, {
    status: "CLOSED" | "NEW" | "CONTACTED" | "QUALIFIED";
}>;
//# sourceMappingURL=lead.d.ts.map