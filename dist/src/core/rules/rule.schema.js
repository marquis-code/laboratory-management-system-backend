"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleExecutionSchema = exports.RuleSchema = exports.RuleExecutionModelName = exports.RuleModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.RuleModelName = 'Rule';
exports.RuleExecutionModelName = 'RuleExecution';
exports.RuleSchema = new mongoose_1.Schema({
    code: { type: String, required: true, trim: true, maxlength: 60 },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 1_000, default: null },
    discipline: { type: String, enum: shared_1.DISCIPLINES, required: true },
    testCodes: { type: [String], default: [] },
    trigger: { type: String, enum: shared_1.RULE_TRIGGERS, required: true },
    priority: { type: Number, default: 100 },
    active: { type: Boolean, default: true },
    conditions: { type: mongoose_1.Schema.Types.Mixed, required: true },
    actions: { type: [{ type: mongoose_1.Schema.Types.Mixed }], default: [] },
}, (0, schema_options_1.baseSchemaOptions)('rules'));
exports.RuleSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.RuleSchema.index({ labId: 1, code: 1 }, { unique: true });
exports.RuleSchema.index({ labId: 1, discipline: 1, trigger: 1, active: 1 });
void shared_1.RULE_ACTIONS;
exports.RuleExecutionSchema = new mongoose_1.Schema({
    ruleId: { type: mongoose_1.Schema.Types.ObjectId, ref: exports.RuleModelName, required: true },
    ruleCode: { type: String, required: true },
    ruleName: { type: String, required: true },
    resultSetId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ResultSet', default: null },
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', default: null },
    trigger: { type: String, enum: shared_1.RULE_TRIGGERS, required: true },
    matched: { type: Boolean, required: true },
    actions: { type: [String], default: [] },
    message: { type: String, maxlength: 2_000, default: null },
}, (0, schema_options_1.baseSchemaOptions)('rule_executions'));
exports.RuleExecutionSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.RuleExecutionSchema.index({ labId: 1, resultSetId: 1, createdAt: -1 });
exports.RuleExecutionSchema.index({ labId: 1, ruleId: 1, createdAt: -1 });
//# sourceMappingURL=rule.schema.js.map