import { z } from 'zod';
export declare const invoiceItemSchema: z.ZodObject<{
    description: z.ZodString;
    quantity: z.ZodNumber;
    unitPrice: z.ZodNumber;
    category: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    category: string;
    quantity: number;
    unitPrice: number;
}, {
    description: string;
    quantity: number;
    unitPrice: number;
    category?: string | undefined;
}>;
export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;
export declare const createInvoiceSchema: z.ZodObject<{
    caseId: z.ZodString;
    payerType: z.ZodEnum<["SELF", "HMO", "CORPORATE", "INSURANCE", "WAIVER"]>;
    hmoName: z.ZodOptional<z.ZodString>;
    hmoCode: z.ZodOptional<z.ZodString>;
    authorizationNumber: z.ZodOptional<z.ZodString>;
    items: z.ZodArray<z.ZodObject<{
        description: z.ZodString;
        quantity: z.ZodNumber;
        unitPrice: z.ZodNumber;
        category: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        category: string;
        quantity: number;
        unitPrice: number;
    }, {
        description: string;
        quantity: number;
        unitPrice: number;
        category?: string | undefined;
    }>, "many">;
    discount: z.ZodDefault<z.ZodNumber>;
    currency: z.ZodDefault<z.ZodString>;
    dueAt: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    currency: string;
    caseId: string;
    payerType: "SELF" | "HMO" | "CORPORATE" | "INSURANCE" | "WAIVER";
    items: {
        description: string;
        category: string;
        quantity: number;
        unitPrice: number;
    }[];
    discount: number;
    notes?: string | undefined;
    dueAt?: string | undefined;
    hmoName?: string | undefined;
    hmoCode?: string | undefined;
    authorizationNumber?: string | undefined;
}, {
    caseId: string;
    payerType: "SELF" | "HMO" | "CORPORATE" | "INSURANCE" | "WAIVER";
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
        category?: string | undefined;
    }[];
    notes?: string | undefined;
    currency?: string | undefined;
    dueAt?: string | undefined;
    hmoName?: string | undefined;
    hmoCode?: string | undefined;
    authorizationNumber?: string | undefined;
    discount?: number | undefined;
}>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export declare const invoiceQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "ISSUED", "PARTIALLY_PAID", "PAID", "OVERDUE", "VOID"]>>;
    payerType: z.ZodOptional<z.ZodEnum<["SELF", "HMO", "CORPORATE", "INSURANCE", "WAIVER"]>>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    q: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "DRAFT" | "ISSUED" | "PARTIALLY_PAID" | "PAID" | "OVERDUE" | "VOID" | undefined;
    q?: string | undefined;
    from?: string | undefined;
    to?: string | undefined;
    payerType?: "SELF" | "HMO" | "CORPORATE" | "INSURANCE" | "WAIVER" | undefined;
}, {
    status?: "DRAFT" | "ISSUED" | "PARTIALLY_PAID" | "PAID" | "OVERDUE" | "VOID" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    q?: string | undefined;
    from?: string | undefined;
    to?: string | undefined;
    payerType?: "SELF" | "HMO" | "CORPORATE" | "INSURANCE" | "WAIVER" | undefined;
}>;
export type InvoiceQuery = z.infer<typeof invoiceQuerySchema>;
export declare const initializePaymentSchema: z.ZodObject<{
    provider: z.ZodEnum<["PAYSTACK", "FLUTTERWAVE", "CASH", "TRANSFER", "HMO"]>;
    amount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    provider: "HMO" | "PAYSTACK" | "FLUTTERWAVE" | "CASH" | "TRANSFER";
    amount?: number | undefined;
}, {
    provider: "HMO" | "PAYSTACK" | "FLUTTERWAVE" | "CASH" | "TRANSFER";
    amount?: number | undefined;
}>;
export type InitializePaymentInput = z.infer<typeof initializePaymentSchema>;
export declare const recordManualPaymentSchema: z.ZodObject<{
    provider: z.ZodEnum<["CASH", "TRANSFER", "HMO"]>;
    amount: z.ZodNumber;
    reference: z.ZodString;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    provider: "HMO" | "CASH" | "TRANSFER";
    amount: number;
    reference: string;
    note?: string | undefined;
}, {
    provider: "HMO" | "CASH" | "TRANSFER";
    amount: number;
    reference: string;
    note?: string | undefined;
}>;
export type RecordManualPaymentInput = z.infer<typeof recordManualPaymentSchema>;
export declare const claimQuerySchema: z.ZodObject<{
    from: z.ZodString;
    to: z.ZodString;
    format: z.ZodDefault<z.ZodEnum<["csv", "json"]>>;
    hmoName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    from: string;
    to: string;
    format: "csv" | "json";
    hmoName?: string | undefined;
}, {
    from: string;
    to: string;
    hmoName?: string | undefined;
    format?: "csv" | "json" | undefined;
}>;
export type ClaimQuery = z.infer<typeof claimQuerySchema>;
//# sourceMappingURL=billing.d.ts.map