"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAppendOnly = makeAppendOnly;
/**
 * Makes a collection append-only at the ODM layer: documents can be inserted,
 * but save/update/delete calls are rejected. Custody events, audit logs and
 * signed report versions must never be rewritten.
 */
function makeAppendOnly(schema, label) {
    schema.pre('save', function () {
        if (!this.isNew) {
            throw new Error(`${label} is append-only and cannot be modified.`);
        }
    });
    schema.pre(/^(update|delete|replace|findOneAnd)/, function () {
        throw new Error(`${label} is append-only and cannot be updated or deleted.`);
    });
}
//# sourceMappingURL=append-only.js.map