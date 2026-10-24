import { z } from 'zod';
export declare const syncMutationSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["SCAN", "REJECT", "RECUT"]>;
    payload: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    createdAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "SCAN" | "REJECT" | "RECUT";
    id: string;
    payload: Record<string, unknown>;
    createdAt?: string | undefined;
}, {
    type: "SCAN" | "REJECT" | "RECUT";
    id: string;
    payload: Record<string, unknown>;
    createdAt?: string | undefined;
}>;
export type SyncMutationInput = z.infer<typeof syncMutationSchema>;
export declare const syncBatchSchema: z.ZodObject<{
    mutations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["SCAN", "REJECT", "RECUT"]>;
        payload: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        createdAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "SCAN" | "REJECT" | "RECUT";
        id: string;
        payload: Record<string, unknown>;
        createdAt?: string | undefined;
    }, {
        type: "SCAN" | "REJECT" | "RECUT";
        id: string;
        payload: Record<string, unknown>;
        createdAt?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    mutations: {
        type: "SCAN" | "REJECT" | "RECUT";
        id: string;
        payload: Record<string, unknown>;
        createdAt?: string | undefined;
    }[];
}, {
    mutations: {
        type: "SCAN" | "REJECT" | "RECUT";
        id: string;
        payload: Record<string, unknown>;
        createdAt?: string | undefined;
    }[];
}>;
export type SyncBatchInput = z.infer<typeof syncBatchSchema>;
export declare const scanIdempotencySchema: z.ZodObject<{
    barcode: z.ZodString;
    station: z.ZodEnum<["GROSSING", "PROCESSING", "EMBEDDING", "MICROTOMY", "STAINING", "PATHOLOGIST", "ARCHIVE"]>;
    eventType: z.ZodOptional<z.ZodEnum<["REJECTED", "RECUT_REQUESTED"]>>;
    reason: z.ZodOptional<z.ZodString>;
    reasonCode: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    barcode: string;
    station: "PATHOLOGIST" | "PROCESSING" | "GROSSING" | "EMBEDDING" | "MICROTOMY" | "STAINING" | "ARCHIVE";
    reason?: string | undefined;
    reasonCode?: string | undefined;
    eventType?: "RECUT_REQUESTED" | "REJECTED" | undefined;
    metadata?: Record<string, unknown> | undefined;
}, {
    barcode: string;
    station: "PATHOLOGIST" | "PROCESSING" | "GROSSING" | "EMBEDDING" | "MICROTOMY" | "STAINING" | "ARCHIVE";
    reason?: string | undefined;
    reasonCode?: string | undefined;
    eventType?: "RECUT_REQUESTED" | "REJECTED" | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export type ScanIdempotencyInput = z.infer<typeof scanIdempotencySchema>;
//# sourceMappingURL=sync.d.ts.map