import { z } from 'zod';
export declare const portalRequestSchema: z.ZodObject<{
    labCode: z.ZodEffects<z.ZodString, string, string>;
    email: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    labCode: string;
    email: string;
}, {
    labCode: string;
    email: string;
}>;
export type PortalRequestInput = z.infer<typeof portalRequestSchema>;
export declare const portalVerifySchema: z.ZodEffects<z.ZodObject<{
    labCode: z.ZodEffects<z.ZodString, string, string>;
    email: z.ZodEffects<z.ZodString, string, string>;
    code: z.ZodOptional<z.ZodString>;
    token: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    labCode: string;
    email: string;
    code?: string | undefined;
    token?: string | undefined;
}, {
    labCode: string;
    email: string;
    code?: string | undefined;
    token?: string | undefined;
}>, {
    labCode: string;
    email: string;
    code?: string | undefined;
    token?: string | undefined;
}, {
    labCode: string;
    email: string;
    code?: string | undefined;
    token?: string | undefined;
}>;
export type PortalVerifyInput = z.infer<typeof portalVerifySchema>;
export declare const releaseReportSchema: z.ZodObject<{
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    note?: string | undefined;
}, {
    note?: string | undefined;
}>;
export type ReleaseReportInput = z.infer<typeof releaseReportSchema>;
export declare const notificationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    channel: z.ZodOptional<z.ZodEnum<["IN_APP", "EMAIL", "SMS", "WHATSAPP"]>>;
    status: z.ZodOptional<z.ZodEnum<["QUEUED", "SENDING", "SENT", "FAILED", "SKIPPED"]>>;
    unreadOnly: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodEnum<["true", "false"]>]>>, boolean, boolean | "true" | "false" | undefined>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    unreadOnly: boolean;
    status?: "QUEUED" | "SENDING" | "SENT" | "FAILED" | "SKIPPED" | undefined;
    channel?: "IN_APP" | "EMAIL" | "SMS" | "WHATSAPP" | undefined;
}, {
    status?: "QUEUED" | "SENDING" | "SENT" | "FAILED" | "SKIPPED" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    channel?: "IN_APP" | "EMAIL" | "SMS" | "WHATSAPP" | undefined;
    unreadOnly?: boolean | "true" | "false" | undefined;
}>;
export type NotificationQuery = z.infer<typeof notificationQuerySchema>;
//# sourceMappingURL=portal.d.ts.map