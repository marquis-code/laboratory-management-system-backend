"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolSchema = exports.ProtocolModelName = void 0;
const mongoose_1 = require("mongoose");
const schema_options_1 = require("../../../common/database/schema-options");
const tenant_plugin_1 = require("../../../common/database/tenant.plugin");
exports.ProtocolModelName = 'Protocol';
exports.ProtocolSchema = new mongoose_1.Schema({
    key: { type: String, required: true, lowercase: true, trim: true, maxlength: 60 },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    cancerType: { type: String, required: true, trim: true, maxlength: 120 },
    subspecialty: { type: String, required: true, trim: true, maxlength: 80 },
    version: { type: Number, required: true, default: 1 },
    active: { type: Boolean, default: true },
    content: { type: mongoose_1.Schema.Types.Mixed, required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, (0, schema_options_1.baseSchemaOptions)('protocols'));
exports.ProtocolSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.ProtocolSchema.index({ labId: 1, key: 1, version: 1 }, { unique: true });
exports.ProtocolSchema.index({ labId: 1, active: 1, subspecialty: 1 });
//# sourceMappingURL=protocol.schema.js.map