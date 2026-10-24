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
exports.ReportPropagationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const audit_service_1 = require("../../../core/audit/audit.service");
const block_schema_1 = require("../blocks/block.schema");
const case_schema_1 = require("../../../core/cases/case.schema");
const slide_schema_1 = require("../slides/slide.schema");
const case_workflow_service_1 = require("../../../core/custody/case-workflow.service");
const custody_service_1 = require("../../../core/custody/custody.service");
/**
 * Signing out a report is also a physical custody event: reviewed slides become
 * REPORTED (not silently left on the pathologist desk) and their parent blocks do
 * too, so the archive station has a correct worklist.
 */
let ReportPropagationService = class ReportPropagationService {
    caseModel;
    slideModel;
    blockModel;
    custody;
    workflow;
    audit;
    constructor(caseModel, slideModel, blockModel, custody, workflow, audit) {
        this.caseModel = caseModel;
        this.slideModel = slideModel;
        this.blockModel = blockModel;
        this.custody = custody;
        this.workflow = workflow;
        this.audit = audit;
    }
    async markReported(caseId, actor, session) {
        const now = new Date();
        const slides = await this.slideModel
            .find({ caseId, status: 'WITH_PATHOLOGIST' })
            .session(session)
            .exec();
        for (const slide of slides) {
            const before = { status: slide.status, label: slide.label };
            slide.status = 'REPORTED';
            slide.currentStation = 'PATHOLOGIST';
            slide.lastEventAt = now;
            await slide.save({ session });
            await this.custody.append({
                entityType: 'SLIDE',
                entityId: slide._id,
                caseId,
                eventType: 'REPORTED',
                station: 'PATHOLOGIST',
                fromState: 'WITH_PATHOLOGIST',
                toState: 'REPORTED',
                reason: 'Report signed out',
                barcode: slide.barcode,
                metadata: { label: slide.label },
                timestamp: now,
            }, actor, session);
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'Slide',
                entityId: slide._id.toString(),
                caseId: caseId.toString(),
                before,
                after: { status: slide.status, label: slide.label },
                metadata: { trigger: 'report-signout' },
            }, session);
        }
        const blocks = await this.blockModel.find({ caseId, status: 'CUT' }).session(session).exec();
        for (const block of blocks) {
            const before = { status: block.status, label: block.label };
            block.status = 'REPORTED';
            block.currentStation = 'PATHOLOGIST';
            block.lastEventAt = now;
            await block.save({ session });
            await this.custody.append({
                entityType: 'BLOCK',
                entityId: block._id,
                caseId,
                eventType: 'REPORTED',
                station: 'PATHOLOGIST',
                fromState: 'CUT',
                toState: 'REPORTED',
                reason: 'Report signed out',
                barcode: block.barcode,
                metadata: { label: block.label },
                timestamp: now,
            }, actor, session);
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'Block',
                entityId: block._id.toString(),
                caseId: caseId.toString(),
                before,
                after: { status: block.status, label: block.label },
                metadata: { trigger: 'report-signout' },
            }, session);
        }
        return this.workflow.signOut(caseId, actor, session);
    }
};
exports.ReportPropagationService = ReportPropagationService;
exports.ReportPropagationService = ReportPropagationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(1, (0, mongoose_1.InjectModel)(slide_schema_1.SlideModelName)),
    __param(2, (0, mongoose_1.InjectModel)(block_schema_1.BlockModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        custody_service_1.CustodyService,
        case_workflow_service_1.CaseWorkflowService,
        audit_service_1.AuditService])
], ReportPropagationService);
//# sourceMappingURL=report-propagation.service.js.map