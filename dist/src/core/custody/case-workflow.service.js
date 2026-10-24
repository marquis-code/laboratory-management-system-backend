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
exports.CaseWorkflowService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const audit_service_1 = require("../audit/audit.service");
const case_schema_1 = require("../cases/case.schema");
const custody_service_1 = require("./custody.service");
const test_requests_service_1 = require("../test-requests/test-requests.service");
let CaseWorkflowService = class CaseWorkflowService {
    caseModel;
    custody;
    audit;
    testRequests;
    constructor(caseModel, custody, audit, testRequests) {
        this.caseModel = caseModel;
        this.custody = custody;
        this.audit = audit;
        this.testRequests = testRequests;
    }
    /**
     * Move a case forward during the physical workflow. A scan never fails because
     * the case is already ahead; it simply does not regress the case status.
     */
    async advance(caseId, target, actor, session, trigger) {
        const caseDoc = await this.caseModel.findById(caseId).session(session).exec();
        if (!caseDoc)
            throw new common_1.NotFoundException('Case not found.');
        if (shared_1.CASE_STATUS_RANK[caseDoc.status] >= shared_1.CASE_STATUS_RANK[target])
            return caseDoc;
        if (!(0, shared_1.canCaseTransition)(caseDoc.status, target))
            return caseDoc;
        return this.applyStatus(caseDoc, target, actor, session, trigger, {});
    }
    async signOut(caseId, actor, session) {
        const caseDoc = await this.caseModel.findById(caseId).session(session).exec();
        if (!caseDoc)
            throw new common_1.NotFoundException('Case not found.');
        if (caseDoc.status === 'REPORTED' || caseDoc.status === 'AMENDED') {
            throw new common_1.ConflictException('This case has already been reported.');
        }
        if (!(0, shared_1.canCaseTransition)(caseDoc.status, 'REPORTED')) {
            throw new common_1.ConflictException(`A case in ${caseDoc.status.replace('_', ' ').toLowerCase()} cannot be reported yet.`);
        }
        return this.applyStatus(caseDoc, 'REPORTED', actor, session, 'Report signed out', {
            reportedAt: new Date(),
            reportedBy: actor.userId ? new mongoose_2.Types.ObjectId(actor.userId) : null,
        });
    }
    async amend(caseId, actor, session, reason) {
        const caseDoc = await this.caseModel.findById(caseId).session(session).exec();
        if (!caseDoc)
            throw new common_1.NotFoundException('Case not found.');
        if (caseDoc.status !== 'REPORTED' && caseDoc.status !== 'AMENDED') {
            throw new common_1.ConflictException('Only a reported case can be amended.');
        }
        if (caseDoc.status === 'AMENDED') {
            caseDoc.amendedAt = new Date();
            await caseDoc.save({ session });
            await this.testRequests.updateStatusForCase(caseDoc._id, caseDoc.status, session);
            await this.audit.record({
                action: 'AMEND',
                entityType: 'Case',
                entityId: caseDoc._id.toString(),
                caseId: caseDoc._id.toString(),
                before: { status: caseDoc.status },
                after: { status: caseDoc.status },
                metadata: { reason, repeatAmendment: true },
            }, session);
            return caseDoc;
        }
        return this.applyStatus(caseDoc, 'AMENDED', actor, session, 'Report amended', {
            amendedAt: new Date(),
            amendmentReason: reason,
        });
    }
    async applyStatus(caseDoc, target, actor, session, trigger, extra) {
        const from = caseDoc.status;
        caseDoc.status = target;
        caseDoc.statusChangedAt = new Date();
        if (extra.reportedAt)
            caseDoc.reportedAt = extra.reportedAt;
        if (extra.reportedBy !== undefined)
            caseDoc.reportedBy = extra.reportedBy;
        if (extra.amendedAt)
            caseDoc.amendedAt = extra.amendedAt;
        await caseDoc.save({ session });
        await this.testRequests.updateStatusForCase(caseDoc._id, target, session);
        await this.custody.append({
            entityType: 'CASE',
            entityId: caseDoc._id,
            caseId: caseDoc._id,
            eventType: target,
            station: null,
            fromState: from,
            toState: target,
            reason: extra.amendmentReason ?? trigger,
            metadata: { trigger },
        }, actor, session);
        await this.audit.record({
            action: target === 'AMENDED' ? 'AMEND' : target === 'REPORTED' ? 'SIGN_OUT' : 'UPDATE',
            entityType: 'Case',
            entityId: caseDoc._id.toString(),
            caseId: caseDoc._id.toString(),
            before: { status: from },
            after: { status: target },
            metadata: { trigger, ...(extra.amendmentReason ? { reason: extra.amendmentReason } : {}) },
        }, session);
        return caseDoc;
    }
};
exports.CaseWorkflowService = CaseWorkflowService;
exports.CaseWorkflowService = CaseWorkflowService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        custody_service_1.CustodyService,
        audit_service_1.AuditService,
        test_requests_service_1.TestRequestsService])
], CaseWorkflowService);
//# sourceMappingURL=case-workflow.service.js.map