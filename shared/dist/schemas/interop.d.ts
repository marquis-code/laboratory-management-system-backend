import { z } from 'zod';
export declare const wsiLinkSchema: z.ZodObject<{
    url: z.ZodString;
    viewerUrl: z.ZodOptional<z.ZodString>;
    scanner: z.ZodOptional<z.ZodString>;
    magnification: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    url: string;
    notes?: string | undefined;
    viewerUrl?: string | undefined;
    scanner?: string | undefined;
    magnification?: string | undefined;
}, {
    url: string;
    notes?: string | undefined;
    viewerUrl?: string | undefined;
    scanner?: string | undefined;
    magnification?: string | undefined;
}>;
export type WsiLinkInput = z.infer<typeof wsiLinkSchema>;
export declare const wsiWebhookSchema: z.ZodObject<{
    labCode: z.ZodOptional<z.ZodString>;
    barcode: z.ZodString;
    url: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["LINKED", "PROCESSING", "FAILED"]>>;
    scanner: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    status: "PROCESSING" | "FAILED" | "LINKED";
    barcode: string;
    url: string;
    labCode?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    scanner?: string | undefined;
}, {
    barcode: string;
    url: string;
    status?: "PROCESSING" | "FAILED" | "LINKED" | undefined;
    labCode?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    scanner?: string | undefined;
}>;
export type WsiWebhookInput = z.infer<typeof wsiWebhookSchema>;
export declare const terminologyQuerySchema: z.ZodObject<{
    system: z.ZodOptional<z.ZodEnum<["SNOMED_CT", "ICD_O_3_MORPHOLOGY", "ICD_O_3_TOPOGRAPHY"]>>;
    q: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    q?: string | undefined;
    system?: "SNOMED_CT" | "ICD_O_3_MORPHOLOGY" | "ICD_O_3_TOPOGRAPHY" | undefined;
}, {
    limit?: number | undefined;
    q?: string | undefined;
    system?: "SNOMED_CT" | "ICD_O_3_MORPHOLOGY" | "ICD_O_3_TOPOGRAPHY" | undefined;
}>;
export type TerminologyQuery = z.infer<typeof terminologyQuerySchema>;
export declare const terminologyValidateSchema: z.ZodObject<{
    system: z.ZodEnum<["SNOMED_CT", "ICD_O_3_MORPHOLOGY", "ICD_O_3_TOPOGRAPHY"]>;
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    system: "SNOMED_CT" | "ICD_O_3_MORPHOLOGY" | "ICD_O_3_TOPOGRAPHY";
}, {
    code: string;
    system: "SNOMED_CT" | "ICD_O_3_MORPHOLOGY" | "ICD_O_3_TOPOGRAPHY";
}>;
export type TerminologyValidateInput = z.infer<typeof terminologyValidateSchema>;
export declare const reportCodingSchema: z.ZodObject<{
    snomedCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    snomedDisplay: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    icdo3MorphologyCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    icdo3MorphologyDisplay: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    icdo3TopographyCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    icdo3TopographyDisplay: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    snomedCode?: string | null | undefined;
    snomedDisplay?: string | null | undefined;
    icdo3MorphologyCode?: string | null | undefined;
    icdo3MorphologyDisplay?: string | null | undefined;
    icdo3TopographyCode?: string | null | undefined;
    icdo3TopographyDisplay?: string | null | undefined;
}, {
    snomedCode?: string | null | undefined;
    snomedDisplay?: string | null | undefined;
    icdo3MorphologyCode?: string | null | undefined;
    icdo3MorphologyDisplay?: string | null | undefined;
    icdo3TopographyCode?: string | null | undefined;
    icdo3TopographyDisplay?: string | null | undefined;
}>;
export type ReportCodingInput = z.infer<typeof reportCodingSchema>;
export declare const hl7MessageSchema: z.ZodObject<{
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
}, {
    message: string;
}>;
export type Hl7MessageInput = z.infer<typeof hl7MessageSchema>;
export declare const hl7OrderSchema: z.ZodObject<{
    patient: z.ZodOptional<z.ZodString>;
    labCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    labCode?: string | undefined;
    patient?: string | undefined;
}, {
    labCode?: string | undefined;
    patient?: string | undefined;
}>;
//# sourceMappingURL=interop.d.ts.map