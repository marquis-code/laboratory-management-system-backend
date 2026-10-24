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
exports.WorklistService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const cases_service_1 = require("../cases/cases.service");
const case_schema_1 = require("../cases/case.schema");
const labs_service_1 = require("../labs/labs.service");
const test_requests_service_1 = require("../test-requests/test-requests.service");
const case_artifacts_1 = require("../cases/case-artifacts");
let WorklistService = class WorklistService {
    caseModel;
    artifacts;
    casesService;
    testRequests;
    labsService;
    constructor(caseModel, artifacts, casesService, testRequests, labsService) {
        this.caseModel = caseModel;
        this.artifacts = artifacts;
        this.casesService = casesService;
        this.testRequests = testRequests;
        this.labsService = labsService;
    }
    async getWorklist(query, user) {
        const assigned = query.assigned ?? 'all';
        const limit = query.limit ?? 50;
        const activeStatuses = query.status
            ? [query.status]
            : ['RECEIVED', 'IN_PROGRESS', 'PENDING_REVIEW'];
        const filter = {
            status: query.status ?? { $in: [...activeStatuses] },
        };
        if (query.priority)
            filter.priority = query.priority;
        if (query.subspecialty)
            filter.subspecialty = query.subspecialty;
        if (query.pathologistId) {
            filter.assignedPathologistId = new mongoose_2.Types.ObjectId(query.pathologistId);
        }
        if (query.discipline) {
            const caseIds = await this.testRequests.caseIdsForDiscipline(query.discipline);
            filter._id = { $in: caseIds };
        }
        else {
            const allowed = this.clinicalDisciplines(user);
            if (allowed.length > 0) {
                const caseIdSets = await Promise.all(allowed.map((discipline) => this.testRequests.caseIdsForDiscipline(discipline)));
                filter._id = { $in: caseIdSets.flat() };
            }
        }
        if (assigned === 'me') {
            filter.assignedPathologistId = new mongoose_2.Types.ObjectId(user.id);
        }
        else if (assigned === 'unassigned') {
            filter.assignedPathologistId = null;
        }
        const [cases, total, lab] = await Promise.all([
            this.caseModel
                .find(filter)
                .sort({ priorityRank: 1, tatDeadline: 1, receivedAt: 1 })
                .limit(limit)
                .exec(),
            this.caseModel.countDocuments(filter).exec(),
            this.labsService.getById(user.labId),
        ]);
        const decorated = await this.casesService.decorateCases(cases);
        const caseIds = cases.map((caseDoc) => caseDoc._id);
        const requestMap = await this.testRequests.forCases(caseIds);
        const counts = await this.artifacts.metrics('HISTOPATHOLOGY', caseIds.map((id) => id.toString()));
        const items = decorated.map((caseItem, index) => {
            const caseDoc = cases[index];
            if (!caseDoc)
                throw new Error('Case decoration lost ordering.');
            const count = counts.get(caseItem.id) ?? { total: 0, pending: 0, stained: 0 };
            return {
                case: caseItem,
                testRequests: requestMap.get(caseItem.id) ?? [],
                totalSlides: count.total,
                pendingSlides: count.pending,
                stainedSlides: count.stained,
                reportStatus: caseItem.report?.status ?? null,
                tat: (0, shared_1.computeTat)(caseDoc.receivedAt, caseDoc.tatDeadline, {
                    warningPercent: lab.tatWarningPercent,
                    done: Boolean(caseItem.report?.signedOutAt),
                }),
            };
        });
        return {
            items,
            total,
            generatedAt: new Date().toISOString(),
            summary: {
                frozen: items.filter((item) => item.case.priority === 'FROZEN').length,
                urgent: items.filter((item) => item.case.priority === 'URGENT').length,
                overdue: items.filter((item) => item.tat.state === 'BREACHED').length,
                awaitingReview: items.filter((item) => item.pendingSlides > 0).length,
            },
        };
    }
    clinicalDisciplines(user) {
        if (user.role === 'SUPER_ADMIN' || user.role === 'LAB_ADMIN')
            return [];
        if (user.role === 'PATHOLOGIST' || user.role === 'SCIENTIST' || user.role === 'TECHNOLOGIST') {
            return user.disciplines.length > 0 ? user.disciplines : ['HISTOPATHOLOGY'];
        }
        return [];
    }
};
exports.WorklistService = WorklistService;
exports.WorklistService = WorklistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        case_artifacts_1.CaseArtifactRegistry,
        cases_service_1.CasesService,
        test_requests_service_1.TestRequestsService,
        labs_service_1.LabsService])
], WorklistService);
//# sourceMappingURL=worklist.service.js.map