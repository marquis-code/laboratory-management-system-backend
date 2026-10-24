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
exports.TerminologyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const format_1 = require("../../common/utils/format");
const audit_service_1 = require("../../core/audit/audit.service");
const terminology_schema_1 = require("./terminology.schema");
let TerminologyService = class TerminologyService {
    model;
    audit;
    constructor(model, audit) {
        this.model = model;
        this.audit = audit;
    }
    async search(query) {
        const filter = { active: true };
        if (query.system)
            filter.system = query.system;
        if (query.q) {
            const regex = new RegExp(query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            filter.$or = [{ code: regex }, { display: regex }, { synonyms: regex }];
        }
        const limit = Math.min(query.limit ?? 20, 50);
        const docs = await this.model.find(filter).sort({ system: 1, display: 1 }).limit(limit).exec();
        return (0, format_1.buildPaginated)(docs.map((doc) => this.toDto(doc)), docs.length, 1, limit);
    }
    async validate(system, code) {
        const doc = await this.model.findOne({ system, code: code.trim(), active: true }).exec();
        if (!doc) {
            throw new common_1.BadRequestException(`${code} is not a valid ${shared_1.CODING_SYSTEM_LABELS[system]} code in this laboratory's terminology.`);
        }
        return this.toDto(doc);
    }
    async find(system, code) {
        if (!code)
            return null;
        const doc = await this.model.findOne({ system, code: code.trim(), active: true }).exec();
        return doc ? this.toDto(doc) : null;
    }
    async import(dto) {
        let imported = 0;
        for (const code of dto.codes) {
            await this.model
                .updateOne({ system: code.system, code: code.code.trim() }, {
                $set: {
                    display: code.display.trim(),
                    category: code.category?.trim() || null,
                    synonyms: code.synonyms ?? [],
                    active: true,
                },
            }, { upsert: true })
                .exec();
            imported += 1;
        }
        await this.audit.record({
            action: 'IMPORT',
            entityType: 'Terminology',
            after: { imported, systems: [...new Set(dto.codes.map((code) => code.system))] },
        });
        return { imported };
    }
    async seed(codes) {
        let count = 0;
        for (const code of codes) {
            await this.model
                .updateOne({ system: code.system, code: code.code }, {
                $setOnInsert: {
                    system: code.system,
                    code: code.code,
                    display: code.display,
                    category: code.category ?? null,
                    synonyms: code.synonyms ?? [],
                    active: true,
                },
            }, { upsert: true })
                .exec();
            count += 1;
        }
        return count;
    }
    toDto(doc) {
        return {
            id: doc._id.toString(),
            system: doc.system,
            code: doc.code,
            display: doc.display,
            category: doc.category,
            synonyms: doc.synonyms,
            active: doc.active,
        };
    }
};
exports.TerminologyService = TerminologyService;
exports.TerminologyService = TerminologyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(terminology_schema_1.TerminologyModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        audit_service_1.AuditService])
], TerminologyService);
//# sourceMappingURL=terminology.service.js.map