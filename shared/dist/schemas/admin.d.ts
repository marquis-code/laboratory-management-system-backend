import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEffects<z.ZodString, string, string>;
    password: z.ZodString;
    role: z.ZodEnum<["SUPER_ADMIN", "LAB_ADMIN", "RECEPTIONIST", "PHLEBOTOMIST", "GROSSER", "TECHNOLOGIST", "SCIENTIST", "PATHOLOGIST", "REFERRER"]>;
    phone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    disciplines: z.ZodOptional<z.ZodArray<z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>, "many">>;
    subspecialties: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
    role: "SUPER_ADMIN" | "LAB_ADMIN" | "RECEPTIONIST" | "PHLEBOTOMIST" | "GROSSER" | "TECHNOLOGIST" | "SCIENTIST" | "PATHOLOGIST" | "REFERRER";
    subspecialties: string[];
    disciplines?: ("HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY")[] | undefined;
    phone?: string | undefined;
}, {
    email: string;
    password: string;
    name: string;
    role: "SUPER_ADMIN" | "LAB_ADMIN" | "RECEPTIONIST" | "PHLEBOTOMIST" | "GROSSER" | "TECHNOLOGIST" | "SCIENTIST" | "PATHOLOGIST" | "REFERRER";
    disciplines?: ("HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY")[] | undefined;
    phone?: unknown;
    subspecialties?: string[] | undefined;
}>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["SUPER_ADMIN", "LAB_ADMIN", "RECEPTIONIST", "PHLEBOTOMIST", "GROSSER", "TECHNOLOGIST", "SCIENTIST", "PATHOLOGIST", "REFERRER"]>>;
    phone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    disciplines: z.ZodOptional<z.ZodArray<z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>, "many">>;
    active: z.ZodOptional<z.ZodBoolean>;
    subspecialties: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    disciplines?: ("HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY")[] | undefined;
    active?: boolean | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    role?: "SUPER_ADMIN" | "LAB_ADMIN" | "RECEPTIONIST" | "PHLEBOTOMIST" | "GROSSER" | "TECHNOLOGIST" | "SCIENTIST" | "PATHOLOGIST" | "REFERRER" | undefined;
    subspecialties?: string[] | undefined;
}, {
    disciplines?: ("HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY")[] | undefined;
    active?: boolean | undefined;
    name?: string | undefined;
    phone?: unknown;
    role?: "SUPER_ADMIN" | "LAB_ADMIN" | "RECEPTIONIST" | "PHLEBOTOMIST" | "GROSSER" | "TECHNOLOGIST" | "SCIENTIST" | "PATHOLOGIST" | "REFERRER" | undefined;
    subspecialties?: string[] | undefined;
}>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export declare const resetPasswordSchema: z.ZodObject<{
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
}, {
    password: string;
}>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export declare const userListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    role: z.ZodOptional<z.ZodEnum<["SUPER_ADMIN", "LAB_ADMIN", "RECEPTIONIST", "PHLEBOTOMIST", "GROSSER", "TECHNOLOGIST", "SCIENTIST", "PATHOLOGIST", "REFERRER"]>>;
    phone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    disciplines: z.ZodOptional<z.ZodArray<z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>, "many">>;
    active: z.ZodEffects<z.ZodOptional<z.ZodEnum<["true", "false"]>>, boolean | undefined, "true" | "false" | undefined>;
    q: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    disciplines?: ("HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY")[] | undefined;
    active?: boolean | undefined;
    phone?: string | undefined;
    q?: string | undefined;
    role?: "SUPER_ADMIN" | "LAB_ADMIN" | "RECEPTIONIST" | "PHLEBOTOMIST" | "GROSSER" | "TECHNOLOGIST" | "SCIENTIST" | "PATHOLOGIST" | "REFERRER" | undefined;
}, {
    disciplines?: ("HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY")[] | undefined;
    active?: "true" | "false" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    phone?: unknown;
    q?: string | undefined;
    role?: "SUPER_ADMIN" | "LAB_ADMIN" | "RECEPTIONIST" | "PHLEBOTOMIST" | "GROSSER" | "TECHNOLOGIST" | "SCIENTIST" | "PATHOLOGIST" | "REFERRER" | undefined;
}>;
export type UserListQuery = z.infer<typeof userListQuerySchema>;
export declare const letterheadSchema: z.ZodObject<{
    phone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    email: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    website: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    pathologistName: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    pathologistTitle: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    qualifications: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    signatureText: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    footerNote: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    phone?: string | undefined;
    website?: string | undefined;
    pathologistName?: string | undefined;
    pathologistTitle?: string | undefined;
    qualifications?: string | undefined;
    signatureText?: string | undefined;
    footerNote?: string | undefined;
}, {
    email?: unknown;
    phone?: unknown;
    website?: unknown;
    pathologistName?: unknown;
    pathologistTitle?: unknown;
    qualifications?: unknown;
    signatureText?: unknown;
    footerNote?: unknown;
}>;
export type LetterheadInput = z.infer<typeof letterheadSchema>;
export declare const updateLabSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    phone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    email: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    accessionPrefix: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    accessionFormat: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    tatHours: z.ZodOptional<z.ZodObject<{
        FROZEN: z.ZodNumber;
        URGENT: z.ZodNumber;
        ROUTINE: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        ROUTINE: number;
        URGENT: number;
        FROZEN: number;
    }, {
        ROUTINE: number;
        URGENT: number;
        FROZEN: number;
    }>>;
    tatWarningPercent: z.ZodOptional<z.ZodNumber>;
    timezone: z.ZodOptional<z.ZodString>;
    qaSamplingPercent: z.ZodOptional<z.ZodNumber>;
    enabledDisciplines: z.ZodOptional<z.ZodArray<z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>, "many">>;
    accessionPrefixes: z.ZodOptional<z.ZodRecord<z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>, z.ZodString>>;
    currency: z.ZodOptional<z.ZodString>;
    letterhead: z.ZodOptional<z.ZodObject<{
        phone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
        email: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
        website: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
        pathologistName: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
        pathologistTitle: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
        qualifications: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
        signatureText: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
        footerNote: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        phone?: string | undefined;
        website?: string | undefined;
        pathologistName?: string | undefined;
        pathologistTitle?: string | undefined;
        qualifications?: string | undefined;
        signatureText?: string | undefined;
        footerNote?: string | undefined;
    }, {
        email?: unknown;
        phone?: unknown;
        website?: unknown;
        pathologistName?: unknown;
        pathologistTitle?: unknown;
        qualifications?: unknown;
        signatureText?: unknown;
        footerNote?: unknown;
    }>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    address?: string | undefined;
    accessionPrefix?: string | undefined;
    accessionFormat?: string | undefined;
    tatHours?: {
        ROUTINE: number;
        URGENT: number;
        FROZEN: number;
    } | undefined;
    tatWarningPercent?: number | undefined;
    timezone?: string | undefined;
    qaSamplingPercent?: number | undefined;
    enabledDisciplines?: ("HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY")[] | undefined;
    accessionPrefixes?: Partial<Record<"HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY", string>> | undefined;
    currency?: string | undefined;
    letterhead?: {
        email?: string | undefined;
        phone?: string | undefined;
        website?: string | undefined;
        pathologistName?: string | undefined;
        pathologistTitle?: string | undefined;
        qualifications?: string | undefined;
        signatureText?: string | undefined;
        footerNote?: string | undefined;
    } | undefined;
}, {
    email?: unknown;
    name?: string | undefined;
    phone?: unknown;
    address?: string | undefined;
    accessionPrefix?: string | undefined;
    accessionFormat?: string | undefined;
    tatHours?: {
        ROUTINE: number;
        URGENT: number;
        FROZEN: number;
    } | undefined;
    tatWarningPercent?: number | undefined;
    timezone?: string | undefined;
    qaSamplingPercent?: number | undefined;
    enabledDisciplines?: ("HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY")[] | undefined;
    accessionPrefixes?: Partial<Record<"HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY", string>> | undefined;
    currency?: string | undefined;
    letterhead?: {
        email?: unknown;
        phone?: unknown;
        website?: unknown;
        pathologistName?: unknown;
        pathologistTitle?: unknown;
        qualifications?: unknown;
        signatureText?: unknown;
        footerNote?: unknown;
    } | undefined;
}>;
export type UpdateLabInput = z.infer<typeof updateLabSchema>;
export declare const auditListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    action: z.ZodOptional<z.ZodEnum<["CREATE", "UPDATE", "DELETE", "SCAN", "SIGN_OUT", "AMEND", "LOGIN", "LOGOUT", "RELEASE", "PAYMENT", "WEBHOOK", "SYNC", "QA", "EXPORT", "NOTIFY", "IMPORT"]>>;
    entityType: z.ZodOptional<z.ZodString>;
    entityId: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    from?: string | undefined;
    to?: string | undefined;
    action?: "CREATE" | "UPDATE" | "DELETE" | "SCAN" | "SIGN_OUT" | "AMEND" | "LOGIN" | "LOGOUT" | "RELEASE" | "PAYMENT" | "WEBHOOK" | "SYNC" | "QA" | "EXPORT" | "NOTIFY" | "IMPORT" | undefined;
    entityType?: string | undefined;
    entityId?: string | undefined;
    userId?: string | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    from?: string | undefined;
    to?: string | undefined;
    action?: "CREATE" | "UPDATE" | "DELETE" | "SCAN" | "SIGN_OUT" | "AMEND" | "LOGIN" | "LOGOUT" | "RELEASE" | "PAYMENT" | "WEBHOOK" | "SYNC" | "QA" | "EXPORT" | "NOTIFY" | "IMPORT" | undefined;
    entityType?: string | undefined;
    entityId?: string | undefined;
    userId?: string | undefined;
}>;
export type AuditListQuery = z.infer<typeof auditListQuerySchema>;
export declare const protocolListQuerySchema: z.ZodObject<{
    subspecialty: z.ZodOptional<z.ZodString>;
    active: z.ZodEffects<z.ZodOptional<z.ZodEnum<["true", "false"]>>, boolean | undefined, "true" | "false" | undefined>;
}, "strip", z.ZodTypeAny, {
    subspecialty?: string | undefined;
    active?: boolean | undefined;
}, {
    subspecialty?: string | undefined;
    active?: "true" | "false" | undefined;
}>;
export type ProtocolListQuery = z.infer<typeof protocolListQuerySchema>;
export declare const worklistQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["RECEIVED", "IN_PROGRESS", "PENDING_REVIEW", "AMENDED"]>>;
    priority: z.ZodOptional<z.ZodEnum<["ROUTINE", "URGENT", "FROZEN"]>>;
    assigned: z.ZodDefault<z.ZodEnum<["me", "unassigned", "all"]>>;
    subspecialty: z.ZodOptional<z.ZodString>;
    pathologistId: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    assigned: "me" | "unassigned" | "all";
    status?: "RECEIVED" | "IN_PROGRESS" | "PENDING_REVIEW" | "AMENDED" | undefined;
    subspecialty?: string | undefined;
    priority?: "ROUTINE" | "URGENT" | "FROZEN" | undefined;
    pathologistId?: string | undefined;
}, {
    status?: "RECEIVED" | "IN_PROGRESS" | "PENDING_REVIEW" | "AMENDED" | undefined;
    subspecialty?: string | undefined;
    limit?: number | undefined;
    priority?: "ROUTINE" | "URGENT" | "FROZEN" | undefined;
    pathologistId?: string | undefined;
    assigned?: "me" | "unassigned" | "all" | undefined;
}>;
export type WorklistQuery = z.infer<typeof worklistQuerySchema>;
export declare const dashboardQuerySchema: z.ZodObject<{
    days: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    days: number;
}, {
    days?: number | undefined;
}>;
export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;
//# sourceMappingURL=admin.d.ts.map