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
exports.TestRequestsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const format_1 = require("../../common/utils/format");
const entities_1 = require("../../common/serializers/entities");
const case_schema_1 = require("../cases/case.schema");
const test_request_schema_1 = require("./test-request.schema");
const DEFAULT_TEST = {
    HISTOPATHOLOGY: { code: 'HISTO', name: 'Histopathology examination' },
    HAEMATOLOGY: { code: 'FBC', name: 'Full blood count' },
    CHEMICAL_PATHOLOGY: { code: 'CHEM', name: 'Clinical chemistry panel' },
    MICROBIOLOGY: { code: 'MICRO', name: 'Microbiology culture' },
};
let TestRequestsService = class TestRequestsService {
    model;
    caseModel;
    constructor(model, caseModel) {
        this.model = model;
        this.caseModel = caseModel;
    }
    async createForCase(caseDoc, discipline, actor, session, options = {}) {
        const defaults = DEFAULT_TEST[discipline];
        const request = new this.model({
            caseId: caseDoc._id,
            accessionNumber: caseDoc.accessionNumber,
            discipline,
            code: options.code?.trim().toUpperCase() || defaults.code,
            name: options.name?.trim() || defaults.name,
            status: this.statusFromCase(caseDoc.status),
            priority: caseDoc.priority,
            requestedBy: actor.userId ? new mongoose_2.Types.ObjectId(actor.userId) : null,
            requestedAt: caseDoc.receivedAt,
        });
        await request.save({ session });
        return (0, entities_1.toTestRequest)(request);
    }
    async forCase(caseId, allowed) {
        const filter = { caseId: new mongoose_2.Types.ObjectId(caseId) };
        if (allowed)
            filter.discipline = { $in: allowed };
        const requests = await this.model.find(filter).sort({ requestedAt: 1, createdAt: 1 }).exec();
        return requests.map(entities_1.toTestRequest);
    }
    async forCases(caseIds) {
        if (caseIds.length === 0)
            return new Map();
        const requests = await this.model
            .find({ caseId: { $in: caseIds } })
            .sort({ requestedAt: 1 })
            .exec();
        const map = new Map();
        for (const request of requests) {
            const key = request.caseId.toString();
            const list = map.get(key) ?? [];
            list.push((0, entities_1.toTestRequest)(request));
            map.set(key, list);
        }
        return map;
    }
    async list(query, allowed) {
        const filter = {};
        if (allowed)
            filter.discipline = { $in: allowed };
        if (query.caseId)
            filter.caseId = new mongoose_2.Types.ObjectId(query.caseId);
        if (query.discipline)
            filter.discipline = query.discipline;
        if (query.status)
            filter.status = query.status;
        const [requests, total] = await Promise.all([
            this.model
                .find(filter)
                .sort({ requestedAt: -1, createdAt: -1 })
                .skip((query.page - 1) * query.limit)
                .limit(query.limit)
                .exec(),
            this.model.countDocuments(filter).exec(),
        ]);
        return (0, format_1.buildPaginated)(requests.map(entities_1.toTestRequest), total, query.page, query.limit);
    }
    async caseIdsForDiscipline(discipline) {
        const requests = await this.model
            .find({ discipline })
            .select('caseId')
            .distinct('caseId')
            .exec();
        return requests;
    }
    async updateStatusForCase(caseId, caseStatus, session) {
        await this.model
            .updateMany({ caseId }, { $set: { status: this.statusFromCase(caseStatus) } }, { session })
            .exec();
    }
    async markReleased(caseId, session) {
        await this.model.updateMany({ caseId }, { $set: { status: 'RELEASED' } }, { session }).exec();
    }
    async findEntity(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            return null;
        return this.model.findById(id).exec();
    }
    async setStatus(id, status, session) {
        await this.model.updateOne({ _id: id }, { $set: { status } }, { session }).exec();
    }
    async ensureHistopathology(caseId) {
        const caseDoc = await this.caseModel.findById(caseId).exec();
        if (!caseDoc)
            throw new common_1.NotFoundException('Case not found.');
        const existing = await this.model
            .findOne({ caseId: caseDoc._id, discipline: 'HISTOPATHOLOGY' })
            .exec();
        if (existing)
            return (0, entities_1.toTestRequest)(existing);
        const request = await this.model.create({
            caseId: caseDoc._id,
            accessionNumber: caseDoc.accessionNumber,
            discipline: 'HISTOPATHOLOGY',
            code: 'HISTO',
            name: 'Histopathology examination',
            status: this.statusFromCase(caseDoc.status),
            priority: caseDoc.priority,
            requestedBy: caseDoc.createdBy,
            requestedAt: caseDoc.receivedAt,
        });
        return (0, entities_1.toTestRequest)(request);
    }
    statusFromCase(status) {
        switch (status) {
            case 'RECEIVED':
                return 'RECEIVED';
            case 'IN_PROGRESS':
                return 'IN_PROGRESS';
            case 'PENDING_REVIEW':
                return 'PENDING_REVIEW';
            case 'REPORTED':
                return 'VERIFIED';
            case 'AMENDED':
                return 'VERIFIED';
            default:
                return 'RECEIVED';
        }
    }
};
exports.TestRequestsService = TestRequestsService;
exports.TestRequestsService = TestRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(test_request_schema_1.TestRequestModelName)),
    __param(1, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], TestRequestsService);
//# sourceMappingURL=test-requests.service.js.map