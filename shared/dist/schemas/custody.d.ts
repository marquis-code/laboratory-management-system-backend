import { z } from 'zod';
export declare const scanSchema: z.ZodObject<{
    barcode: z.ZodEffects<z.ZodString, string, string>;
    station: z.ZodEnum<["GROSSING", "PROCESSING", "EMBEDDING", "MICROTOMY", "STAINING", "PATHOLOGIST", "ARCHIVE"]>;
    eventType: z.ZodOptional<z.ZodEnum<["REJECTED", "RECUT_REQUESTED"]>>;
    reason: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    barcode: string;
    station: "PATHOLOGIST" | "PROCESSING" | "GROSSING" | "EMBEDDING" | "MICROTOMY" | "STAINING" | "ARCHIVE";
    reason?: string | undefined;
    eventType?: "RECUT_REQUESTED" | "REJECTED" | undefined;
    metadata?: Record<string, unknown> | undefined;
}, {
    barcode: string;
    station: "PATHOLOGIST" | "PROCESSING" | "GROSSING" | "EMBEDDING" | "MICROTOMY" | "STAINING" | "ARCHIVE";
    reason?: string | undefined;
    eventType?: "RECUT_REQUESTED" | "REJECTED" | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export type ScanInput = z.infer<typeof scanSchema>;
export declare const locatorQuerySchema: z.ZodObject<{
    q: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    q?: string | undefined;
}, {
    q?: string | undefined;
}>;
export type LocatorQuery = z.infer<typeof locatorQuerySchema>;
//# sourceMappingURL=custody.d.ts.map