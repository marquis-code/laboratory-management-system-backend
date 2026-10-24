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
exports.FhirService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const case_schema_1 = require("../../core/cases/case.schema");
const lab_schema_1 = require("../../core/labs/lab.schema");
const patient_schema_1 = require("../../core/patients/patient.schema");
const report_schema_1 = require("../../core/reports/report.schema");
const specimen_schema_1 = require("../../core/specimens/specimen.schema");
let FhirService = class FhirService {
    patientModel;
    caseModel;
    specimenModel;
    reportModel;
    labModel;
    config;
    constructor(patientModel, caseModel, specimenModel, reportModel, labModel, config) {
        this.patientModel = patientModel;
        this.caseModel = caseModel;
        this.specimenModel = specimenModel;
        this.reportModel = reportModel;
        this.labModel = labModel;
        this.config = config;
    }
    capabilityStatement() {
        return {
            resourceType: 'CapabilityStatement',
            status: 'active',
            date: new Date().toISOString(),
            kind: 'instance',
            software: { name: 'Histopathology LIMS', version: '1.2.0' },
            implementation: { description: 'Histopathology laboratory interoperability API' },
            fhirVersion: '4.0.1',
            format: ['application/fhir+json'],
            rest: [
                {
                    mode: 'server',
                    resource: ['Patient', 'ServiceRequest', 'Specimen', 'DiagnosticReport'].map((type) => ({
                        type,
                        interaction: [{ code: 'read' }, { code: 'search-type' }],
                    })),
                },
            ],
        };
    }
    async patient(id) {
        const patient = await this.patientModel.findById(id).exec();
        if (!patient)
            throw new common_1.NotFoundException('Patient not found.');
        return this.patientResource(patient);
    }
    async searchPatients(query) {
        const filter = {};
        if (query._id)
            filter._id = new mongoose_2.Types.ObjectId(query._id);
        if (query.identifier) {
            filter.mrn = query.identifier.trim().toUpperCase();
        }
        const docs = await this.patientModel
            .find(filter)
            .limit(query._count ?? 20)
            .exec();
        return this.bundle(docs.map((doc) => this.patientResource(doc)));
    }
    async serviceRequest(id) {
        const caseDoc = await this.caseModel.findById(id).exec();
        if (!caseDoc)
            throw new common_1.NotFoundException('ServiceRequest not found.');
        return this.serviceRequestResource(caseDoc);
    }
    async searchServiceRequests(query) {
        const filter = {};
        if (query._id)
            filter._id = new mongoose_2.Types.ObjectId(query._id);
        if (query.identifier)
            filter.accessionNumber = query.identifier.trim().toUpperCase();
        if (query.subject) {
            const patientId = this.stripType(query.subject, 'Patient');
            if (!mongoose_2.Types.ObjectId.isValid(patientId))
                throw new common_1.BadRequestException('Invalid subject.');
            filter.patientId = new mongoose_2.Types.ObjectId(patientId);
        }
        if (query.date) {
            filter.receivedAt = {
                $gte: new Date(`${query.date}T00:00:00.000Z`),
                $lte: new Date(`${query.date}T23:59:59.999Z`),
            };
        }
        const docs = await this.caseModel
            .find(filter)
            .sort({ receivedAt: -1 })
            .limit(query._count ?? 20)
            .exec();
        return this.bundle(docs.map((doc) => this.serviceRequestResource(doc)));
    }
    async specimen(id) {
        const specimen = await this.specimenModel.findById(id).exec();
        if (!specimen)
            throw new common_1.NotFoundException('Specimen not found.');
        return this.specimenResource(specimen);
    }
    async searchSpecimens(query) {
        const filter = {};
        if (query._id)
            filter._id = new mongoose_2.Types.ObjectId(query._id);
        if (query.identifier)
            filter.barcode = query.identifier.trim().toUpperCase();
        if (query.subject) {
            const patientId = this.stripType(query.subject, 'Patient');
            if (!mongoose_2.Types.ObjectId.isValid(patientId))
                throw new common_1.BadRequestException('Invalid subject.');
            const cases = await this.caseModel
                .find({ patientId: new mongoose_2.Types.ObjectId(patientId) })
                .select('_id')
                .exec();
            filter.caseId = { $in: cases.map((item) => item._id) };
        }
        const docs = await this.specimenModel
            .find(filter)
            .limit(query._count ?? 20)
            .exec();
        return this.bundle(await Promise.all(docs.map((doc) => this.specimenResource(doc))));
    }
    async diagnosticReport(id) {
        const report = await this.reportModel.findById(id).exec();
        if (!report)
            throw new common_1.NotFoundException('DiagnosticReport not found.');
        return this.diagnosticReportResource(report);
    }
    async searchDiagnosticReports(query) {
        const filter = {};
        if (query._id)
            filter._id = new mongoose_2.Types.ObjectId(query._id);
        if (query.identifier)
            filter.verificationCode = query.identifier.trim().toUpperCase();
        if (query.subject) {
            const patientId = this.stripType(query.subject, 'Patient');
            if (!mongoose_2.Types.ObjectId.isValid(patientId))
                throw new common_1.BadRequestException('Invalid subject.');
            const cases = await this.caseModel
                .find({ patientId: new mongoose_2.Types.ObjectId(patientId) })
                .select('_id')
                .exec();
            filter.caseId = { $in: cases.map((item) => item._id) };
        }
        if (query.status === 'final') {
            filter.status = { $in: ['SIGNED_OUT', 'AMENDED'] };
        }
        else if (query.status === 'preliminary') {
            filter.status = 'DRAFT';
        }
        if (query.date) {
            filter.signedOutAt = {
                $gte: new Date(`${query.date}T00:00:00.000Z`),
                $lte: new Date(`${query.date}T23:59:59.999Z`),
            };
        }
        const docs = await this.reportModel
            .find(filter)
            .sort({ signedOutAt: -1 })
            .limit(query._count ?? 20)
            .exec();
        return this.bundle(await Promise.all(docs.map((doc) => this.diagnosticReportResource(doc))));
    }
    async patientResource(patient) {
        return {
            resourceType: 'Patient',
            id: patient._id.toString(),
            identifier: [
                {
                    use: 'usual',
                    type: { text: 'Medical record number' },
                    system: 'urn:lims:mrn',
                    value: patient.mrn,
                },
            ],
            active: true,
            name: [{ use: 'official', family: patient.lastName, given: [patient.firstName] }],
            telecom: patient.phone ? [{ system: 'phone', value: patient.phone }] : [],
            gender: this.gender(patient.sex),
            birthDate: patient.dateOfBirth ? patient.dateOfBirth.toISOString().slice(0, 10) : undefined,
            address: patient.address ? [{ text: patient.address, country: 'NG' }] : [],
        };
    }
    serviceRequestResource(caseDoc) {
        const lab = caseDoc.labId.toString();
        return {
            resourceType: 'ServiceRequest',
            id: caseDoc._id.toString(),
            identifier: [{ system: 'urn:lims:accession', value: caseDoc.accessionNumber }],
            status: this.serviceStatus(caseDoc.status),
            intent: 'order',
            priority: caseDoc.priority === 'FROZEN' ? 'stat' : caseDoc.priority.toLowerCase(),
            code: { text: 'Histopathology examination', coding: [] },
            subject: { reference: `Patient/${caseDoc.patientId.toString()}` },
            authoredOn: caseDoc.receivedAt.toISOString(),
            requester: {
                display: caseDoc.referringClinician.name,
                ...(caseDoc.referringClinician.facility
                    ? { reference: `Organization/${caseDoc.referringClinician.facility}` }
                    : {}),
            },
            performer: [{ reference: `Organization/${lab}`, display: 'Histopathology laboratory' }],
            reasonCode: caseDoc.clinicalDiagnosis ? [{ text: caseDoc.clinicalDiagnosis }] : [],
            note: [{ text: caseDoc.clinicalHistory }],
        };
    }
    async specimenResource(specimen) {
        const caseDoc = await this.caseModel.findById(specimen.caseId).select('patientId').exec();
        return {
            resourceType: 'Specimen',
            id: specimen._id.toString(),
            identifier: [
                { system: 'urn:lims:barcode', value: specimen.barcode },
                { system: 'urn:lims:specimen-label', value: specimen.label },
            ],
            status: specimen.status === 'REJECTED' ? 'unavailable' : 'available',
            type: { text: specimen.specimenType },
            subject: {
                reference: `Patient/${caseDoc?.patientId.toString() ?? specimen.caseId.toString()}`,
            },
            receivedTime: specimen.receivedAt.toISOString(),
            collection: {
                collectedDateTime: specimen.collectedAt ? specimen.collectedAt.toISOString() : undefined,
                bodySite: { text: specimen.site },
            },
            note: specimen.grossDescription ? [{ text: specimen.grossDescription }] : [],
        };
    }
    async diagnosticReportResource(report) {
        const [caseDoc, patient] = await Promise.all([
            this.caseModel.findById(report.caseId).exec(),
            this.caseModel
                .findById(report.caseId)
                .exec()
                .then((item) => (item ? this.patientModel.findById(item.patientId).exec() : null)),
        ]);
        if (!caseDoc)
            throw new common_1.NotFoundException('Case not found for report.');
        const coding = report.coding;
        const conclusions = coding?.snomedCode
            ? [
                {
                    system: 'http://snomed.info/sct',
                    code: coding.snomedCode,
                    display: coding.snomedDisplay ?? undefined,
                },
            ]
            : [];
        return {
            resourceType: 'DiagnosticReport',
            id: report._id.toString(),
            identifier: [
                { system: 'urn:lims:accession', value: caseDoc.accessionNumber },
                ...(report.verificationCode
                    ? [{ system: 'urn:lims:verification', value: report.verificationCode }]
                    : []),
            ],
            status: this.reportStatus(report.status),
            category: [
                {
                    coding: [
                        {
                            system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                            code: 'PAT',
                            display: 'Pathology',
                        },
                    ],
                    text: 'Pathology',
                },
            ],
            code: {
                text: report.protocolSnapshot.cancerType,
                coding: coding?.snomedCode
                    ? [
                        {
                            system: 'http://snomed.info/sct',
                            code: coding.snomedCode,
                            display: coding.snomedDisplay ?? undefined,
                        },
                    ]
                    : [],
            },
            subject: {
                reference: `Patient/${caseDoc.patientId.toString()}`,
                display: patient ? `${patient.firstName} ${patient.lastName}` : undefined,
            },
            effectiveDateTime: (report.signedOutAt ?? report.updatedAt).toISOString(),
            issued: report.signedOutAt ? report.signedOutAt.toISOString() : undefined,
            performer: [
                {
                    reference: `Organization/${caseDoc.labId.toString()}`,
                    display: 'Histopathology laboratory',
                },
            ],
            resultsInterpreter: report.signedOutBy
                ? [{ reference: `Practitioner/${report.signedOutBy.toString()}` }]
                : [],
            conclusion: this.diagnosisText(report),
            conclusionCode: conclusions,
            presentedForm: [
                {
                    contentType: 'application/pdf',
                    url: `${this.config.get('PUBLIC_API_URL') ?? ''}/reports/${report._id.toString()}/pdf`,
                    title: `Report ${caseDoc.accessionNumber}`,
                },
            ],
            extension: [
                {
                    url: 'urn:lims:icdo3-morphology',
                    valueCodeableConcept: coding?.icdo3MorphologyCode
                        ? {
                            coding: [
                                {
                                    system: 'urn:oid:2.16.840.1.113883.6.43.1',
                                    code: coding.icdo3MorphologyCode,
                                    display: coding.icdo3MorphologyDisplay ?? undefined,
                                },
                            ],
                        }
                        : undefined,
                },
                {
                    url: 'urn:lims:icdo3-topography',
                    valueCodeableConcept: coding?.icdo3TopographyCode
                        ? {
                            coding: [
                                {
                                    system: 'urn:oid:2.16.840.1.113883.6.43.1',
                                    code: coding.icdo3TopographyCode,
                                    display: coding.icdo3TopographyDisplay ?? undefined,
                                },
                            ],
                        }
                        : undefined,
                },
            ],
        };
    }
    bundle(entries) {
        return {
            resourceType: 'Bundle',
            type: 'searchset',
            total: entries.length,
            entry: entries.map((resource) => ({ resource, search: { mode: 'match' } })),
        };
    }
    stripType(value, type) {
        return value.startsWith(`${type}/`) ? value.slice(type.length + 1) : value;
    }
    diagnosisText(report) {
        for (const key of ['finalDiagnosis', 'diagnosis']) {
            const value = report.data[key];
            if (typeof value === 'string' && value.trim())
                return value;
        }
        return report.narrative.slice(0, 1_000);
    }
    gender(sex) {
        if (sex === 'MALE')
            return 'male';
        if (sex === 'FEMALE')
            return 'female';
        if (sex === 'OTHER')
            return 'other';
        return 'unknown';
    }
    serviceStatus(status) {
        if (status === 'REPORTED' || status === 'AMENDED')
            return 'completed';
        return 'active';
    }
    reportStatus(status) {
        if (status === 'AMENDED')
            return 'corrected';
        if (status === 'SIGNED_OUT')
            return 'final';
        return 'preliminary';
    }
};
exports.FhirService = FhirService;
exports.FhirService = FhirService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(patient_schema_1.PatientModelName)),
    __param(1, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(2, (0, mongoose_1.InjectModel)(specimen_schema_1.SpecimenModelName)),
    __param(3, (0, mongoose_1.InjectModel)(report_schema_1.ReportModelName)),
    __param(4, (0, mongoose_1.InjectModel)(lab_schema_1.LabModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        config_1.ConfigService])
], FhirService);
//# sourceMappingURL=fhir.service.js.map