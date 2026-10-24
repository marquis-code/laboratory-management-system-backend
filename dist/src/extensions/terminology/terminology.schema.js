"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminologySchema = exports.TerminologyModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.TerminologyModelName = 'TerminologyCode';
exports.TerminologySchema = new mongoose_1.Schema({
    system: { type: String, enum: shared_1.CODING_SYSTEMS, required: true },
    code: { type: String, required: true, trim: true, maxlength: 40 },
    display: { type: String, required: true, trim: true, maxlength: 240 },
    category: { type: String, default: null, maxlength: 80 },
    synonyms: { type: [String], default: [] },
    active: { type: Boolean, default: true },
}, (0, schema_options_1.baseSchemaOptions)('terminology_codes'));
exports.TerminologySchema.plugin(tenant_plugin_1.tenantPlugin);
exports.TerminologySchema.index({ labId: 1, system: 1, code: 1 }, { unique: true });
exports.TerminologySchema.index({ labId: 1, system: 1, active: 1, display: 1 });
//# sourceMappingURL=terminology.schema.js.map