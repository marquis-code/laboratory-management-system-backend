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
var QaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QaService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const node_crypto_1 = require("node:crypto");
const actor_1 = require("../../common/utils/actor");
const format_1 = require("../../common/utils/format");
const audit_service_1 = require("../../core/audit/audit.service");
const case_schema_1 = require("../../core/cases/case.schema");
const lab_schema_1 = require("../../core/labs/lab.schema");
const notification_service_1 = require("../../core/notifications/notification.service");
const patient_schema_1 = require("../../core/patients/patient.schema");
const report_schema_1 = require("../../core/reports/report.schema");
const user_schema_1 = require("../../core/users/user.schema");
const qa_review_schema_1 = require("./qa-review.schema");
let QaService = QaService_1 = class QaService {
    connection;
    qaModel;
    caseModel;
    patientModel;
    reportModel;
    userModel;
    labModel;
    notifications;
    audit;
    logger = new common_1.Logger(QaService_1.name);
    constructor(connection, qaModel, caseModel, patientModel, reportModel, userModel, labModel, notifications, audit) {
        this.connection = connection;
        this.qaModel = qaModel;
        this.caseModel = caseModel;
        this.patientModel = patientModel;
        this.reportModel = reportModel;
        this.userModel = userModel;
        this.labModel = labModel;
        this.notifications = notifications;
        this.audit = audit;
    }
    async list(query, user) {
        const filter = {};
        if (query.status)
            filter.status = query.status;
        if (query.type)
            filter.type = query.type;
        if (query.reviewerId)
            filter.reviewerId = new mongoose_2.Types.ObjectId(query.reviewerId);
        if (query.mine)
            filter.reviewerId = new mongoose_2.Types.ObjectId(user.id);
        const [docs, total] = await Promise.all([
            this.qaModel
                .find(filter)
                .sort({ status: 1, dueAt: 1, createdAt: -1 })
                .skip((query.page - 1) * query.limit)
                .limit(query.limit)
                .exec(),
            this.qaModel.countDocuments(filter).exec(),
        ]);
        return (0, format_1.buildPaginated)(await Promise.all(docs.map((doc) => this.toDto(doc))), total, query.page, query.limit);
    }
    async stats(user) {
        const [pending, inReview, agreed, discrepant, overdue, lab] = await Promise.all([
            this.qaModel.countDocuments({ status: 'PENDING' }).exec(),
            this.qaModel.countDocuments({ status: { $in: ['ASSIGNED', 'IN_REVIEW'] } }).exec(),
            this.qaModel.countDocuments({ status: 'AGREED' }).exec(),
            this.qaModel.countDocuments({ status: 'DISCREPANT' }).exec(),
            this.qaModel
                .countDocuments({
                status: { $in: ['PENDING', 'ASSIGNED', 'IN_REVIEW'] },
                dueAt: { $lt: new Date() },
            })
                .exec(),
            this.labModel.findById(user.labId).exec(),
        ]);
        return {
            pending,
            inReview,
            agreed,
            discrepant,
            overdue,
            samplingPercent: lab?.qaSamplingPercent ?? 10,
        };
    }
    async get(id) {
        const doc = await this.qaModel.findById(id).exec();
        if (!doc)
            throw new common_1.NotFoundException('QA review not found.');
        return this.toDto(doc);
    }
    async create(dto, user) {
        const caseDoc = await this.caseModel.findById(dto.caseId).exec();
        if (!caseDoc)
            throw new common_1.NotFoundException('Case not found.');
        const report = dto.reportId
            ? await this.reportModel.findOne({ _id: dto.reportId, caseId: caseDoc._id }).exec()
            : await this.reportModel.findOne({ caseId: caseDoc._id }).exec();
        if (dto.reportId && !report)
            throw new common_1.NotFoundException('Report not found.');
        if (report) {
            const existing = await this.qaModel
                .findOne({ reportId: report._id, status: { $in: ['PENDING', 'ASSIGNED', 'IN_REVIEW'] } })
                .exec();
            if (existing)
                throw new common_1.ConflictException('An active QA review already exists for this report.');
        }
        const reviewer = dto.reviewerId ? await this.assertReviewer(dto.reviewerId) : null;
        const patient = await this.patientModel.findById(caseDoc.patientId).exec();
        const now = new Date();
        const review = new this.qaModel({
            caseId: caseDoc._id,
            reportId: report?._id ?? null,
            type: dto.type,
            status: reviewer ? 'ASSIGNED' : 'PENDING',
            reason: dto.reason.trim(),
            requestedBy: new mongoose_2.Types.ObjectId(user.id),
            reviewerId: reviewer?._id ?? null,
            dueAt: dto.dueAt ? new Date(dto.dueAt) : new Date(now.getTime() + 14 * 86_400_000),
            originalDiagnosis: report ? diagnosisFrom(report) : caseDoc.clinicalDiagnosis,
            metadata: { patientName: patient ? `${patient.firstName} ${patient.lastName}` : null },
        });
        await review.save();
        await this.audit.record({
            action: 'QA',
            entityType: 'QaReview',
            entityId: review._id.toString(),
            caseId: caseDoc._id.toString(),
            after: { type: review.type, status: review.status, reviewerId: reviewer?._id.toString() },
            metadata: { reason: review.reason },
        });
        if (reviewer && reviewer._id.toString() !== user.id) {
            await this.notifyReviewer(review, reviewer);
        }
        return this.toDto(review);
    }
    async assign(id, dto, user) {
        const reviewer = await this.assertReviewer(dto.reviewerId);
        const review = await this.qaModel.findById(id).exec();
        if (!review)
            throw new common_1.NotFoundException('QA review not found.');
        if (review.status === 'CLOSED' || review.status === 'CANCELLED') {
            throw new common_1.ConflictException('A closed QA review cannot be reassigned.');
        }
        review.reviewerId = reviewer._id;
        review.status = review.status === 'PENDING' ? 'ASSIGNED' : review.status;
        if (dto.dueAt)
            review.dueAt = new Date(dto.dueAt);
        await review.save();
        await this.audit.record({
            action: 'QA',
            entityType: 'QaReview',
            entityId: review._id.toString(),
            caseId: review.caseId.toString(),
            after: { reviewerId: reviewer._id.toString(), status: review.status },
            metadata: { event: 'assigned', by: user.email },
        });
        await this.notifyReviewer(review, reviewer);
        return this.toDto(review);
    }
    async start(id, dto, user) {
        const review = await this.qaModel.findById(id).exec();
        if (!review)
            throw new common_1.NotFoundException('QA review not found.');
        if (review.reviewerId?.toString() !== user.id &&
            user.role !== 'LAB_ADMIN' &&
            user.role !== 'SUPER_ADMIN') {
            throw new common_1.BadRequestException('Only the assigned reviewer can start this QA review.');
        }
        if (review.status === 'PENDING') {
            review.reviewerId = new mongoose_2.Types.ObjectId(user.id);
        }
        review.status = 'IN_REVIEW';
        review.startedAt = review.startedAt ?? new Date();
        if (dto.findings)
            review.findings = dto.findings.trim();
        await review.save();
        await this.audit.record({
            action: 'QA',
            entityType: 'QaReview',
            entityId: review._id.toString(),
            caseId: review.caseId.toString(),
            after: { status: review.status, reviewerId: review.reviewerId?.toString() },
            metadata: { event: 'started' },
        });
        return this.toDto(review);
    }
    async complete(id, dto, user) {
        const review = await this.qaModel.findById(id).exec();
        if (!review)
            throw new common_1.NotFoundException('QA review not found.');
        if (review.reviewerId?.toString() !== user.id &&
            user.role !== 'LAB_ADMIN' &&
            user.role !== 'SUPER_ADMIN') {
            throw new common_1.BadRequestException('Only the assigned reviewer can complete this QA review.');
        }
        if (dto.outcome === 'DISCREPANT' && !dto.disagreementCode) {
            throw new common_1.BadRequestException('Select a discrepancy code when the review disagrees.');
        }
        if (dto.outcome === 'DISCREPANT' && !dto.severity) {
            throw new common_1.BadRequestException('Set a severity for the discrepancy.');
        }
        review.status = dto.outcome;
        review.reviewDiagnosis = dto.reviewDiagnosis?.trim() || null;
        review.discrepancyCode = dto.disagreementCode ?? null;
        review.severity = dto.severity ?? null;
        review.findings = dto.findings.trim();
        review.actionPlan = dto.actionPlan?.trim() || null;
        review.completedAt = new Date();
        await review.save();
        await this.audit.record({
            action: 'QA',
            entityType: 'QaReview',
            entityId: review._id.toString(),
            caseId: review.caseId.toString(),
            after: {
                status: review.status,
                discrepancyCode: review.discrepancyCode,
                severity: review.severity,
            },
            metadata: { findings: review.findings },
        });
        await this.notifications.send({
            labId: user.labId,
            type: dto.outcome === 'DISCREPANT' ? 'QA_DISCREPANCY' : 'QA_AGREED',
            title: dto.outcome === 'DISCREPANT' ? 'QA discrepancy recorded' : 'Peer review agreed',
            body: dto.outcome === 'DISCREPANT'
                ? `A ${dto.severity?.toLowerCase()} discrepancy (${dto.disagreementCode}) was recorded for a peer review.`
                : 'A peer review was completed with agreement.',
            caseId: review.caseId.toString(),
            entityType: 'QaReview',
            entityId: review._id.toString(),
            role: 'LAB_ADMIN',
        });
        return this.toDto(review);
    }
    async maybeCreatePeerReview(reportId, user) {
        try {
            const report = await this.reportModel.findById(reportId).exec();
            if (!report)
                return null;
            const lab = await this.labModel.findById(user.labId).exec();
            const percent = lab?.qaSamplingPercent ?? 10;
            if (percent <= 0)
                return null;
            if ((0, node_crypto_1.randomInt)(0, 100) >= percent)
                return null;
            const existing = await this.qaModel
                .findOne({ reportId: report._id, status: { $in: ['PENDING', 'ASSIGNED', 'IN_REVIEW'] } })
                .exec();
            if (existing)
                return null;
            const caseDoc = await this.caseModel.findById(report.caseId).exec();
            if (!caseDoc)
                return null;
            const reviewers = await this.userModel
                .find({ role: 'PATHOLOGIST', active: true, _id: { $ne: new mongoose_2.Types.ObjectId(user.id) } })
                .exec();
            const reviewer = reviewers.length > 0 ? reviewers[(0, node_crypto_1.randomInt)(0, reviewers.length)] : null;
            const patient = await this.patientModel.findById(caseDoc.patientId).exec();
            const review = new this.qaModel({
                caseId: report.caseId,
                reportId: report._id,
                type: 'PEER_REVIEW',
                status: reviewer ? 'ASSIGNED' : 'PENDING',
                reason: `Random ${percent}% peer-review sample`,
                requestedBy: new mongoose_2.Types.ObjectId(user.id),
                reviewerId: reviewer?._id ?? null,
                dueAt: new Date(Date.now() + 14 * 86_400_000),
                originalDiagnosis: diagnosisFrom(report),
                metadata: {
                    patientName: patient ? `${patient.firstName} ${patient.lastName}` : null,
                    sampled: true,
                },
            });
            await review.save();
            await this.audit.record({
                action: 'QA',
                entityType: 'QaReview',
                entityId: review._id.toString(),
                caseId: report.caseId.toString(),
                after: { type: review.type, status: review.status, sampled: true },
                metadata: { samplingPercent: percent },
            });
            if (reviewer)
                await this.notifyReviewer(review, reviewer);
            return this.toDto(review);
        }
        catch (error) {
            this.logger.warn({ err: error, reportId }, 'Could not create a sampled peer review.');
            return null;
        }
    }
    async assertReviewer(id) {
        const reviewer = await this.userModel.findById(id).exec();
        if (!reviewer || !reviewer.active || reviewer.role !== 'PATHOLOGIST') {
            throw new common_1.BadRequestException('Select an active pathologist as the reviewer.');
        }
        return reviewer;
    }
    async notifyReviewer(review, reviewer) {
        await this.notifications.send({
            labId: review.labId.toString(),
            type: 'QA_ASSIGNED',
            title: 'QA review assigned',
            body: `A ${review.type.replace('_', ' ').toLowerCase()} is waiting for your review. Due ${review.dueAt?.toISOString().slice(0, 10) ?? 'soon'}.`,
            caseId: review.caseId.toString(),
            entityType: 'QaReview',
            entityId: review._id.toString(),
            userId: reviewer._id.toString(),
            channels: ['IN_APP', ...(reviewer.email ? ['EMAIL'] : [])],
            recipient: { email: reviewer.email, name: reviewer.name },
        });
    }
    async toDto(doc) {
        const [caseDoc, patient, report, requester, reviewer] = await Promise.all([
            this.caseModel.findById(doc.caseId).exec(),
            this.caseModel
                .findById(doc.caseId)
                .exec()
                .then((item) => (item ? this.patientModel.findById(item.patientId).exec() : null)),
            doc.reportId ? this.reportModel.findById(doc.reportId).exec() : null,
            doc.requestedBy ? this.userModel.findById(doc.requestedBy).exec() : null,
            doc.reviewerId ? this.userModel.findById(doc.reviewerId).exec() : null,
        ]);
        return {
            id: doc._id.toString(),
            caseId: doc.caseId.toString(),
            accessionNumber: caseDoc?.accessionNumber ?? '—',
            patientName: patient ? `${patient.firstName} ${patient.lastName}` : '—',
            reportId: doc.reportId ? doc.reportId.toString() : null,
            protocolTitle: report?.protocolSnapshot.title ?? null,
            type: doc.type,
            status: doc.status,
            reason: doc.reason,
            requestedBy: requester ? this.userSummary(requester) : null,
            reviewer: reviewer ? this.userSummary(reviewer) : null,
            dueAt: doc.dueAt ? doc.dueAt.toISOString() : null,
            originalDiagnosis: doc.originalDiagnosis,
            reviewDiagnosis: doc.reviewDiagnosis,
            discrepancyCode: doc.discrepancyCode,
            severity: doc.severity,
            findings: doc.findings,
            actionPlan: doc.actionPlan,
            completedAt: doc.completedAt ? doc.completedAt.toISOString() : null,
            createdAt: doc.createdAt.toISOString(),
        };
    }
    userSummary(user) {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            subspecialties: user.subspecialties,
            disciplines: user.disciplines ?? [],
        };
    }
};
exports.QaService = QaService;
exports.QaService = QaService = QaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(1, (0, mongoose_1.InjectModel)(qa_review_schema_1.QaReviewModelName)),
    __param(2, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(3, (0, mongoose_1.InjectModel)(patient_schema_1.PatientModelName)),
    __param(4, (0, mongoose_1.InjectModel)(report_schema_1.ReportModelName)),
    __param(5, (0, mongoose_1.InjectModel)(user_schema_1.UserModelName)),
    __param(6, (0, mongoose_1.InjectModel)(lab_schema_1.LabModelName)),
    __metadata("design:paramtypes", [Function, mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        notification_service_1.NotificationService,
        audit_service_1.AuditService])
], QaService);
function diagnosisFrom(report) {
    for (const key of ['finalDiagnosis', 'diagnosis', 'histologicType', 'tumourType']) {
        const value = report.data[key];
        if (typeof value === 'string' && value.trim().length > 0)
            return value.trim();
    }
    return report.narrative.slice(0, 600) || null;
}
void actor_1.currentActor;
//# sourceMappingURL=qa.service.js.map