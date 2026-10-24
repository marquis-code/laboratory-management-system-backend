"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAccessTokenPayload = isAccessTokenPayload;
exports.isRefreshTokenPayload = isRefreshTokenPayload;
const ROLE_SET = new Set([
    'SUPER_ADMIN',
    'LAB_ADMIN',
    'RECEPTIONIST',
    'PHLEBOTOMIST',
    'GROSSER',
    'TECHNOLOGIST',
    'SCIENTIST',
    'PATHOLOGIST',
    'REFERRER',
]);
function isAccessTokenPayload(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    const candidate = value;
    return (candidate.type === 'access' &&
        typeof candidate.sub === 'string' &&
        typeof candidate.labId === 'string' &&
        typeof candidate.role === 'string' &&
        ROLE_SET.has(candidate.role) &&
        typeof candidate.name === 'string' &&
        typeof candidate.email === 'string');
}
function isRefreshTokenPayload(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    const candidate = value;
    return (candidate.type === 'refresh' &&
        typeof candidate.sub === 'string' &&
        typeof candidate.labId === 'string' &&
        typeof candidate.jti === 'string');
}
//# sourceMappingURL=authenticated-user.js.map