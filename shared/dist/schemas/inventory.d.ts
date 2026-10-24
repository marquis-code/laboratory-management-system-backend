import { z } from 'zod';
export declare const reagentLotSchema: z.ZodObject<{
    name: z.ZodString;
    category: z.ZodEnum<["REAGENT", "ANTIBODY", "CONSUMABLE"]>;
    vendor: z.ZodString;
    catalogNumber: z.ZodOptional<z.ZodString>;
    lotNumber: z.ZodString;
    storageLocation: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
    unit: z.ZodString;
    receivedAt: z.ZodString;
    expiresAt: z.ZodString;
    openedAt: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    unit: string;
    name: string;
    category: "REAGENT" | "ANTIBODY" | "CONSUMABLE";
    vendor: string;
    lotNumber: string;
    quantity: number;
    receivedAt: string;
    expiresAt: string;
    notes?: string | undefined;
    catalogNumber?: string | undefined;
    storageLocation?: string | undefined;
    openedAt?: string | undefined;
}, {
    unit: string;
    name: string;
    category: "REAGENT" | "ANTIBODY" | "CONSUMABLE";
    vendor: string;
    lotNumber: string;
    quantity: number;
    receivedAt: string;
    expiresAt: string;
    notes?: string | undefined;
    catalogNumber?: string | undefined;
    storageLocation?: string | undefined;
    openedAt?: string | undefined;
}>;
export type ReagentLotInput = z.infer<typeof reagentLotSchema>;
export declare const reagentLotQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    q: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<["REAGENT", "ANTIBODY", "CONSUMABLE"]>>;
    status: z.ZodOptional<z.ZodEnum<["QUARANTINED", "ACTIVE", "EXPIRED", "DEPLETED", "REJECTED"]>>;
    expiringWithinDays: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "REJECTED" | "QUARANTINED" | "ACTIVE" | "EXPIRED" | "DEPLETED" | undefined;
    q?: string | undefined;
    category?: "REAGENT" | "ANTIBODY" | "CONSUMABLE" | undefined;
    expiringWithinDays?: number | undefined;
}, {
    status?: "REJECTED" | "QUARANTINED" | "ACTIVE" | "EXPIRED" | "DEPLETED" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    q?: string | undefined;
    category?: "REAGENT" | "ANTIBODY" | "CONSUMABLE" | undefined;
    expiringWithinDays?: number | undefined;
}>;
export type ReagentLotQuery = z.infer<typeof reagentLotQuerySchema>;
export declare const validateLotSchema: z.ZodObject<{
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    note?: string | undefined;
}, {
    note?: string | undefined;
}>;
export type ValidateLotInput = z.infer<typeof validateLotSchema>;
export declare const stainRunSchema: z.ZodEffects<z.ZodObject<{
    caseId: z.ZodString;
    slideId: z.ZodOptional<z.ZodString>;
    blockId: z.ZodOptional<z.ZodString>;
    stainType: z.ZodEnum<["H_AND_E", "SPECIAL", "IMMUNOHISTOCHEMISTRY"]>;
    stainName: z.ZodString;
    equipment: z.ZodOptional<z.ZodString>;
    lots: z.ZodArray<z.ZodObject<{
        lotId: z.ZodString;
        quantityUsed: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        lotId: string;
        quantityUsed: number;
    }, {
        lotId: string;
        quantityUsed: number;
    }>, "many">;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    stainType: "H_AND_E" | "SPECIAL" | "IMMUNOHISTOCHEMISTRY";
    caseId: string;
    stainName: string;
    lots: {
        lotId: string;
        quantityUsed: number;
    }[];
    blockId?: string | undefined;
    notes?: string | undefined;
    slideId?: string | undefined;
    equipment?: string | undefined;
}, {
    stainType: "H_AND_E" | "SPECIAL" | "IMMUNOHISTOCHEMISTRY";
    caseId: string;
    stainName: string;
    lots: {
        lotId: string;
        quantityUsed: number;
    }[];
    blockId?: string | undefined;
    notes?: string | undefined;
    slideId?: string | undefined;
    equipment?: string | undefined;
}>, {
    stainType: "H_AND_E" | "SPECIAL" | "IMMUNOHISTOCHEMISTRY";
    caseId: string;
    stainName: string;
    lots: {
        lotId: string;
        quantityUsed: number;
    }[];
    blockId?: string | undefined;
    notes?: string | undefined;
    slideId?: string | undefined;
    equipment?: string | undefined;
}, {
    stainType: "H_AND_E" | "SPECIAL" | "IMMUNOHISTOCHEMISTRY";
    caseId: string;
    stainName: string;
    lots: {
        lotId: string;
        quantityUsed: number;
    }[];
    blockId?: string | undefined;
    notes?: string | undefined;
    slideId?: string | undefined;
    equipment?: string | undefined;
}>;
export type StainRunInput = z.infer<typeof stainRunSchema>;
export declare const completeStainRunSchema: z.ZodObject<{
    qcResult: z.ZodEnum<["PENDING", "PASS", "FAIL"]>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    qcResult: "PENDING" | "PASS" | "FAIL";
    notes?: string | undefined;
}, {
    qcResult: "PENDING" | "PASS" | "FAIL";
    notes?: string | undefined;
}>;
export type CompleteStainRunInput = z.infer<typeof completeStainRunSchema>;
export declare const stainRunQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    caseId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["PLANNED", "RUNNING", "COMPLETED", "FAILED", "QC_HOLD"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "FAILED" | "PLANNED" | "RUNNING" | "COMPLETED" | "QC_HOLD" | undefined;
    caseId?: string | undefined;
}, {
    status?: "FAILED" | "PLANNED" | "RUNNING" | "COMPLETED" | "QC_HOLD" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    caseId?: string | undefined;
}>;
export type StainRunQuery = z.infer<typeof stainRunQuerySchema>;
//# sourceMappingURL=inventory.d.ts.map