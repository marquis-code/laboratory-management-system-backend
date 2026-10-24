import { z } from 'zod';
export declare const qaReviewSchema: z.ZodObject<{
    caseId: z.ZodString;
    reportId: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["PEER_REVIEW", "SECOND_OPINION", "DISCREPANCY"]>;
    reviewerId: z.ZodOptional<z.ZodString>;
    reason: z.ZodString;
    dueAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "PEER_REVIEW" | "SECOND_OPINION" | "DISCREPANCY";
    reason: string;
    caseId: string;
    reportId?: string | undefined;
    reviewerId?: string | undefined;
    dueAt?: string | undefined;
}, {
    type: "PEER_REVIEW" | "SECOND_OPINION" | "DISCREPANCY";
    reason: string;
    caseId: string;
    reportId?: string | undefined;
    reviewerId?: string | undefined;
    dueAt?: string | undefined;
}>;
export type QaReviewInput = z.infer<typeof qaReviewSchema>;
export declare const qaAssignSchema: z.ZodObject<{
    reviewerId: z.ZodString;
    dueAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reviewerId: string;
    dueAt?: string | undefined;
}, {
    reviewerId: string;
    dueAt?: string | undefined;
}>;
export type QaAssignInput = z.infer<typeof qaAssignSchema>;
export declare const qaStartSchema: z.ZodObject<{
    findings: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    findings?: string | undefined;
}, {
    findings?: string | undefined;
}>;
export type QaStartInput = z.infer<typeof qaStartSchema>;
export declare const qaCompleteSchema: z.ZodObject<{
    outcome: z.ZodEnum<["AGREED", "DISCREPANT"]>;
    reviewDiagnosis: z.ZodOptional<z.ZodString>;
    disagreementCode: z.ZodOptional<z.ZodEnum<["NONE", "MAJOR_DIAGNOSTIC", "MINOR_DIAGNOSTIC", "GRADING", "STAGING", "BIOMARKER", "MARGIN", "LYMPH_NODE", "TRANSCRIPTION", "OTHER"]>>;
    severity: z.ZodOptional<z.ZodEnum<["MINOR", "MAJOR", "CRITICAL"]>>;
    findings: z.ZodString;
    actionPlan: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    findings: string;
    outcome: "AGREED" | "DISCREPANT";
    reviewDiagnosis?: string | undefined;
    disagreementCode?: "OTHER" | "NONE" | "MAJOR_DIAGNOSTIC" | "MINOR_DIAGNOSTIC" | "GRADING" | "STAGING" | "BIOMARKER" | "MARGIN" | "LYMPH_NODE" | "TRANSCRIPTION" | undefined;
    severity?: "MINOR" | "MAJOR" | "CRITICAL" | undefined;
    actionPlan?: string | undefined;
}, {
    findings: string;
    outcome: "AGREED" | "DISCREPANT";
    reviewDiagnosis?: string | undefined;
    disagreementCode?: "OTHER" | "NONE" | "MAJOR_DIAGNOSTIC" | "MINOR_DIAGNOSTIC" | "GRADING" | "STAGING" | "BIOMARKER" | "MARGIN" | "LYMPH_NODE" | "TRANSCRIPTION" | undefined;
    severity?: "MINOR" | "MAJOR" | "CRITICAL" | undefined;
    actionPlan?: string | undefined;
}>;
export type QaCompleteInput = z.infer<typeof qaCompleteSchema>;
export declare const qaQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "ASSIGNED", "IN_REVIEW", "AGREED", "DISCREPANT", "CLOSED", "CANCELLED"]>>;
    type: z.ZodOptional<z.ZodEnum<["PEER_REVIEW", "SECOND_OPINION", "DISCREPANCY"]>>;
    reviewerId: z.ZodOptional<z.ZodString>;
    mine: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodEnum<["true", "false"]>]>>, boolean, boolean | "true" | "false" | undefined>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    mine: boolean;
    type?: "PEER_REVIEW" | "SECOND_OPINION" | "DISCREPANCY" | undefined;
    status?: "PENDING" | "ASSIGNED" | "IN_REVIEW" | "AGREED" | "DISCREPANT" | "CLOSED" | "CANCELLED" | undefined;
    reviewerId?: string | undefined;
}, {
    type?: "PEER_REVIEW" | "SECOND_OPINION" | "DISCREPANCY" | undefined;
    status?: "PENDING" | "ASSIGNED" | "IN_REVIEW" | "AGREED" | "DISCREPANT" | "CLOSED" | "CANCELLED" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    reviewerId?: string | undefined;
    mine?: boolean | "true" | "false" | undefined;
}>;
export type QaQuery = z.infer<typeof qaQuerySchema>;
export declare const rejectWithCodeSchema: z.ZodObject<{
    reasonCode: z.ZodEnum<["MISLABELLED", "WRONG_CONTAINER", "FIXATION_DELAY", "INSUFFICIENT_TISSUE", "CONTAMINATION", "BROKEN_SLIDE", "LOST_IN_PROCESSING", "UNREPRESENTATIVE", "OTHER"]>;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    reasonCode: "OTHER" | "MISLABELLED" | "WRONG_CONTAINER" | "FIXATION_DELAY" | "INSUFFICIENT_TISSUE" | "CONTAMINATION" | "BROKEN_SLIDE" | "LOST_IN_PROCESSING" | "UNREPRESENTATIVE";
}, {
    reason: string;
    reasonCode: "OTHER" | "MISLABELLED" | "WRONG_CONTAINER" | "FIXATION_DELAY" | "INSUFFICIENT_TISSUE" | "CONTAMINATION" | "BROKEN_SLIDE" | "LOST_IN_PROCESSING" | "UNREPRESENTATIVE";
}>;
export type RejectWithCodeInput = z.infer<typeof rejectWithCodeSchema>;
//# sourceMappingURL=qa.d.ts.map