"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWithRequestContext = runWithRequestContext;
exports.getRequestContext = getRequestContext;
exports.getRequestId = getRequestId;
const node_async_hooks_1 = require("node:async_hooks");
const storage = new node_async_hooks_1.AsyncLocalStorage();
function runWithRequestContext(context, fn) {
    return storage.run(context, fn);
}
function getRequestContext() {
    return storage.getStore();
}
function getRequestId() {
    return storage.getStore()?.requestId ?? null;
}
//# sourceMappingURL=request-context.js.map