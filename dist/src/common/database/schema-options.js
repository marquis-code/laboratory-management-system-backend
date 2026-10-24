"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseSchemaOptions = baseSchemaOptions;
/**
 * Shared schema options. The JSON transform adds a string `id` and removes
 * MongoDB internals and credential fields. Serializers still map documents to
 * explicit DTOs — the transform is a safety net, not the API contract.
 */
function baseSchemaOptions(collection) {
    return {
        collection,
        timestamps: true,
        versionKey: false,
        minimize: false,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                const rawId = ret._id;
                if (rawId !== undefined && rawId !== null)
                    ret.id = String(rawId);
                delete ret._id;
                delete ret.__v;
                delete ret.passwordHash;
                delete ret.refreshTokenHash;
                delete ret.labId;
                return ret;
            },
        },
        toObject: {
            virtuals: true,
            transform: (_doc, ret) => {
                const rawId = ret._id;
                if (rawId !== undefined && rawId !== null)
                    ret.id = String(rawId);
                return ret;
            },
        },
    };
}
//# sourceMappingURL=schema-options.js.map