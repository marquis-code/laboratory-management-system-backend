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
var ReportsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const shared_1 = require("@lims/shared");
const crypto_1 = require("../../common/utils/crypto");
const tenant_context_1 = require("../../common/context/tenant-context");
const transaction_1 = require("../../common/utils/transaction");
const entities_1 = require("../../common/serializers/entities");
const audit_service_1 = require("../audit/audit.service");
const case_schema_1 = require("../cases/case.schema");
const case_workflow_service_1 = require("../custody/case-workflow.service");
const test_requests_service_1 = require("../test-requests/test-requests.service");
const jobs_service_1 = require("../jobs/jobs.service");
const lab_schema_1 = require("../labs/lab.schema");
const patient_schema_1 = require("../patients/patient.schema");
const qa_service_1 = require("../../extensions/qa/qa.service");
const terminology_service_1 = require("../../extensions/terminology/terminology.service");
const user_schema_1 = require("../users/user.schema");
const report_assembler_service_1 = require("./report-assembler.service");
const report_ports_1 = require("./report-ports");
const report_version_schema_1 = require("./report-version.schema");
const report_schema_1 = require("./report.schema");
let ReportsService = ReportsService_1 = class ReportsService {
    connection;
    reportModel;
    versionModel;
    caseModel;
    patientModel;
    userModel;
    labModel;
    assembler;
    workflow;
    testRequests;
    reportPorts;
    jobs;
    audit;
    config;
    qa;
    terminology;
    logger = new common_1.Logger(ReportsService_1.name);
    constructor(connection, reportModel, versionModel, caseModel, patientModel, userModel, labModel, assembler, workflow, testRequests, reportPorts, jobs, audit, config, qa, terminology) {
        this.connection = connection;
        this.reportModel = reportModel;
        this.versionModel = versionModel;
        this.caseModel = caseModel;
        this.patientModel = patientModel;
        this.userModel = userModel;
        this.labModel = labModel;
        this.assembler = assembler;
        this.workflow = workflow;
        this.testRequests = testRequests;
        this.reportPorts = reportPorts;
        this.jobs = jobs;
        this.audit = audit;
        this.config = config;
        this.qa = qa;
        this.terminology = terminology;
    }
    async getByCase(caseId) {
        return this.assembler.forCase(caseId);
    }
    async getById(reportId) {
        const detail = await this.assembler.byId(reportId);
        if (!detail)
            throw new common_1.NotFoundException('Report not found.');
        return detail;
    }
    async createDraft(caseId, dto, actor) {
        const reportId = await (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const caseDoc = await this.caseModel.findById(caseId).session(session).exec();
            if (!caseDoc)
                throw new common_1.NotFoundException('Case not found.');
            if (caseDoc.status === 'REPORTED' || caseDoc.status === 'AMENDED') {
                throw new common_1.ConflictException('This case already has a signed report.');
            }
            const existing = await this.reportModel
                .findOne({ caseId: caseDoc._id })
                .session(session)
                .exec();
            if (existing)
                throw new common_1.ConflictException('A report already exists for this case.');
            const catalog = this.reportPorts.protocols('HISTOPATHOLOGY');
            const protocol = catalog ? await catalog.findById(dto.protocolId, session) : null;
            if (!protocol)
                throw new common_1.NotFoundException('Protocol not found.');
            if (!protocol.active)
                throw new common_1.ConflictException('This protocol is inactive.');
            const content = this.parseContent(protocol.content);
            const data = {};
            for (const field of (0, shared_1.flattenProtocolFields)(content)) {
                if (field.defaultValue !== undefined)
                    data[field.key] = field.defaultValue;
            }
            const narrative = (0, shared_1.generateNarrative)(content, data);
            const completeness = (0, shared_1.reportCompleteness)(content, data);
            const report = new this.reportModel({
                caseId: caseDoc._id,
                protocolId: protocol._id,
                protocolSnapshot: {
                    protocolId: protocol._id.toString(),
                    key: protocol.key,
                    title: protocol.title,
                    cancerType: protocol.cancerType,
                    subspecialty: protocol.subspecialty,
                    version: protocol.version,
                    content,
                },
                protocolVersion: protocol.version,
                status: 'DRAFT',
                data,
                narrative,
                version: 0,
                requiredComplete: completeness.complete,
                missingRequired: completeness.missingRequired,
                createdBy: new mongoose_2.Types.ObjectId(actor.id),
            });
            await report.save({ session });
            await this.workflow.advance(caseDoc._id, 'PENDING_REVIEW', this.toActor(actor), session, 'Report draft started');
            await this.audit.record({
                action: 'CREATE',
                entityType: 'Report',
                entityId: report._id.toString(),
                caseId: caseDoc._id.toString(),
                after: {
                    status: report.status,
                    protocol: protocol.key,
                    protocolVersion: protocol.version,
                    version: report.version,
                },
            }, session);
            return report._id.toString();
        });
        return this.getById(reportId);
    }
    async updateDraft(reportId, dto, actor) {
        await (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const report = await this.reportModel.findById(reportId).session(session).exec();
            if (!report)
                throw new common_1.NotFoundException('Report not found.');
            if (report.status !== 'DRAFT') {
                throw new common_1.ConflictException('This report is signed out and locked. Use the amendment flow to change it.');
            }
            const content = this.parseContent(report.protocolSnapshot.content);
            const validation = (0, shared_1.validateReportData)(content, dto.data);
            if (validation.errors.length > 0) {
                throw new common_1.BadRequestException(validation.errors.map((issue) => `${issue.label}: ${issue.message}`));
            }
            const completeness = (0, shared_1.reportCompleteness)(content, validation.data);
            const narrative = (0, shared_1.generateNarrative)(content, validation.data);
            const before = {
                data: report.data,
                narrative: report.narrative,
                missingRequired: report.missingRequired,
            };
            report.data = validation.data;
            report.narrative = narrative;
            if (dto.coding)
                report.coding = await this.normalizeCoding(dto.coding, report.coding);
            report.requiredComplete = completeness.complete;
            report.missingRequired = completeness.missingRequired;
            report.pdfPath = null;
            await report.save({ session });
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'Report',
                entityId: report._id.toString(),
                caseId: report.caseId.toString(),
                before,
                after: {
                    data: report.data,
                    narrative: report.narrative,
                    missingRequired: report.missingRequired,
                },
                metadata: { actor: actor.email },
            }, session);
        });
        return this.getById(reportId);
    }
    async signOut(reportId, actor) {
        await (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const report = await this.reportModel.findById(reportId).session(session).exec();
            if (!report)
                throw new common_1.NotFoundException('Report not found.');
            const content = this.parseContent(report.protocolSnapshot.content);
            const check = (0, shared_1.checkSignOut)(report.status, content, report.data);
            if (!check.ok) {
                if (report.status !== 'DRAFT')
                    throw new common_1.ConflictException(check.reason);
                throw new common_1.BadRequestException(check.reason);
            }
            const validation = (0, shared_1.validateReportData)(content, report.data);
            if (validation.errors.length > 0 || validation.missingRequired.length > 0) {
                throw new common_1.BadRequestException(validation.errors
                    .map((issue) => `${issue.label}: ${issue.message}`)
                    .concat(validation.missingRequired.map((label) => `${label} is required.`)));
            }
            const version = report.version + 1;
            const verificationCode = report.verificationCode ?? (await this.allocateVerificationCode(session));
            const now = new Date();
            const before = {
                status: report.status,
                version: report.version,
                signedOutAt: report.signedOutAt?.toISOString() ?? null,
            };
            report.data = validation.data;
            report.narrative = (0, shared_1.generateNarrative)(content, validation.data);
            report.status = 'SIGNED_OUT';
            report.version = version;
            report.signedOutAt = now;
            report.signedOutBy = new mongoose_2.Types.ObjectId(actor.id);
            report.verificationCode = verificationCode;
            report.requiredComplete = true;
            report.missingRequired = [];
            report.releasedAt = null;
            report.releasedBy = null;
            report.releaseNote = null;
            report.pdfPath = null;
            report.pdfGeneratedAt = null;
            await report.save({ session });
            await this.versionModel.create([
                {
                    reportId: report._id,
                    caseId: report.caseId,
                    version,
                    action: 'SIGN_OUT',
                    data: validation.data,
                    narrative: report.narrative,
                    reason: null,
                    createdBy: new mongoose_2.Types.ObjectId(actor.id),
                },
            ], { session });
            const finalizer = this.reportPorts.finalizer('HISTOPATHOLOGY');
            if (finalizer)
                await finalizer.markReported(report.caseId.toString(), this.toActor(actor), session);
            await this.audit.record({
                action: 'SIGN_OUT',
                entityType: 'Report',
                entityId: report._id.toString(),
                caseId: report.caseId.toString(),
                before,
                after: {
                    status: 'SIGNED_OUT',
                    version,
                    signedOutAt: now.toISOString(),
                    verificationCode,
                },
            }, session);
        });
        const detail = await this.getById(reportId);
        await this.afterSignOut(detail, actor.labId);
        return detail;
    }
    async amend(reportId, dto, actor) {
        await (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const report = await this.reportModel.findById(reportId).session(session).exec();
            if (!report)
                throw new common_1.NotFoundException('Report not found.');
            if (!(0, shared_1.canAmendReport)(report.status)) {
                throw new common_1.ConflictException('Only a signed-out report can be amended.');
            }
            const content = this.parseContent(report.protocolSnapshot.content);
            const candidate = dto.data ?? report.data;
            const validation = (0, shared_1.validateReportData)(content, candidate);
            if (validation.errors.length > 0) {
                throw new common_1.BadRequestException(validation.errors.map((issue) => `${issue.label}: ${issue.message}`));
            }
            if (validation.missingRequired.length > 0) {
                throw new common_1.BadRequestException(validation.missingRequired.map((label) => `${label} is required.`));
            }
            const version = report.version + 1;
            const now = new Date();
            const before = {
                status: report.status,
                version: report.version,
                data: report.data,
                narrative: report.narrative,
            };
            report.data = validation.data;
            report.narrative = (0, shared_1.generateNarrative)(content, validation.data);
            if (dto.coding)
                report.coding = await this.normalizeCoding(dto.coding, report.coding);
            report.status = 'AMENDED';
            report.version = version;
            report.amendedAt = now;
            report.amendmentReason = dto.reason;
            report.signedOutAt = now;
            report.signedOutBy = new mongoose_2.Types.ObjectId(actor.id);
            report.requiredComplete = true;
            report.missingRequired = [];
            report.releasedAt = null;
            report.releasedBy = null;
            report.releaseNote = null;
            report.pdfPath = null;
            report.pdfGeneratedAt = null;
            await report.save({ session });
            await this.versionModel.create([
                {
                    reportId: report._id,
                    caseId: report.caseId,
                    version,
                    action: 'AMEND',
                    data: validation.data,
                    narrative: report.narrative,
                    reason: dto.reason,
                    createdBy: new mongoose_2.Types.ObjectId(actor.id),
                },
            ], { session });
            await this.workflow.amend(report.caseId, this.toActor(actor), session, dto.reason);
            await this.audit.record({
                action: 'AMEND',
                entityType: 'Report',
                entityId: report._id.toString(),
                caseId: report.caseId.toString(),
                before,
                after: {
                    status: 'AMENDED',
                    version,
                    data: report.data,
                    narrative: report.narrative,
                    reason: dto.reason,
                },
                metadata: { reason: dto.reason },
            }, session);
        });
        const detail = await this.getById(reportId);
        await this.afterSignOut(detail, actor.labId);
        return detail;
    }
    async release(reportId, dto, actor) {
        const released = await (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const report = await this.reportModel.findById(reportId).session(session).exec();
            if (!report)
                throw new common_1.NotFoundException('Report not found.');
            if (report.status !== 'SIGNED_OUT' && report.status !== 'AMENDED') {
                throw new common_1.ConflictException('Only a signed report can be released to the referrer.');
            }
            if (report.releasedAt && report.status !== 'AMENDED') {
                return { alreadyReleased: true };
            }
            const caseDoc = await this.caseModel.findById(report.caseId).session(session).exec();
            if (!caseDoc)
                throw new common_1.NotFoundException('Case not found.');
            const patient = await this.patientModel.findById(caseDoc.patientId).session(session).exec();
            if (!patient)
                throw new common_1.NotFoundException('Patient not found.');
            const now = new Date();
            report.releasedAt = now;
            report.releasedBy = new mongoose_2.Types.ObjectId(actor.id);
            report.releaseNote = dto?.note?.trim() || null;
            await report.save({ session });
            await this.testRequests.markReleased(report.caseId, session);
            await this.audit.record({
                action: 'RELEASE',
                entityType: 'Report',
                entityId: report._id.toString(),
                caseId: report.caseId.toString(),
                after: {
                    releasedAt: now.toISOString(),
                    releasedBy: actor.email,
                    patient: `${patient.firstName} ${patient.lastName}`,
                },
                metadata: { note: report.releaseNote },
            }, session);
            return {
                alreadyReleased: false,
                caseId: caseDoc._id.toString(),
                patientName: `${patient.firstName} ${patient.lastName}`,
                email: caseDoc.referringClinician.email,
                phone: caseDoc.referringClinician.phone,
                referrerUserId: caseDoc.referringClinician.referrerUserId?.toString() ?? null,
                accessionNumber: caseDoc.accessionNumber,
            };
        });
        if (!released.alreadyReleased) {
            const portalUrl = `${this.config.get('PUBLIC_WEB_URL') ?? ''}/portal/login`;
            await this.jobs.enqueueNotification({
                labId: actor.labId,
                type: 'REPORT_RELEASED',
                title: `Report released — ${released.accessionNumber}`,
                body: `The histopathology report for ${released.patientName} (${released.accessionNumber}) has been released to your referral portal. Sign in at ${portalUrl} with your email to view it.`,
                caseId: released.caseId,
                entityType: 'Report',
                entityId: reportId,
                userId: released.referrerUserId,
                role: null,
                channels: [
                    ...(released.referrerUserId ? ['IN_APP'] : []),
                    ...(released.email ? ['EMAIL'] : []),
                    ...(released.phone ? ['WHATSAPP'] : []),
                ],
                recipient: { email: released.email, phone: released.phone, name: released.patientName },
                metadata: { portalUrl, accessionNumber: released.accessionNumber },
            });
        }
        return this.getById(reportId);
    }
    async normalizeCoding(input, current) {
        const snomed = input.snomedCode === undefined
            ? null
            : await this.terminology.find('SNOMED_CT', input.snomedCode);
        if (input.snomedCode && !snomed) {
            throw new common_1.BadRequestException(`${input.snomedCode} is not a configured SNOMED CT code.`);
        }
        const morphology = input.icdo3MorphologyCode === undefined
            ? null
            : await this.terminology.find('ICD_O_3_MORPHOLOGY', input.icdo3MorphologyCode);
        if (input.icdo3MorphologyCode && !morphology) {
            throw new common_1.BadRequestException(`${input.icdo3MorphologyCode} is not a configured ICD-O-3 morphology code.`);
        }
        const topography = input.icdo3TopographyCode === undefined
            ? null
            : await this.terminology.find('ICD_O_3_TOPOGRAPHY', input.icdo3TopographyCode);
        if (input.icdo3TopographyCode && !topography) {
            throw new common_1.BadRequestException(`${input.icdo3TopographyCode} is not a configured ICD-O-3 topography code.`);
        }
        return {
            snomedCode: input.snomedCode === undefined ? (current?.snomedCode ?? null) : (snomed?.code ?? null),
            snomedDisplay: input.snomedCode === undefined
                ? (current?.snomedDisplay ?? null)
                : (snomed?.display ?? input.snomedDisplay?.trim() ?? null),
            icdo3MorphologyCode: input.icdo3MorphologyCode === undefined
                ? (current?.icdo3MorphologyCode ?? null)
                : (morphology?.code ?? null),
            icdo3MorphologyDisplay: input.icdo3MorphologyCode === undefined
                ? (current?.icdo3MorphologyDisplay ?? null)
                : (morphology?.display ?? input.icdo3MorphologyDisplay?.trim() ?? null),
            icdo3TopographyCode: input.icdo3TopographyCode === undefined
                ? (current?.icdo3TopographyCode ?? null)
                : (topography?.code ?? null),
            icdo3TopographyDisplay: input.icdo3TopographyCode === undefined
                ? (current?.icdo3TopographyDisplay ?? null)
                : (topography?.display ?? input.icdo3TopographyDisplay?.trim() ?? null),
        };
    }
    async enqueuePdf(reportId, actor) {
        const report = await this.reportModel.findById(reportId).exec();
        if (!report)
            throw new common_1.NotFoundException('Report not found.');
        return this.jobs.enqueuePdf(reportId, actor.labId, report.version);
    }
    async getPdf(reportId) {
        const renderer = this.reportPorts.renderer('HISTOPATHOLOGY');
        if (!renderer)
            throw new common_1.NotFoundException('Report renderer is not available.');
        return renderer.getOrGenerate(reportId);
    }
    async verify(code) {
        return (0, tenant_context_1.runWithSystemTenant)('verify-report', '', async () => {
            const normalized = code.trim().toUpperCase();
            const report = await this.reportModel.findOne({ verificationCode: normalized }).exec();
            if (!report || report.status === 'DRAFT' || !report.signedOutAt) {
                throw new common_1.NotFoundException('No signed report matches this verification code.');
            }
            const caseDoc = await this.caseModel.findById(report.caseId).exec();
            if (!caseDoc)
                throw new common_1.NotFoundException('No report matches this verification code.');
            const patient = await this.patientModel.findById(caseDoc.patientId).exec();
            const lab = await this.labModel.findById(report.labId).exec();
            const signer = report.signedOutBy
                ? await this.userModel.findById(report.signedOutBy).exec()
                : null;
            const initials = patient
                ? `${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`.toUpperCase()
                : '—';
            return {
                valid: true,
                labName: lab?.name ?? 'Histopathology laboratory',
                labCode: lab?.code ?? '',
                accessionNumber: caseDoc.accessionNumber,
                patientInitials: initials,
                status: report.status,
                signedOutAt: report.signedOutAt.toISOString(),
                amendedAt: report.amendedAt?.toISOString() ?? null,
                pathologistName: signer?.name ?? null,
                verificationCode: normalized,
            };
        });
    }
    async summaryForCase(caseId) {
        const report = await this.reportModel.findOne({ caseId: new mongoose_2.Types.ObjectId(caseId) }).exec();
        return report ? (0, entities_1.toReportSummary)(report) : null;
    }
    async afterSignOut(detail, labId) {
        try {
            await this.jobs.enqueuePdf(detail.id, labId, detail.version);
        }
        catch (error) {
            this.logger.error({ err: error }, 'Could not enqueue report PDF.');
        }
        try {
            const amended = detail.status === 'AMENDED';
            await this.jobs.enqueueNotification({
                labId,
                type: amended ? 'REPORT_AMENDED' : 'REPORT_SIGNED_OUT',
                title: amended ? 'Report amended' : 'Report signed out',
                body: amended
                    ? 'An amended histopathology report is ready for release.'
                    : 'A histopathology report has been signed out and is ready for release.',
                caseId: detail.caseId,
                entityType: 'Report',
                entityId: detail.id,
                role: 'LAB_ADMIN',
            });
        }
        catch (error) {
            this.logger.error({ err: error }, 'Could not enqueue report notification.');
        }
        try {
            await this.qa.maybeCreatePeerReview(detail.id, {
                id: detail.signedOutBy?.id ?? '',
                labId,
                name: detail.signedOutBy?.name ?? '',
                email: detail.signedOutBy?.email ?? '',
                role: 'PATHOLOGIST',
                subspecialties: detail.signedOutBy?.subspecialties ?? [],
                disciplines: [],
                labEnabledDisciplines: [],
            });
        }
        catch (error) {
            this.logger.warn({ err: error }, 'Could not create a sampled QA review.');
        }
    }
    toActor(user) {
        return { userId: user.id, userName: user.name, userRole: user.role };
    }
    parseContent(raw) {
        const parsed = shared_1.protocolContentSchema.safeParse(raw);
        if (!parsed.success) {
            throw new common_1.NotFoundException('The report protocol snapshot is invalid.');
        }
        return parsed.data;
    }
    async allocateVerificationCode(session) {
        for (let attempt = 0; attempt < 5; attempt += 1) {
            const code = (0, crypto_1.randomVerificationCode)();
            const exists = await this.reportModel
                .exists({ verificationCode: code })
                .session(session)
                .exec();
            if (!exists)
                return code;
        }
        throw new common_1.ConflictException('Could not allocate a verification code. Try again.');
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = ReportsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(1, (0, mongoose_1.InjectModel)(report_schema_1.ReportModelName)),
    __param(2, (0, mongoose_1.InjectModel)(report_version_schema_1.ReportVersionModelName)),
    __param(3, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(4, (0, mongoose_1.InjectModel)(patient_schema_1.PatientModelName)),
    __param(5, (0, mongoose_1.InjectModel)(user_schema_1.UserModelName)),
    __param(6, (0, mongoose_1.InjectModel)(lab_schema_1.LabModelName)),
    __metadata("design:paramtypes", [Function, mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        report_assembler_service_1.ReportAssemblerService,
        case_workflow_service_1.CaseWorkflowService,
        test_requests_service_1.TestRequestsService,
        report_ports_1.ReportPortRegistry,
        jobs_service_1.JobsService,
        audit_service_1.AuditService,
        config_1.ConfigService,
        qa_service_1.QaService,
        terminology_service_1.TerminologyService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map