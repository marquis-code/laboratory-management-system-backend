"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantPlugin = tenantPlugin;
const mongoose_1 = require("mongoose");
const tenant_context_1 = require("../context/tenant-context");
function containsLabId(value) {
    if (value === null || typeof value !== 'object')
        return false;
    return Object.keys(value).some((key) => key === 'labId' || key.startsWith('labId.'));
}
function rejectLabIdMutation(update) {
    if (update === null || update === undefined)
        return;
    if (Array.isArray(update)) {
        throw new Error('Aggregation-pipeline updates are not permitted on tenant collections.');
    }
    const doc = update;
    if (containsLabId(doc.$set) || containsLabId(doc.$setOnInsert) || containsLabId(doc.$unset)) {
        throw new Error('labId is immutable and cannot be changed by an update.');
    }
}
function applyTenantFilter(query) {
    const store = (0, tenant_context_1.currentTenant)();
    if (store?.system)
        return;
    const tenant = (0, tenant_context_1.requireTenant)();
    const filter = query.getFilter();
    filter.labId = new mongoose_1.Types.ObjectId(tenant.labId);
    query.setQuery(filter);
}
/**
 * Multi-tenancy is enforced here, not by remembering `.where({ labId })` in every
 * service. Every plugin-enabled schema gets an immutable labId; every read and
 * write query is scoped to the async tenant context established from the JWT.
 *
 * There is no request body path that can set or override the tenant. The only
 * bypass is `runWithSystemTenant`, used for public verification and seeding.
 */
function tenantPlugin(schema) {
    schema.add({
        labId: {
            type: mongoose_1.Types.ObjectId,
            ref: 'Lab',
            required: true,
            immutable: true,
            index: true,
        },
    });
    schema.pre(/^(find|count|distinct|update|delete|replace)/, function () {
        applyTenantFilter(this);
        const operation = this.op;
        if (operation && (operation.startsWith('update') || operation.startsWith('replace'))) {
            rejectLabIdMutation(this.getUpdate());
        }
    });
    schema.pre('aggregate', function () {
        const store = (0, tenant_context_1.currentTenant)();
        if (store?.system)
            return;
        const tenant = (0, tenant_context_1.requireTenant)();
        this.pipeline().unshift({ $match: { labId: new mongoose_1.Types.ObjectId(tenant.labId) } });
    });
    schema.pre('validate', function () {
        const store = (0, tenant_context_1.currentTenant)();
        if (!this.isNew) {
            if (this.isModified('labId')) {
                throw new Error('labId is immutable.');
            }
            return;
        }
        if (!store)
            throw new tenant_context_1.TenantContextMissingError();
        if (!this.labId) {
            if (store.system && !store.labId) {
                throw new Error('System writes must provide an explicit labId.');
            }
            this.labId = new mongoose_1.Types.ObjectId(store.labId);
            return;
        }
        if (!store.system && this.labId.toString() !== store.labId) {
            throw new Error('Cross-tenant write rejected.');
        }
    });
    schema.pre('insertMany', function (next, docs) {
        const store = (0, tenant_context_1.currentTenant)();
        if (!store) {
            next(new tenant_context_1.TenantContextMissingError());
            return;
        }
        try {
            for (const doc of docs) {
                if (!doc.labId) {
                    if (store.system && !store.labId) {
                        throw new Error('System writes must provide an explicit labId.');
                    }
                    doc.labId = new mongoose_1.Types.ObjectId(store.labId);
                }
                else if (!store.system && String(doc.labId) !== store.labId) {
                    throw new Error('Cross-tenant write rejected.');
                }
            }
            next();
        }
        catch (error) {
            next(error instanceof Error ? error : new Error(String(error)));
        }
    });
}
//# sourceMappingURL=tenant.plugin.js.map