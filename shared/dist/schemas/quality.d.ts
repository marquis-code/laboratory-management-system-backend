import { z } from 'zod';
export declare const equipmentSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
    type: z.ZodString;
    serialNumber: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    location: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "MAINTENANCE", "RETIRED"]>>;
    lastCalibrationAt: z.ZodOptional<z.ZodString>;
    nextCalibrationAt: z.ZodOptional<z.ZodString>;
    active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    code: string;
    type: string;
    name: string;
    status?: "ACTIVE" | "MAINTENANCE" | "RETIRED" | undefined;
    active?: boolean | undefined;
    serialNumber?: string | null | undefined;
    location?: string | null | undefined;
    lastCalibrationAt?: string | undefined;
    nextCalibrationAt?: string | undefined;
}, {
    code: string;
    type: string;
    name: string;
    status?: "ACTIVE" | "MAINTENANCE" | "RETIRED" | undefined;
    active?: boolean | undefined;
    serialNumber?: string | null | undefined;
    location?: string | null | undefined;
    lastCalibrationAt?: string | undefined;
    nextCalibrationAt?: string | undefined;
}>;
export declare const temperatureLogSchema: z.ZodObject<{
    temperature: z.ZodNumber;
    unit: z.ZodDefault<z.ZodString>;
    minAllowed: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    maxAllowed: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    unit: string;
    temperature: number;
    notes?: string | null | undefined;
    minAllowed?: number | null | undefined;
    maxAllowed?: number | null | undefined;
}, {
    temperature: number;
    unit?: string | undefined;
    notes?: string | null | undefined;
    minAllowed?: number | null | undefined;
    maxAllowed?: number | null | undefined;
}>;
export declare const nonConformanceSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    severity: z.ZodEnum<["MINOR", "MAJOR", "CRITICAL"]>;
    assignedToId: z.ZodOptional<z.ZodString>;
    dueAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    category: string;
    severity: "MINOR" | "MAJOR" | "CRITICAL";
    dueAt?: string | undefined;
    assignedToId?: string | undefined;
}, {
    title: string;
    description: string;
    category: string;
    severity: "MINOR" | "MAJOR" | "CRITICAL";
    dueAt?: string | undefined;
    assignedToId?: string | undefined;
}>;
export declare const nonConformanceUpdateSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["OPEN", "INVESTIGATING", "CAPA", "CLOSED"]>>;
    severity: z.ZodOptional<z.ZodEnum<["MINOR", "MAJOR", "CRITICAL"]>>;
    rootCause: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    assignedToId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status?: "CLOSED" | "OPEN" | "INVESTIGATING" | "CAPA" | undefined;
    severity?: "MINOR" | "MAJOR" | "CRITICAL" | undefined;
    assignedToId?: string | null | undefined;
    rootCause?: string | null | undefined;
}, {
    status?: "CLOSED" | "OPEN" | "INVESTIGATING" | "CAPA" | undefined;
    severity?: "MINOR" | "MAJOR" | "CRITICAL" | undefined;
    assignedToId?: string | null | undefined;
    rootCause?: string | null | undefined;
}>;
export declare const capaSchema: z.ZodObject<{
    action: z.ZodString;
    owner: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dueAt: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["OPEN", "IN_PROGRESS", "COMPLETED", "VERIFIED"]>>;
}, "strip", z.ZodTypeAny, {
    action: string;
    status?: "IN_PROGRESS" | "COMPLETED" | "VERIFIED" | "OPEN" | undefined;
    dueAt?: string | undefined;
    owner?: string | null | undefined;
}, {
    action: string;
    status?: "IN_PROGRESS" | "COMPLETED" | "VERIFIED" | "OPEN" | undefined;
    dueAt?: string | undefined;
    owner?: string | null | undefined;
}>;
export declare const sendOutSchema: z.ZodObject<{
    testRequestId: z.ZodString;
    referenceLab: z.ZodString;
    reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    courier: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    trackingNumber: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    testRequestId: string;
    referenceLab: string;
    reason?: string | null | undefined;
    courier?: string | null | undefined;
    trackingNumber?: string | null | undefined;
}, {
    testRequestId: string;
    referenceLab: string;
    reason?: string | null | undefined;
    courier?: string | null | undefined;
    trackingNumber?: string | null | undefined;
}>;
export declare const sendOutUpdateSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["SENT", "IN_TRANSIT", "RECEIVED", "REPORTED", "CANCELLED"]>>;
    resultSummary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status?: "RECEIVED" | "REPORTED" | "SENT" | "CANCELLED" | "IN_TRANSIT" | undefined;
    resultSummary?: string | null | undefined;
}, {
    status?: "RECEIVED" | "REPORTED" | "SENT" | "CANCELLED" | "IN_TRANSIT" | undefined;
    resultSummary?: string | null | undefined;
}>;
//# sourceMappingURL=quality.d.ts.map