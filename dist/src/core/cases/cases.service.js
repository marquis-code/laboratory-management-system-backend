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
exports.CasesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const crypto_1 = require("../../common/utils/crypto");
const format_1 = require("../../common/utils/format");
const transaction_1 = require("../../common/utils/transaction");
const entities_1 = require("../../common/serializers/entities");
const audit_service_1 = require("../audit/audit.service");
const test_requests_service_1 = require("../test-requests/test-requests.service");
const custody_service_1 = require("../custody/custody.service");
const labs_service_1 = require("../labs/labs.service");
const patients_service_1 = require("../patients/patients.service");
const patient_schema_1 = require("../patients/patient.schema");
const report_assembler_service_1 = require("../reports/report-assembler.service");
const report_schema_1 = require("../reports/report.schema");
const specimen_schema_1 = require("../specimens/specimen.schema");
const users_service_1 = require("../users/users.service");
const user_schema_1 = require("../users/user.schema");
const case_schema_1 = require("./case.schema");
const case_artifacts_1 = require("./case-artifacts");
let CasesService = class CasesService {
    connection;
    caseModel;
    patientModel;
    specimenModel;
    reportModel;
    userModel;
    patientsService;
    labsService;
    usersService;
    custody;
    reportAssembler;
    artifacts;
    testRequests;
    audit;
    constructor(connection, caseModel, patientModel, specimenModel, reportModel, userModel, patientsService, labsService, usersService, custody, reportAssembler, artifacts, testRequests, audit) {
        this.connection = connection;
        this.caseModel = caseModel;
        this.patientModel = patientModel;
        this.specimenModel = specimenModel;
        this.reportModel = reportModel;
        this.userModel = userModel;
        this.patientsService = patientsService;
        this.labsService = labsService;
        this.usersService = usersService;
        this.custody = custody;
        this.reportAssembler = reportAssembler;
        this.artifacts = artifacts;
        this.testRequests = testRequests;
        this.audit = audit;
    }
    async accession(dto, actor) {
        const pathologist = dto.assignedPathologistId
            ? await this.usersService.assertActivePathologist(dto.assignedPathologistId)
            : null;
        const caseId = await (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const receivedAt = new Date();
            const discipline = dto.discipline ?? 'HISTOPATHOLOGY';
            const allocated = await this.labsService.allocateAccession(actor.labId, session, discipline);
            const lab = allocated.lab;
            const patient = await this.patientsService.resolveForAccession(dto.patient, actor, session);
            const referrerEmail = dto.referringClinician.email?.trim().toLowerCase();
            const referrerUser = referrerEmail
                ? await this.userModel
                    .findOne({ email: referrerEmail, role: 'REFERRER', active: true })
                    .session(session)
                    .exec()
                : null;
            const priority = dto.priority;
            const tatHours = lab.tatHours[priority] ?? 72;
            const caseDoc = new this.caseModel({
                accessionNumber: allocated.accessionNumber,
                patientId: patient._id,
                priority,
                priorityRank: shared_1.PRIORITY_RANK[priority],
                status: 'RECEIVED',
                statusChangedAt: receivedAt,
                clinicalHistory: dto.clinicalHistory.trim(),
                clinicalDiagnosis: dto.clinicalDiagnosis?.trim() || null,
                subspecialty: dto.subspecialty?.trim() || null,
                referringClinician: {
                    name: dto.referringClinician.name.trim(),
                    facility: dto.referringClinician.facility?.trim() || null,
                    phone: dto.referringClinician.phone?.trim() || null,
                    email: referrerEmail || null,
                    referrerUserId: referrerUser?._id ?? null,
                },
                assignedPathologistId: pathologist ? pathologist._id : null,
                receivedAt,
                tatDeadline: (0, format_1.addHours)(receivedAt, tatHours),
                summary: {
                    specimenCount: dto.specimens.length,
                    blockCount: 0,
                    slideCount: 0,
                },
                createdBy: new mongoose_2.Types.ObjectId(actor.id),
            });
            await caseDoc.save({ session });
            const receivedActor = {
                userId: actor.id,
                userName: actor.name,
                userRole: actor.role,
            };
            await this.testRequests.createForCase(caseDoc, discipline, receivedActor, session, {
                code: dto.testCode,
                name: dto.testName,
            });
            await this.custody.append({
                entityType: 'CASE',
                entityId: caseDoc._id,
                caseId: caseDoc._id,
                eventType: 'RECEIVED',
                station: null,
                fromState: null,
                toState: 'RECEIVED',
                reason: 'Accessioned',
                metadata: { accessionNumber: caseDoc.accessionNumber, priority },
                timestamp: receivedAt,
            }, receivedActor, session);
            const specimens = [];
            for (const [index, input] of dto.specimens.entries()) {
                const sequence = index + 1;
                const specimen = new this.specimenModel({
                    caseId: caseDoc._id,
                    sequence,
                    label: (0, shared_1.specimenLetter)(sequence),
                    barcode: (0, crypto_1.makeBarcode)('SP'),
                    specimenType: input.specimenType.trim(),
                    site: input.site.trim(),
                    laterality: input.laterality ?? null,
                    description: input.description?.trim() || null,
                    collectedAt: input.collectedAt ? new Date(input.collectedAt) : null,
                    receivedAt,
                    status: 'ACCESSIONED',
                    currentStation: null,
                });
                await specimen.save({ session });
                specimens.push(specimen);
                await this.custody.append({
                    entityType: 'SPECIMEN',
                    entityId: specimen._id,
                    caseId: caseDoc._id,
                    eventType: 'ACCESSIONED',
                    station: null,
                    fromState: null,
                    toState: 'ACCESSIONED',
                    reason: 'Accessioned',
                    barcode: specimen.barcode,
                    metadata: { label: specimen.label, specimenType: specimen.specimenType },
                    timestamp: receivedAt,
                }, receivedActor, session);
                await this.audit.record({
                    action: 'CREATE',
                    entityType: 'Specimen',
                    entityId: specimen._id.toString(),
                    caseId: caseDoc._id.toString(),
                    after: (0, entities_1.toSpecimen)(specimen),
                }, session);
            }
            await this.audit.record({
                action: 'CREATE',
                entityType: 'Case',
                entityId: caseDoc._id.toString(),
                caseId: caseDoc._id.toString(),
                after: (0, entities_1.toCaseListItem)(caseDoc, patient, pathologist, null, [discipline]),
                metadata: { accessionNumber: caseDoc.accessionNumber, discipline },
            }, session);
            return caseDoc._id.toString();
        });
        return this.getDetail(caseId);
    }
    async list(query) {
        const filter = {};
        if (query.status)
            filter.status = query.status;
        if (query.discipline) {
            const caseIds = await this.testRequests.caseIdsForDiscipline(query.discipline);
            filter._id = { $in: caseIds };
        }
        if (query.priority)
            filter.priority = query.priority;
        if (query.pathologistId) {
            filter.assignedPathologistId = new mongoose_2.Types.ObjectId(query.pathologistId);
        }
        if (query.subspecialty)
            filter.subspecialty = query.subspecialty;
        if (query.from || query.to) {
            const range = {};
            if (query.from) {
                const from = (0, format_1.parseDateOnly)(query.from);
                if (from)
                    range.$gte = (0, format_1.startOfDay)(from);
            }
            if (query.to) {
                const to = (0, format_1.parseDateOnly)(query.to);
                if (to)
                    range.$lte = (0, format_1.endOfDay)(to);
            }
            if (Object.keys(range).length > 0)
                filter.receivedAt = range;
        }
        if (query.q) {
            const regex = new RegExp((0, format_1.escapeRegex)(query.q.trim()), 'i');
            const patients = await this.patientModel
                .find({
                $or: [{ mrn: regex }, { firstName: regex }, { lastName: regex }],
            })
                .select('_id')
                .limit(300)
                .exec();
            const patientIds = patients.map((patient) => patient._id);
            const or = [{ accessionNumber: regex }];
            if (patientIds.length > 0)
                or.push({ patientId: { $in: patientIds } });
            filter.$or = or;
        }
        const [cases, total] = await Promise.all([
            this.caseModel
                .find(filter)
                .sort({ receivedAt: -1, _id: -1 })
                .skip((query.page - 1) * query.limit)
                .limit(query.limit)
                .exec(),
            this.caseModel.countDocuments(filter).exec(),
        ]);
        const items = await this.decorateCases(cases);
        return (0, format_1.buildPaginated)(items, total, query.page, query.limit);
    }
    async getDetail(caseId) {
        const caseDoc = await this.caseModel.findById(caseId).exec();
        if (!caseDoc)
            throw new common_1.NotFoundException('Case not found.');
        const patient = await this.patientModel.findById(caseDoc.patientId).exec();
        if (!patient)
            throw new common_1.NotFoundException('Patient not found for this case.');
        const pathologist = caseDoc.assignedPathologistId
            ? await this.userModel.findById(caseDoc.assignedPathologistId).exec()
            : null;
        const report = await this.reportModel.findOne({ caseId: caseDoc._id }).exec();
        const [specimens, testRequests, artifacts, custodyEvents, assembled, lab] = await Promise.all([
            this.specimenModel.find({ caseId: caseDoc._id }).sort({ sequence: 1 }).exec(),
            this.testRequests.forCase(caseDoc._id.toString()),
            this.artifacts.load('HISTOPATHOLOGY', caseDoc._id.toString()),
            this.custody.forCase(caseDoc._id.toString()),
            this.reportAssembler.forCase(caseDoc._id.toString()),
            this.labsService.getById(caseDoc.labId.toString()),
        ]);
        const base = (0, entities_1.toCaseListItem)(caseDoc, patient, pathologist, report, testRequests.map((request) => request.discipline));
        return {
            ...base,
            clinicalHistory: caseDoc.clinicalHistory,
            clinicalDiagnosis: caseDoc.clinicalDiagnosis,
            specimens: specimens.map(entities_1.toSpecimen),
            testRequests,
            blocks: artifacts.blocks,
            slides: artifacts.slides,
            custodyEvents,
            report: assembled,
            tat: (0, shared_1.computeTat)(caseDoc.receivedAt, caseDoc.tatDeadline, {
                warningPercent: lab.tatWarningPercent,
                done: caseDoc.status === 'REPORTED' || caseDoc.status === 'AMENDED',
            }),
        };
    }
    async update(caseId, dto, actor) {
        await (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const caseDoc = await this.caseModel.findById(caseId).session(session).exec();
            if (!caseDoc)
                throw new common_1.NotFoundException('Case not found.');
            if (caseDoc.status === 'REPORTED' || caseDoc.status === 'AMENDED') {
                throw new common_1.ConflictException('A reported case cannot be edited. Amend the report instead.');
            }
            const before = {
                clinicalHistory: caseDoc.clinicalHistory,
                clinicalDiagnosis: caseDoc.clinicalDiagnosis,
                priority: caseDoc.priority,
                subspecialty: caseDoc.subspecialty,
                tatDeadline: caseDoc.tatDeadline.toISOString(),
            };
            if (dto.clinicalHistory !== undefined)
                caseDoc.clinicalHistory = dto.clinicalHistory.trim();
            if (dto.clinicalDiagnosis !== undefined) {
                caseDoc.clinicalDiagnosis = dto.clinicalDiagnosis.trim() || null;
            }
            if (dto.subspecialty !== undefined) {
                caseDoc.subspecialty = dto.subspecialty.trim() || null;
            }
            if (dto.priority !== undefined && dto.priority !== caseDoc.priority) {
                const priority = dto.priority;
                const lab = await this.labsService.getById(caseDoc.labId.toString());
                caseDoc.priority = priority;
                caseDoc.priorityRank = shared_1.PRIORITY_RANK[priority];
                caseDoc.tatDeadline = (0, format_1.addHours)(caseDoc.receivedAt, lab.tatHours[priority]);
            }
            await caseDoc.save({ session });
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'Case',
                entityId: caseDoc._id.toString(),
                caseId: caseDoc._id.toString(),
                before,
                after: {
                    clinicalHistory: caseDoc.clinicalHistory,
                    clinicalDiagnosis: caseDoc.clinicalDiagnosis,
                    priority: caseDoc.priority,
                    subspecialty: caseDoc.subspecialty,
                    tatDeadline: caseDoc.tatDeadline.toISOString(),
                },
                metadata: { actor: actor.email },
            }, session);
        });
        return this.getDetail(caseId);
    }
    async assign(caseId, dto, actor) {
        const targetId = dto.pathologistId ?? null;
        if (actor.role === 'PATHOLOGIST') {
            if (targetId !== actor.id) {
                throw new common_1.ForbiddenException('Pathologists can only assign cases to themselves.');
            }
        }
        const pathologist = targetId ? await this.usersService.assertActivePathologist(targetId) : null;
        await (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const caseDoc = await this.caseModel.findById(caseId).session(session).exec();
            if (!caseDoc)
                throw new common_1.NotFoundException('Case not found.');
            if (caseDoc.status === 'AMENDED') {
                throw new common_1.ConflictException('An amended case cannot be reassigned.');
            }
            const before = caseDoc.assignedPathologistId?.toString() ?? null;
            caseDoc.assignedPathologistId = pathologist ? pathologist._id : null;
            await caseDoc.save({ session });
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'Case',
                entityId: caseDoc._id.toString(),
                caseId: caseDoc._id.toString(),
                before: { assignedPathologistId: before },
                after: { assignedPathologistId: pathologist ? pathologist._id.toString() : null },
            }, session);
        });
        return this.getDetail(caseId);
    }
    async decorateCases(cases) {
        if (cases.length === 0)
            return [];
        const caseIds = cases.map((item) => item._id);
        const patientIds = Array.from(new Set(cases.map((item) => item.patientId.toString())));
        const pathologistIds = Array.from(new Set(cases
            .map((item) => item.assignedPathologistId?.toString())
            .filter((value) => Boolean(value))));
        const [patients, pathologists, reports, testRequestMap] = await Promise.all([
            this.patientModel
                .find({ _id: { $in: patientIds.map((id) => new mongoose_2.Types.ObjectId(id)) } })
                .exec(),
            pathologistIds.length > 0
                ? this.userModel
                    .find({ _id: { $in: pathologistIds.map((id) => new mongoose_2.Types.ObjectId(id)) } })
                    .exec()
                : Promise.resolve([]),
            this.reportModel.find({ caseId: { $in: caseIds } }).exec(),
            this.testRequests.forCases(caseIds),
        ]);
        const patientMap = new Map(patients.map((patient) => [patient._id.toString(), patient]));
        const pathologistMap = new Map(pathologists.map((user) => [user._id.toString(), user]));
        const reportMap = new Map(reports.map((report) => [report.caseId.toString(), report]));
        return cases.map((caseDoc) => {
            const patient = patientMap.get(caseDoc.patientId.toString());
            if (!patient)
                throw new common_1.NotFoundException('Patient missing for a case.');
            const pathologist = caseDoc.assignedPathologistId
                ? (pathologistMap.get(caseDoc.assignedPathologistId.toString()) ?? null)
                : null;
            const report = reportMap.get(caseDoc._id.toString()) ?? null;
            const requests = testRequestMap.get(caseDoc._id.toString()) ?? [];
            return (0, entities_1.toCaseListItem)(caseDoc, patient, pathologist, report, requests.map((request) => request.discipline));
        });
    }
    async patientSummary(patientId) {
        const patient = await this.patientModel.findById(patientId).exec();
        if (!patient)
            throw new common_1.NotFoundException('Patient not found.');
        return (0, entities_1.toPatient)(patient);
    }
    /** Used by labels to verify the case exists inside the tenant. */
    async assertCase(caseId) {
        const caseDoc = await this.caseModel.findById(caseId).exec();
        if (!caseDoc)
            throw new common_1.NotFoundException('Case not found.');
        return caseDoc;
    }
    async guardEditable(caseId) {
        const caseDoc = await this.caseModel.findById(caseId).select('status').exec();
        if (!caseDoc)
            throw new common_1.NotFoundException('Case not found.');
        if (caseDoc.status === 'REPORTED' || caseDoc.status === 'AMENDED') {
            throw new common_1.BadRequestException('A reported case cannot be edited.');
        }
    }
};
exports.CasesService = CasesService;
exports.CasesService = CasesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(1, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(2, (0, mongoose_1.InjectModel)(patient_schema_1.PatientModelName)),
    __param(3, (0, mongoose_1.InjectModel)(specimen_schema_1.SpecimenModelName)),
    __param(4, (0, mongoose_1.InjectModel)(report_schema_1.ReportModelName)),
    __param(5, (0, mongoose_1.InjectModel)(user_schema_1.UserModelName)),
    __metadata("design:paramtypes", [Function, mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        patients_service_1.PatientsService,
        labs_service_1.LabsService,
        users_service_1.UsersService,
        custody_service_1.CustodyService,
        report_assembler_service_1.ReportAssemblerService,
        case_artifacts_1.CaseArtifactRegistry,
        test_requests_service_1.TestRequestsService,
        audit_service_1.AuditService])
], CasesService);
//# sourceMappingURL=cases.service.js.map