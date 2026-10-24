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
var Hl7Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hl7Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tenant_context_1 = require("../../common/context/tenant-context");
const case_schema_1 = require("../../core/cases/case.schema");
const cases_service_1 = require("../../core/cases/cases.service");
const lab_schema_1 = require("../../core/labs/lab.schema");
const patient_schema_1 = require("../../core/patients/patient.schema");
const report_schema_1 = require("../../core/reports/report.schema");
const user_schema_1 = require("../../core/users/user.schema");
const hl7_parser_1 = require("./hl7.parser");
let Hl7Service = Hl7Service_1 = class Hl7Service {
    config;
    cases;
    labModel;
    userModel;
    caseModel;
    patientModel;
    reportModel;
    logger = new common_1.Logger(Hl7Service_1.name);
    constructor(config, cases, labModel, userModel, caseModel, patientModel, reportModel) {
        this.config = config;
        this.cases = cases;
        this.labModel = labModel;
        this.userModel = userModel;
        this.caseModel = caseModel;
        this.patientModel = patientModel;
        this.reportModel = reportModel;
    }
    async ingest(raw) {
        let parsed;
        try {
            parsed = (0, hl7_parser_1.parseHl7Order)(raw);
        }
        catch (error) {
            return this.errorAck('', error instanceof Error ? error.message : 'Invalid HL7 message.');
        }
        const labCode = this.config.get('HL7_LAB_CODE') ?? 'HISTO';
        const lab = await this.labModel.findOne({ code: labCode.toUpperCase(), active: true }).exec();
        if (!lab)
            return this.errorAck(parsed.controlId, 'HL7 laboratory is not configured.');
        return (0, tenant_context_1.runWithTenant)({ labId: lab._id.toString() }, async () => {
            const user = await this.userModel
                .findOne({ role: { $in: ['LAB_ADMIN', 'SUPER_ADMIN'] }, active: true })
                .sort({ role: 1 })
                .exec();
            if (!user)
                return this.errorAck(parsed.controlId, 'No integration user is configured.');
            const actor = {
                id: user._id.toString(),
                labId: lab._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                subspecialties: user.subspecialties,
                disciplines: user.disciplines ?? [],
                labEnabledDisciplines: lab.enabledDisciplines ?? ['HISTOPATHOLOGY'],
            };
            try {
                const result = await this.cases.accession({
                    patient: {
                        mrn: parsed.patient.mrn,
                        firstName: parsed.patient.firstName,
                        lastName: parsed.patient.lastName,
                        sex: parsed.patient.sex,
                        dateOfBirth: parsed.patient.dateOfBirth,
                        age: parsed.patient.age,
                        phone: parsed.patient.phone,
                        address: parsed.patient.address,
                    },
                    referringClinician: {
                        name: parsed.referringClinician.name,
                        facility: parsed.referringClinician.facility,
                        phone: parsed.referringClinician.phone,
                    },
                    clinicalHistory: parsed.clinicalHistory,
                    clinicalDiagnosis: parsed.clinicalDiagnosis,
                    priority: parsed.priority,
                    subspecialty: undefined,
                    specimens: [
                        {
                            specimenType: parsed.specimenType,
                            site: parsed.site,
                        },
                    ],
                }, actor);
                return {
                    ack: this.ack(parsed.controlId, true, result.accessionNumber),
                    caseId: result.id,
                    accessionNumber: result.accessionNumber,
                };
            }
            catch (error) {
                this.logger.warn({ err: error, controlId: parsed.controlId }, 'HL7 order rejected.');
                return this.errorAck(parsed.controlId, error instanceof Error ? error.message : 'Order could not be accessioned.');
            }
        });
    }
    async buildOru(caseId) {
        const caseDoc = await this.caseModel.findById(caseId).exec();
        if (!caseDoc)
            throw new common_1.NotFoundException('Case not found.');
        const [patient, report, lab] = await Promise.all([
            this.patientModel.findById(caseDoc.patientId).exec(),
            this.reportModel.findOne({ caseId: caseDoc._id }).exec(),
            this.labModel.findById(caseDoc.labId).exec(),
        ]);
        if (!patient)
            throw new common_1.NotFoundException('Patient not found.');
        if (!report || report.status === 'DRAFT') {
            throw new common_1.BadGatewayException('Only a signed report can produce an ORU message.');
        }
        const now = new Date();
        const stamp = now
            .toISOString()
            .replace(/[-:TZ.]/g, '')
            .slice(0, 14);
        const diagnosis = this.diagnosisText(report);
        const segments = [
            `MSH|^~\\&|HISTOLIMS|${escapeHl7(lab?.name ?? 'LAB')}|EMR|HOSPITAL|${stamp}||ORU^R01|${report._id.toString()}|P|2.5`,
            `PID|1||${escapeHl7(patient.mrn)}||${escapeHl7(patient.lastName)}^${escapeHl7(patient.firstName)}||${patient.dateOfBirth ? patient.dateOfBirth.toISOString().slice(0, 10).replace(/-/g, '') : ''}|${patient.sex.charAt(0)}`,
            `OBR|1||${escapeHl7(caseDoc.accessionNumber)}|${escapeHl7(report.protocolSnapshot.cancerType)}^${escapeHl7(report.protocolSnapshot.key)}^L|||${(report.signedOutAt ?? now).toISOString()}|${(report.signedOutAt ?? now).toISOString()}|||${escapeHl7(caseDoc.referringClinician.name)}||||||||F`,
            `OBX|1|TX|${escapeHl7(report.verificationCode ?? 'REPORT')}||${escapeHl7(diagnosis)}||||||F`,
            `OBX|2|TX|NARRATIVE||${escapeHl7(report.narrative)}||||||F`,
        ];
        return segments.join('\r') + '\r';
    }
    ackFrame(ack) {
        return (0, hl7_parser_1.wrapMllp)(ack);
    }
    ack(controlId, ok, message) {
        const stamp = new Date()
            .toISOString()
            .replace(/[-:TZ.]/g, '')
            .slice(0, 14);
        return [
            `MSH|^~\\&|HISTOLIMS|LAB|EMR|HOSPITAL|${stamp}||ACK^O01|ACK-${controlId}|P|2.5`,
            `MSA|${ok ? 'AA' : 'AE'}|${escapeHl7(controlId)}|${escapeHl7(message)}`,
        ].join('\r');
    }
    errorAck(controlId, message) {
        return { ack: this.ack(controlId, false, message), error: message };
    }
    diagnosisText(report) {
        for (const key of ['finalDiagnosis', 'diagnosis']) {
            const value = report.data[key];
            if (typeof value === 'string' && value.trim())
                return value.trim();
        }
        return report.narrative.slice(0, 1_000);
    }
};
exports.Hl7Service = Hl7Service;
exports.Hl7Service = Hl7Service = Hl7Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(lab_schema_1.LabModelName)),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.UserModelName)),
    __param(4, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(5, (0, mongoose_1.InjectModel)(patient_schema_1.PatientModelName)),
    __param(6, (0, mongoose_1.InjectModel)(report_schema_1.ReportModelName)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        cases_service_1.CasesService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], Hl7Service);
function escapeHl7(value) {
    return value
        .replaceAll('\\', '\\E\\')
        .replaceAll('|', '\\F\\')
        .replaceAll('\r', ' ')
        .replaceAll('\n', ' ');
}
//# sourceMappingURL=hl7.service.js.map