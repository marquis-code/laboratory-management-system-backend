import { z } from 'zod';
export declare const createReportSchema: z.ZodObject<{
    protocolId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    protocolId: string;
}, {
    protocolId: string;
}>;
export type CreateReportInput = z.infer<typeof createReportSchema>;
export declare const updateReportSchema: z.ZodObject<{
    data: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">, z.ZodNull]>>;
}, "strip", z.ZodTypeAny, {
    data: Record<string, string | number | boolean | string[] | null>;
}, {
    data: Record<string, string | number | boolean | string[] | null>;
}>;
export type UpdateReportInput = z.infer<typeof updateReportSchema>;
export declare const signOutReportSchema: z.ZodObject<{
    statement: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    statement?: string | undefined;
}, {
    statement?: string | undefined;
}>;
export type SignOutReportInput = z.infer<typeof signOutReportSchema>;
export declare const amendReportSchema: z.ZodObject<{
    reason: z.ZodString;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">, z.ZodNull]>>>;
}, "strip", z.ZodTypeAny, {
    reason: string;
    data?: Record<string, string | number | boolean | string[] | null> | undefined;
}, {
    reason: string;
    data?: Record<string, string | number | boolean | string[] | null> | undefined;
}>;
export type AmendReportInput = z.infer<typeof amendReportSchema>;
export declare const reportListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "SIGNED_OUT", "AMENDED"]>>;
    q: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "AMENDED" | "DRAFT" | "SIGNED_OUT" | undefined;
    q?: string | undefined;
}, {
    status?: "AMENDED" | "DRAFT" | "SIGNED_OUT" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    q?: string | undefined;
}>;
export type ReportListQuery = z.infer<typeof reportListQuerySchema>;
//# sourceMappingURL=report.d.ts.map