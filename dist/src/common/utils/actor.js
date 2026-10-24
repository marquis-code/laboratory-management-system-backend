"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentActor = currentActor;
exports.requestAuditContext = requestAuditContext;
const tenant_context_1 = require("../context/tenant-context");
const request_context_1 = require("../context/request-context");
function currentActor(fallbackName = 'System') {
    const tenant = (0, tenant_context_1.currentTenant)();
    return {
        userId: tenant?.userId ?? null,
        userName: tenant?.userName ?? fallbackName,
        userRole: tenant?.userRole ?? null,
    };
}
function requestAuditContext() {
    const request = (0, request_context_1.getRequestContext)();
    return {
        ip: request?.ip ?? null,
        userAgent: request?.userAgent ?? null,
        requestId: request?.requestId ?? null,
    };
}
//# sourceMappingURL=actor.js.map