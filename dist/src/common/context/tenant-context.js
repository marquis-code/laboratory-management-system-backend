"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantContextMissingError = void 0;
exports.runWithTenant = runWithTenant;
exports.runWithSystemTenant = runWithSystemTenant;
exports.currentTenant = currentTenant;
exports.requireTenant = requireTenant;
const node_async_hooks_1 = require("node:async_hooks");
class TenantContextMissingError extends Error {
    constructor() {
        super('Tenant context is missing. Refusing to run an unscoped database operation.');
        this.name = 'TenantContextMissingError';
    }
}
exports.TenantContextMissingError = TenantContextMissingError;
const storage = new node_async_hooks_1.AsyncLocalStorage();
function runWithTenant(store, fn) {
    return storage.run(store, fn);
}
function runWithSystemTenant(reason, labId, fn) {
    return storage.run({ labId, system: true, reason }, fn);
}
function currentTenant() {
    return storage.getStore();
}
function requireTenant() {
    const store = storage.getStore();
    if (!store)
        throw new TenantContextMissingError();
    return store;
}
//# sourceMappingURL=tenant-context.js.map