"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelSchema = exports.PanelModelName = exports.TestDefinitionSchema = exports.TestDefinitionModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.TestDefinitionModelName = 'TestDefinition';
exports.TestDefinitionSchema = new mongoose_1.Schema({
    discipline: { type: String, enum: shared_1.DISCIPLINES, required: true },
    code: { type: String, required: true, trim: true, uppercase: true, maxlength: 40 },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    specimenType: { type: String, required: true, trim: true, maxlength: 80 },
    method: { type: String, trim: true, maxlength: 120, default: null },
    analytes: { type: mongoose_1.Schema.Types.Mixed, required: true },
    active: { type: Boolean, default: true },
}, (0, schema_options_1.baseSchemaOptions)('test_definitions'));
exports.TestDefinitionSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.TestDefinitionSchema.index({ labId: 1, discipline: 1, code: 1 }, { unique: true });
exports.PanelModelName = 'Panel';
exports.PanelSchema = new mongoose_1.Schema({
    discipline: { type: String, enum: shared_1.DISCIPLINES, required: true },
    code: { type: String, required: true, trim: true, uppercase: true, maxlength: 40 },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    testCodes: { type: [String], default: [] },
    active: { type: Boolean, default: true },
}, (0, schema_options_1.baseSchemaOptions)('panels'));
exports.PanelSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.PanelSchema.index({ labId: 1, discipline: 1, code: 1 }, { unique: true });
void shared_1.TEST_REQUEST_STATUSES;
//# sourceMappingURL=test-definition.schema.js.map