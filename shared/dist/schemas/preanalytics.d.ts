import { z } from 'zod';
export declare const collectionCentreSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
    address: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    homeCollection: z.ZodOptional<z.ZodBoolean>;
    active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    active?: boolean | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    homeCollection?: boolean | undefined;
}, {
    code: string;
    name: string;
    active?: boolean | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    homeCollection?: boolean | undefined;
}>;
export declare const consignmentSchema: z.ZodObject<{
    centreId: z.ZodString;
    testRequestIds: z.ZodArray<z.ZodString, "many">;
    riderName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    riderPhone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    centreId: string;
    testRequestIds: string[];
    notes?: string | null | undefined;
    riderName?: string | null | undefined;
    riderPhone?: string | null | undefined;
}, {
    centreId: string;
    testRequestIds: string[];
    notes?: string | null | undefined;
    riderName?: string | null | undefined;
    riderPhone?: string | null | undefined;
}>;
export declare const receiveConsignmentSchema: z.ZodObject<{
    accepted: z.ZodBoolean;
    rejectionReason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    accepted: boolean;
    rejectionReason?: string | null | undefined;
}, {
    accepted: boolean;
    rejectionReason?: string | null | undefined;
}>;
//# sourceMappingURL=preanalytics.d.ts.map