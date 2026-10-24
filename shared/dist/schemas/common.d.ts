import { z } from 'zod';
export declare const OBJECT_ID_REGEX: RegExp;
export declare const objectIdSchema: z.ZodString;
export declare const DATE_REGEX: RegExp;
export declare const dateStringSchema: z.ZodString;
export declare const isoDateTimeSchema: z.ZodString;
export declare const paginationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
export interface ApiErrorBody {
    success: false;
    statusCode: number;
    error: string;
    message: string | string[];
    details?: unknown;
    requestId: string;
    timestamp: string;
    path: string;
}
export interface ApiSuccess<T> {
    success: true;
    data: T;
}
//# sourceMappingURL=common.d.ts.map