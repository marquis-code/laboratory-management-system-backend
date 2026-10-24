export declare const DEFAULT_SEQUENCE_WIDTH = 6;
export interface AccessionParts {
    prefix: string;
    year: number;
    sequence: number;
}
/**
 * Validate a per-lab accession format.
 * Supported tokens: {PREFIX}, {YYYY}, {YY}, {SEQ}, {SEQ:n} where n is 1..10.
 * The format must contain {SEQ} or {SEQ:n} so accession numbers stay collision-free.
 */
export declare function validateAccessionFormat(format: string): string | null;
export declare function formatAccession(format: string, parts: AccessionParts): string;
export declare function formatMrn(year: number, sequence: number): string;
/** A, B, C ... Z, AA, AB ... for specimen and block labels. Never use ambiguous I/O. */
export declare function specimenLetter(sequence: number): string;
export declare function blockLabel(specimenSequence: number, blockNumber: number): string;
export declare function slideLabel(block: string, slideNumber: number): string;
export declare function normalizeBarcode(raw: string): string;
export declare function fullName(firstName: string, lastName: string): string;
//# sourceMappingURL=formats.d.ts.map