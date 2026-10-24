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
exports.PortalService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const node_crypto_1 = require("node:crypto");
const actor_1 = require("../../common/utils/actor");
const tenant_context_1 = require("../../common/context/tenant-context");
const format_1 = require("../../common/utils/format");
const crypto_1 = require("../../common/utils/crypto");
const entities_1 = require("../../common/serializers/entities");
const auth_service_1 = require("../../core/auth/auth.service");
const case_schema_1 = require("../../core/cases/case.schema");
const custody_service_1 = require("../../core/custody/custody.service");
const lab_schema_1 = require("../../core/labs/lab.schema");
const notification_service_1 = require("../../core/notifications/notification.service");
const patient_schema_1 = require("../../core/patients/patient.schema");
const pdf_service_1 = require("../../disciplines/histopathology/pdf/pdf.service");
const report_assembler_service_1 = require("../../core/reports/report-assembler.service");
const report_schema_1 = require("../../core/reports/report.schema");
const user_schema_1 = require("../../core/users/user.schema");
const result_schema_1 = require("../../core/results/result.schema");
const result_pdf_service_1 = require("../../core/results/result-pdf.service");
const portal_token_schema_1 = require("./portal-token.schema");
let PortalService = class PortalService {
    userModel;
    labModel;
    tokenModel;
    caseModel;
    patientModel;
    reportModel;
    resultModel;
    auth;
    notifications;
    assembler;
    custody;
    pdf;
    resultPdf;
    config;
    constructor(userModel, labModel, tokenModel, caseModel, patientModel, reportModel, resultModel, auth, notifications, assembler, custody, pdf, resultPdf, config) {
        this.userModel = userModel;
        this.labModel = labModel;
        this.tokenModel = tokenModel;
        this.caseModel = caseModel;
        this.patientModel = patientModel;
        this.reportModel = reportModel;
        this.resultModel = resultModel;
        this.auth = auth;
        this.notifications = notifications;
        this.assembler = assembler;
        this.custody = custody;
        this.pdf = pdf;
        this.resultPdf = resultPdf;
        this.config = config;
    }
    async request(dto) {
        const lab = await this.labModel
            .findOne({ code: dto.labCode.toUpperCase(), active: true })
            .exec();
        const generic = {
            sent: true,
            message: 'If that account exists, a sign-in link and code have been sent.',
        };
        if (!lab)
            return generic;
        return (0, tenant_context_1.runWithTenant)({ labId: lab._id.toString() }, async () => {
            const user = await this.userModel
                .findOne({ email: dto.email.toLowerCase(), role: 'REFERRER', active: true })
                .exec();
            if (!user)
                return generic;
            const recent = await this.tokenModel
                .countDocuments({
                userId: user._id,
                consumedAt: null,
                createdAt: { $gte: new Date(Date.now() - 10 * 60_000) },
            })
                .exec();
            if (recent >= 3)
                return generic;
            const rawToken = (0, node_crypto_1.randomBytes)(32).toString('base64url');
            const code = String((0, node_crypto_1.randomInt)(0, 1_000_000)).padStart(6, '0');
            const ttlMinutes = this.config.get('PORTAL_TOKEN_TTL_MINUTES') ?? 15;
            const context = (0, actor_1.requestAuditContext)();
            const tokenDoc = new this.tokenModel({
                userId: user._id,
                email: user.email,
                tokenHash: (0, crypto_1.hashToken)(rawToken),
                codeHash: (0, crypto_1.hashToken)(code),
                type: 'MAGIC_LINK',
                expiresAt: new Date(Date.now() + ttlMinutes * 60_000),
                consumedAt: null,
                attempts: 0,
                ip: context.ip,
                userAgent: context.userAgent,
            });
            await tokenDoc.save();
            await this.tokenModel.updateMany({ userId: user._id, _id: { $ne: tokenDoc._id }, consumedAt: null }, { $set: { consumedAt: new Date() } });
            const link = `${this.config.get('PUBLIC_WEB_URL')}/portal/login?lab=${encodeURIComponent(lab.code)}&email=${encodeURIComponent(user.email)}&token=${encodeURIComponent(rawToken)}`;
            const body = [
                `Your ${lab.name} referral portal sign-in code is ${code}. It expires in ${ttlMinutes} minutes.`,
                '',
                `Open ${link} to sign in.`,
                '',
                'If you did not request this, ignore this message.',
            ].join('\n');
            await this.notifications.send({
                labId: lab._id.toString(),
                type: 'PORTAL_MAGIC_LINK',
                title: 'Referral portal sign-in',
                body,
                channels: ['EMAIL', ...(user.phone ? ['SMS'] : [])],
                recipient: { email: user.email, phone: user.phone, name: user.name },
                userId: user._id.toString(),
                entityType: 'Portal',
                entityId: user._id.toString(),
                metadata: { link, purpose: 'portal-login' },
            });
            if (this.config.get('PORTAL_DEBUG')) {
                generic.debugCode = code;
                generic.debugToken = rawToken;
            }
            return generic;
        });
    }
    async verify(dto) {
        const lab = await this.labModel
            .findOne({ code: dto.labCode.toUpperCase(), active: true })
            .exec();
        if (!lab)
            throw new common_1.UnauthorizedException('This sign-in link is invalid or has expired.');
        return (0, tenant_context_1.runWithTenant)({ labId: lab._id.toString() }, async () => {
            const user = await this.userModel
                .findOne({ email: dto.email.toLowerCase(), role: 'REFERRER', active: true })
                .exec();
            if (!user)
                throw new common_1.UnauthorizedException('This sign-in link is invalid or has expired.');
            const tokenDoc = await this.tokenModel
                .findOne({
                userId: user._id,
                consumedAt: null,
                expiresAt: { $gt: new Date() },
            })
                .sort({ createdAt: -1 })
                .select('+tokenHash +codeHash')
                .exec();
            if (!tokenDoc) {
                throw new common_1.UnauthorizedException('This sign-in link is invalid or has expired.');
            }
            const matchesToken = dto.token ? safeEqual(tokenDoc.tokenHash, (0, crypto_1.hashToken)(dto.token)) : false;
            const matchesCode = dto.code ? safeEqual(tokenDoc.codeHash, (0, crypto_1.hashToken)(dto.code)) : false;
            if (!matchesToken && !matchesCode) {
                tokenDoc.attempts += 1;
                if (tokenDoc.attempts >= 5)
                    tokenDoc.consumedAt = new Date();
                await tokenDoc.save();
                throw new common_1.UnauthorizedException('The code is incorrect or has expired.');
            }
            tokenDoc.consumedAt = new Date();
            await tokenDoc.save();
            return this.auth.portalSession(user._id.toString());
        });
    }
    async listCases(userId, email, page, limit) {
        const filter = {
            $or: [
                { 'referringClinician.referrerUserId': new mongoose_2.Types.ObjectId(userId) },
                { 'referringClinician.email': email.toLowerCase() },
            ],
        };
        const [cases, total] = await Promise.all([
            this.caseModel
                .find(filter)
                .sort({ receivedAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.caseModel.countDocuments(filter).exec(),
        ]);
        const items = await Promise.all(cases.map((caseDoc) => this.toPortalSummary(caseDoc)));
        return (0, format_1.buildPaginated)(items, total, page, limit);
    }
    async getCase(caseId, userId, email) {
        const caseDoc = await this.findOwnedCase(caseId, userId, email);
        const [patient, report, timeline, releasedResults] = await Promise.all([
            this.patientModel.findById(caseDoc.patientId).exec(),
            this.reportModel.findOne({ caseId: caseDoc._id }).exec(),
            this.custody.forCase(caseDoc._id.toString()),
            this.releasedResults(caseDoc._id),
        ]);
        if (!patient)
            throw new common_1.NotFoundException('Case not found.');
        const summary = await this.toPortalSummary(caseDoc);
        const reportDetail = report && report.releasedAt ? await this.assembler.byId(report._id.toString()) : null;
        return {
            ...summary,
            patient: (0, entities_1.toPatientSummary)(patient),
            referringClinician: {
                name: caseDoc.referringClinician.name,
                facility: caseDoc.referringClinician.facility,
                phone: caseDoc.referringClinician.phone,
                email: caseDoc.referringClinician.email,
                referrerUserId: caseDoc.referringClinician.referrerUserId
                    ? caseDoc.referringClinician.referrerUserId.toString()
                    : null,
            },
            clinicalHistory: caseDoc.clinicalHistory,
            clinicalDiagnosis: caseDoc.clinicalDiagnosis,
            report: reportDetail,
            results: releasedResults,
            timeline,
        };
    }
    async getResultPdf(resultId, userId, email) {
        const result = await this.resultModel.findById(resultId).exec();
        if (!result || result.status !== 'RELEASED')
            throw new common_1.NotFoundException('Result not found.');
        await this.findOwnedCase(result.caseId.toString(), userId, email);
        return this.resultPdf.generateAndStore(resultId);
    }
    async getReportPdf(caseId, userId, email) {
        await this.findOwnedCase(caseId, userId, email);
        const report = await this.reportModel.findOne({ caseId: new mongoose_2.Types.ObjectId(caseId) }).exec();
        if (!report || !report.releasedAt) {
            throw new common_1.ForbiddenException('This report has not been released to the referrer yet.');
        }
        return this.pdf.getOrGenerate(report._id.toString());
    }
    async findOwnedCase(caseId, userId, email) {
        const caseDoc = await this.caseModel
            .findOne({
            _id: new mongoose_2.Types.ObjectId(caseId),
            $or: [
                { 'referringClinician.referrerUserId': new mongoose_2.Types.ObjectId(userId) },
                { 'referringClinician.email': email.toLowerCase() },
            ],
        })
            .exec();
        if (!caseDoc)
            throw new common_1.NotFoundException('Case not found.');
        return caseDoc;
    }
    async toPortalSummary(caseDoc) {
        const [patient, report, results] = await Promise.all([
            this.patientModel.findById(caseDoc.patientId).exec(),
            this.reportModel.findOne({ caseId: caseDoc._id }).exec(),
            this.releasedResults(caseDoc._id),
        ]);
        if (!patient)
            throw new common_1.NotFoundException('Case not found.');
        const released = Boolean(report?.releasedAt);
        const referralStatus = referralStatusFor(caseDoc.status, released, report?.status ?? null);
        return {
            id: caseDoc._id.toString(),
            accessionNumber: caseDoc.accessionNumber,
            status: caseDoc.status,
            referralStatus,
            patientName: `${patient.firstName} ${patient.lastName}`,
            patientMrn: patient.mrn,
            receivedAt: caseDoc.receivedAt.toISOString(),
            reportedAt: caseDoc.reportedAt ? caseDoc.reportedAt.toISOString() : null,
            releasedAt: report?.releasedAt ? report.releasedAt.toISOString() : null,
            priority: caseDoc.priority,
            reportAvailable: released,
            resultsAvailable: results.length > 0,
            releasedResultCount: results.length,
            downloadUrl: released && report ? `/portal/cases/${caseDoc._id.toString()}/report.pdf` : null,
        };
    }
    async releasedResults(caseId) {
        const results = await this.resultModel
            .find({ caseId, status: 'RELEASED' })
            .sort({ releasedAt: -1 })
            .exec();
        return results.map((result) => ({
            id: result._id.toString(),
            testCode: result.testCode,
            testName: result.testName,
            discipline: result.discipline,
            verifiedAt: result.verifiedAt?.toISOString() ?? null,
            releasedAt: (result.releasedAt ?? result.verifiedAt ?? result.createdAt).toISOString(),
            downloadUrl: `/portal/results/${result._id.toString()}/pdf`,
        }));
    }
};
exports.PortalService = PortalService;
exports.PortalService = PortalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.UserModelName)),
    __param(1, (0, mongoose_1.InjectModel)(lab_schema_1.LabModelName)),
    __param(2, (0, mongoose_1.InjectModel)(portal_token_schema_1.PortalTokenModelName)),
    __param(3, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(4, (0, mongoose_1.InjectModel)(patient_schema_1.PatientModelName)),
    __param(5, (0, mongoose_1.InjectModel)(report_schema_1.ReportModelName)),
    __param(6, (0, mongoose_1.InjectModel)(result_schema_1.ResultSetModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        auth_service_1.AuthService,
        notification_service_1.NotificationService,
        report_assembler_service_1.ReportAssemblerService,
        custody_service_1.CustodyService,
        pdf_service_1.PdfService,
        result_pdf_service_1.ResultPdfService,
        config_1.ConfigService])
], PortalService);
function referralStatusFor(caseStatus, released, reportStatus) {
    if (released)
        return reportStatus === 'AMENDED' ? 'AMENDED' : 'RELEASED';
    if (caseStatus === 'REPORTED' || caseStatus === 'AMENDED')
        return 'READY';
    if (caseStatus === 'RECEIVED')
        return 'RECEIVED';
    return 'IN_PROGRESS';
}
function safeEqual(left, right) {
    const a = Buffer.from(left, 'utf8');
    const b = Buffer.from(right, 'utf8');
    return a.length === b.length && (0, node_crypto_1.timingSafeEqual)(a, b);
}
void actor_1.currentActor;
void entities_1.toReportDetail;
//# sourceMappingURL=portal.service.js.map