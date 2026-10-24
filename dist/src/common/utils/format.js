"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginated = buildPaginated;
exports.escapeRegex = escapeRegex;
exports.toIso = toIso;
exports.toIsoRequired = toIsoRequired;
exports.addHours = addHours;
exports.startOfDay = startOfDay;
exports.endOfDay = endOfDay;
exports.parseDateOnly = parseDateOnly;
exports.auditSnapshot = auditSnapshot;
function buildPaginated(items, total, page, limit) {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return {
        items,
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
    };
}
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function toIso(value) {
    return value ? value.toISOString() : null;
}
function toIsoRequired(value) {
    return (value ?? new Date()).toISOString();
}
function addHours(date, hours) {
    return new Date(date.getTime() + hours * 3_600_000);
}
function startOfDay(date) {
    const result = new Date(date);
    result.setUTCHours(0, 0, 0, 0);
    return result;
}
function endOfDay(date) {
    const result = new Date(date);
    result.setUTCHours(23, 59, 59, 999);
    return result;
}
function parseDateOnly(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}
const SENSITIVE_KEYS = new Set(['passwordHash', 'password', 'refreshTokenHash', 'refreshToken']);
function redact(value) {
    if (Array.isArray(value))
        return value.map((item) => redact(item));
    if (value !== null && typeof value === 'object') {
        const result = {};
        for (const [key, item] of Object.entries(value)) {
            if (SENSITIVE_KEYS.has(key))
                continue;
            result[key] = redact(item);
        }
        return result;
    }
    return value;
}
/** JSON-safe, credential-free snapshot for audit before/after values. */
function auditSnapshot(value) {
    if (value === null || value === undefined)
        return null;
    let plain = value;
    if (typeof value === 'object' && value !== null && 'toObject' in value) {
        const toObject = value.toObject;
        if (typeof toObject === 'function')
            plain = toObject.call(value);
    }
    const serialized = JSON.parse(JSON.stringify(plain));
    const redacted = redact(serialized);
    return redacted !== null && typeof redacted === 'object'
        ? redacted
        : { value: redacted };
}
//# sourceMappingURL=format.js.map