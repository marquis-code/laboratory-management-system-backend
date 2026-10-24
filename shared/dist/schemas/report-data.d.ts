import { z } from 'zod';
export declare const reportDataSchema: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">, z.ZodNull]>>;
export type ReportDataInput = z.infer<typeof reportDataSchema>;
//# sourceMappingURL=report-data.d.ts.map