"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeTat = computeTat;
exports.describeTat = describeTat;
exports.formatDurationHours = formatDurationHours;
const constants_1 = require("./constants");
/**
 * TAT is measured from receipt, not from report opening, and the warning is
 * raised before the breach — at `warningPercent` of the window (80% by default).
 */
function computeTat(startedAt, deadline, options = {}) {
    const start = new Date(startedAt).getTime();
    const end = new Date(deadline).getTime();
    const now = (options.now ?? new Date()).getTime();
    const warningPercent = options.warningPercent ?? constants_1.DEFAULT_TAT_WARNING_PERCENT;
    const total = Math.max(end - start, 1);
    const elapsed = Math.max(now - start, 0);
    const elapsedPercent = Math.min(100, Math.round((elapsed / total) * 1000) / 10);
    const remainingMs = end - now;
    const remainingPercent = Math.max(0, Math.min(100, 100 - elapsedPercent));
    let state;
    if (options.done) {
        state = 'DONE';
    }
    else if (remainingMs <= 0) {
        state = 'BREACHED';
    }
    else if (elapsedPercent >= warningPercent) {
        state = 'WARNING';
    }
    else {
        state = 'ON_TRACK';
    }
    return {
        startedAt: new Date(start).toISOString(),
        deadline: new Date(end).toISOString(),
        now: new Date(now).toISOString(),
        elapsedMs: elapsed,
        remainingMs,
        elapsedPercent,
        remainingPercent,
        hoursRemaining: Math.round((remainingMs / 3_600_000) * 10) / 10,
        state,
    };
}
function describeTat(tat) {
    if (tat.state === 'DONE')
        return 'Reported';
    if (tat.state === 'BREACHED') {
        const overdueHours = Math.abs(tat.hoursRemaining);
        return `Overdue by ${overdueHours}h`;
    }
    if (tat.hoursRemaining < 1)
        return `${Math.max(1, Math.round(tat.remainingMs / 60_000))} min left`;
    return `${tat.hoursRemaining}h left`;
}
function formatDurationHours(hours) {
    if (!Number.isFinite(hours))
        return '—';
    if (hours < 1)
        return `${Math.max(1, Math.round(hours * 60))}m`;
    if (hours < 24)
        return `${Math.round(hours * 10) / 10}h`;
    const days = Math.floor(hours / 24);
    const rest = Math.round(hours % 24);
    return rest === 0 ? `${days}d` : `${days}d ${rest}h`;
}
//# sourceMappingURL=tat.js.map