export type TatState = 'ON_TRACK' | 'WARNING' | 'BREACHED' | 'DONE';
export interface TatInfo {
    startedAt: string;
    deadline: string;
    now: string;
    elapsedMs: number;
    remainingMs: number;
    elapsedPercent: number;
    remainingPercent: number;
    hoursRemaining: number;
    state: TatState;
}
/**
 * TAT is measured from receipt, not from report opening, and the warning is
 * raised before the breach — at `warningPercent` of the window (80% by default).
 */
export declare function computeTat(startedAt: string | Date, deadline: string | Date, options?: {
    done?: boolean;
    warningPercent?: number;
    now?: Date;
}): TatInfo;
export declare function describeTat(tat: TatInfo): string;
export declare function formatDurationHours(hours: number): string;
//# sourceMappingURL=tat.d.ts.map