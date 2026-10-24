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
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const format_1 = require("../../common/utils/format");
const audit_service_1 = require("../audit/audit.service");
const test_definition_schema_1 = require("./test-definition.schema");
let CatalogService = class CatalogService {
    testModel;
    panelModel;
    audit;
    constructor(testModel, panelModel, audit) {
        this.testModel = testModel;
        this.panelModel = panelModel;
        this.audit = audit;
    }
    async listTests(query) {
        const filter = {};
        if (query.discipline)
            filter.discipline = query.discipline;
        if (query.active !== undefined)
            filter.active = query.active;
        if (query.q) {
            const needle = query.q.trim();
            filter.$or = [
                { code: { $regex: needle, $options: 'i' } },
                { name: { $regex: needle, $options: 'i' } },
            ];
        }
        const [tests, total] = await Promise.all([
            this.testModel
                .find(filter)
                .sort({ discipline: 1, name: 1 })
                .skip((query.page - 1) * query.limit)
                .limit(query.limit)
                .exec(),
            this.testModel.countDocuments(filter).exec(),
        ]);
        return (0, format_1.buildPaginated)(tests.map((test) => this.toTest(test)), total, query.page, query.limit);
    }
    async listPanels(query) {
        const filter = {};
        if (query.discipline)
            filter.discipline = query.discipline;
        const [panels, total] = await Promise.all([
            this.panelModel
                .find(filter)
                .sort({ discipline: 1, name: 1 })
                .skip((query.page - 1) * query.limit)
                .limit(query.limit)
                .exec(),
            this.panelModel.countDocuments(filter).exec(),
        ]);
        return (0, format_1.buildPaginated)(panels.map((panel) => this.toPanel(panel)), total, query.page, query.limit);
    }
    async findTest(discipline, code) {
        const test = await this.testModel.findOne({ discipline, code: code.toUpperCase() }).exec();
        return test ? this.toTest(test) : null;
    }
    async createTest(body, actor) {
        const parsed = shared_1.testDefinitionSchema.safeParse(body);
        if (!parsed.success) {
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        }
        const existing = await this.testModel
            .findOne({ discipline: parsed.data.discipline, code: parsed.data.code.toUpperCase() })
            .exec();
        if (existing)
            throw new common_1.ConflictException('A test with this code already exists.');
        const test = await this.testModel.create({
            ...parsed.data,
            code: parsed.data.code.toUpperCase(),
            method: parsed.data.method ?? null,
            active: parsed.data.active ?? true,
            analytes: this.normalizeAnalytes(parsed.data.analytes),
        });
        await this.audit.record({
            action: 'CREATE',
            entityType: 'TestDefinition',
            entityId: test._id.toString(),
            after: this.toTest(test),
            metadata: { actor: actor.userName, discipline: test.discipline },
        });
        return this.toTest(test);
    }
    async updateTest(id, body, actor) {
        const parsed = shared_1.testDefinitionSchema.partial().safeParse(body);
        if (!parsed.success) {
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        }
        const test = await this.testModel.findById(id).exec();
        if (!test)
            throw new common_1.NotFoundException('Test definition not found.');
        const before = this.toTest(test);
        if (parsed.data.code)
            test.code = parsed.data.code.toUpperCase();
        if (parsed.data.name)
            test.name = parsed.data.name;
        if (parsed.data.discipline)
            test.discipline = parsed.data.discipline;
        if (parsed.data.specimenType)
            test.specimenType = parsed.data.specimenType;
        if (parsed.data.method !== undefined)
            test.method = parsed.data.method ?? null;
        if (parsed.data.analytes)
            test.analytes = this.normalizeAnalytes(parsed.data.analytes);
        if (parsed.data.active !== undefined)
            test.active = parsed.data.active;
        await test.save();
        await this.audit.record({
            action: 'UPDATE',
            entityType: 'TestDefinition',
            entityId: test._id.toString(),
            before,
            after: this.toTest(test),
            metadata: { actor: actor.userName },
        });
        return this.toTest(test);
    }
    async createPanel(body, actor) {
        const parsed = shared_1.panelSchema.safeParse(body);
        if (!parsed.success) {
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        }
        const panel = await this.panelModel.create({
            ...parsed.data,
            code: parsed.data.code.toUpperCase(),
            active: parsed.data.active ?? true,
        });
        await this.audit.record({
            action: 'CREATE',
            entityType: 'Panel',
            entityId: panel._id.toString(),
            after: this.toPanel(panel),
            metadata: { actor: actor.userName },
        });
        return this.toPanel(panel);
    }
    normalizeAnalytes(analytes) {
        return analytes.map((analyte) => ({
            ...analyte,
            unit: analyte.unit ?? null,
            formula: analyte.formula ?? null,
            required: analyte.required ?? false,
            criticalLow: analyte.criticalLow ?? null,
            criticalHigh: analyte.criticalHigh ?? null,
            referenceRanges: (analyte.referenceRanges ?? []).map((range) => ({
                low: range.low ?? null,
                high: range.high ?? null,
                sex: range.sex ?? null,
                minAge: range.minAge ?? null,
                maxAge: range.maxAge ?? null,
            })),
        }));
    }
    toTest(test) {
        return {
            id: test._id.toString(),
            discipline: test.discipline,
            code: test.code,
            name: test.name,
            specimenType: test.specimenType,
            method: test.method,
            analytes: test.analytes,
            active: test.active,
            createdAt: test.createdAt.toISOString(),
            updatedAt: test.updatedAt.toISOString(),
        };
    }
    toPanel(panel) {
        return {
            id: panel._id.toString(),
            discipline: panel.discipline,
            code: panel.code,
            name: panel.name,
            testCodes: panel.testCodes,
            active: panel.active,
        };
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(test_definition_schema_1.TestDefinitionModelName)),
    __param(1, (0, mongoose_1.InjectModel)(test_definition_schema_1.PanelModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        audit_service_1.AuditService])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map