"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const actor_1 = require("../../common/utils/actor");
const audit_service_1 = require("../audit/audit.service");
const rule_schema_1 = require("./rule.schema");
const rule_evaluator_1 = require("./rule-evaluator");
let RulesService = class RulesService {
    model;
    executionModel;
    audit;
    constructor(model, executionModel, audit) {
        this.model = model;
        this.executionModel = executionModel;
        this.audit = audit;
    }
    async list(discipline, active) {
        const filter = {};
        if (discipline)
            filter.discipline = discipline;
        if (active !== undefined)
            filter.active = active;
        const rules = await this.model.find(filter).sort({ priority: 1, name: 1 }).exec();
        return rules.map((rule) => this.toRule(rule));
    }
    async create(body, actor) {
        const parsed = shared_1.ruleSchema.safeParse(body);
        if (!parsed.success) {
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        }
        const existing = await this.model.findOne({ code: parsed.data.code.toUpperCase() }).exec();
        if (existing)
            throw new common_1.BadRequestException('A rule with this code already exists.');
        const rule = await this.model.create({
            ...parsed.data,
            code: parsed.data.code.toUpperCase(),
            active: parsed.data.active ?? true,
            description: parsed.data.description ?? null,
        });
        await this.audit.record({
            action: 'CREATE',
            entityType: 'Rule',
            entityId: rule._id.toString(),
            after: this.toRule(rule),
            metadata: { actor: actor.userName },
        });
        return this.toRule(rule);
    }
    async update(id, body, actor) {
        const parsed = shared_1.ruleSchema.partial().safeParse(body);
        if (!parsed.success) {
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        }
        const rule = await this.model.findById(id).exec();
        if (!rule)
            throw new common_1.NotFoundException('Rule not found.');
        const before = this.toRule(rule);
        Object.assign(rule, parsed.data);
        if (parsed.data.code)
            rule.code = parsed.data.code.toUpperCase();
        await rule.save();
        await this.audit.record({
            action: 'UPDATE',
            entityType: 'Rule',
            entityId: rule._id.toString(),
            before,
            after: this.toRule(rule),
            metadata: { actor: actor.userName },
        });
        return this.toRule(rule);
    }
    async executions(resultSetId) {
        const filter = {};
        if (resultSetId)
            filter.resultSetId = new mongoose_2.Types.ObjectId(resultSetId);
        const executions = await this.executionModel
            .find(filter)
            .sort({ createdAt: -1 })
            .limit(200)
            .exec();
        return executions.map((execution) => this.toExecution(execution));
    }
    async evaluate(trigger, context, resultSetId, caseId, session) {
        const rules = await this.model
            .find({
            discipline: context.discipline,
            trigger,
            active: true,
            ...(context.testCode
                ? { $or: [{ testCodes: { $size: 0 } }, { testCodes: context.testCode }] }
                : {}),
        })
            .sort({ priority: 1, name: 1 })
            .session(session ?? null)
            .exec();
        const matches = [];
        const actor = (0, actor_1.currentActor)('Rules engine');
        for (const rule of rules) {
            const matched = (0, rule_evaluator_1.evaluateCondition)(rule.conditions, {
                testCode: context.testCode,
                discipline: context.discipline,
                patient: context.patient ?? {},
                previous: context.previous ?? {},
                delta: context.delta ?? {},
                comment: context.comment ?? null,
                values: context.values,
                ...context.values,
            });
            const message = this.messageFor(rule, matched, context);
            const execution = await new this.executionModel({
                ruleId: rule._id,
                ruleCode: rule.code,
                ruleName: rule.name,
                resultSetId,
                caseId,
                trigger,
                matched,
                actions: matched ? rule.actions.map((action) => action.type) : [],
                message,
            }).save({ session });
            if (matched) {
                await this.audit.record({
                    action: 'UPDATE',
                    entityType: 'ResultSet',
                    entityId: resultSetId.toString(),
                    caseId: caseId.toString(),
                    after: { rule: rule.code, actions: rule.actions.map((action) => action.type) },
                    metadata: { trigger, message, automated: true },
                }, session);
                matches.push({
                    rule: this.toRule(rule),
                    actions: rule.actions,
                    message,
                    execution: this.toExecution(execution),
                });
            }
        }
        void actor;
        return matches;
    }
    messageFor(rule, matched, context) {
        if (!matched)
            return null;
        const action = rule.actions.find((item) => item.message)?.message;
        return action ?? `${rule.name} matched for ${context.testCode}.`;
    }
    toRule(rule) {
        return {
            id: rule._id.toString(),
            code: rule.code,
            name: rule.name,
            description: rule.description,
            discipline: rule.discipline,
            testCodes: rule.testCodes,
            trigger: rule.trigger,
            priority: rule.priority,
            active: rule.active,
            conditions: rule.conditions,
            actions: rule.actions,
            createdAt: rule.createdAt.toISOString(),
            updatedAt: rule.updatedAt.toISOString(),
        };
    }
    toExecution(execution) {
        return {
            id: execution._id.toString(),
            ruleId: execution.ruleId.toString(),
            ruleCode: execution.ruleCode,
            ruleName: execution.ruleName,
            resultSetId: execution.resultSetId ? execution.resultSetId.toString() : '',
            caseId: execution.caseId ? execution.caseId.toString() : '',
            trigger: execution.trigger,
            matched: execution.matched,
            actions: execution.actions,
            message: execution.message,
            createdAt: execution.createdAt.toISOString(),
        };
    }
};
exports.RulesService = RulesService;
exports.RulesService = RulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(rule_schema_1.RuleModelName)),
    __param(1, (0, mongoose_1.InjectModel)(rule_schema_1.RuleExecutionModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        audit_service_1.AuditService])
], RulesService);
//# sourceMappingURL=rules.service.js.map