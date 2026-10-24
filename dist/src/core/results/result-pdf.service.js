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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultPdfService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const case_schema_1 = require("../cases/case.schema");
const lab_schema_1 = require("../labs/lab.schema");
const patient_schema_1 = require("../patients/patient.schema");
const user_schema_1 = require("../users/user.schema");
const result_schema_1 = require("./result.schema");
const INK = '#1A1D1F';
const MUTED = '#68706B';
const ACCENT = '#B8391D';
const LINE = '#D8D3C7';
let ResultPdfService = class ResultPdfService {
    resultModel;
    caseModel;
    patientModel;
    labModel;
    userModel;
    config;
    constructor(resultModel, caseModel, patientModel, labModel, userModel, config) {
        this.resultModel = resultModel;
        this.caseModel = caseModel;
        this.patientModel = patientModel;
        this.labModel = labModel;
        this.userModel = userModel;
        this.config = config;
    }
    async generateAndStore(resultId) {
        const result = await this.resultModel.findById(resultId).exec();
        if (!result)
            throw new common_1.NotFoundException('Result not found.');
        if (result.status !== 'VERIFIED' && result.status !== 'RELEASED') {
            throw new common_1.BadRequestException('Only a verified or released result can be printed.');
        }
        const [caseDoc, patient, lab, verifier] = await Promise.all([
            this.caseModel.findById(result.caseId).exec(),
            this.patientModel.findById(result.patientId).exec(),
            this.caseModel
                .findById(result.caseId)
                .then((found) => (found ? this.labModel.findById(found.labId).exec() : null)),
            result.verifiedBy ? this.userModel.findById(result.verifiedBy).exec() : null,
        ]);
        if (!caseDoc || !patient || !lab)
            throw new common_1.NotFoundException('Result context is incomplete.');
        const buffer = await this.renderResult({ result, caseDoc, patient, lab, verifier });
        return this.store(buffer, lab._id.toString(), `${caseDoc.accessionNumber}-${result.testCode}-result.pdf`, 'results');
    }
    async generateCumulative(report, labId) {
        const lab = await this.labModel.findById(labId).exec();
        const buffer = await this.renderCumulative(report, lab);
        return this.store(buffer, labId, `${report.patient.mrn}-cumulative.pdf`, 'cumulative');
    }
    async renderResult(input) {
        const doc = new pdfkit_1.default({ size: 'A4', margin: 48, bufferPages: true });
        const chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        const done = new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));
        const { result, caseDoc, patient, lab, verifier } = input;
        this.letterhead(doc, lab);
        doc.moveDown(1.4);
        doc.fillColor(INK).font('Helvetica-Bold').fontSize(16).text('Diagnostic result report');
        doc
            .fillColor(MUTED)
            .font('Helvetica')
            .fontSize(9)
            .text(`${result.discipline.replace('_', ' ')} · ${result.testCode} · Version ${result.currentVersion}`);
        doc.moveDown(0.8);
        this.detailRow(doc, 'Patient', `${patient.firstName} ${patient.lastName}`, 'MRN', patient.mrn);
        this.detailRow(doc, 'Accession', caseDoc.accessionNumber, 'Received', caseDoc.receivedAt.toISOString().slice(0, 10));
        doc.moveDown(0.5);
        doc.moveTo(48, doc.y).lineTo(547, doc.y).strokeColor(LINE).stroke();
        doc.moveDown(0.8);
        doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(11).text(result.testName.toUpperCase());
        doc.moveDown(0.7);
        const tableTop = doc.y;
        const columns = [48, 210, 330, 400, 490];
        doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(8);
        doc
            .text('Analyte', columns[0], tableTop)
            .text('Result', columns[1], tableTop)
            .text('Reference', columns[2], tableTop)
            .text('Flag', columns[3], tableTop);
        doc.moveDown(0.5);
        doc.moveTo(48, doc.y).lineTo(547, doc.y).strokeColor(LINE).stroke();
        doc.moveDown(0.35);
        for (const value of result.values) {
            const y = doc.y;
            const critical = value.flag === 'CRITICAL_LOW' || value.flag === 'CRITICAL_HIGH';
            doc.fillColor(INK).font('Helvetica').fontSize(9);
            doc.text(value.analyteName ?? value.analyteKey, columns[0], y, { width: 150 });
            doc.text(`${value.value ?? '—'} ${value.unit ?? ''}`, columns[1], y, { width: 105 });
            doc.fillColor(MUTED).text(value.referenceText ?? '—', columns[2], y, { width: 60 });
            doc
                .fillColor(critical ? '#B8391D' : value.flag === 'NORMAL' ? MUTED : '#9A6411')
                .font('Helvetica-Bold')
                .text(value.flag.replace('_', ' '), columns[3], y, { width: 90 });
            doc.moveDown(0.4);
        }
        doc.moveDown(0.8);
        doc.moveTo(48, doc.y).lineTo(547, doc.y).strokeColor(LINE).stroke();
        doc.moveDown(0.8);
        if (result.comment) {
            doc.fillColor(INK).font('Helvetica-Bold').fontSize(9).text('Comment');
            doc.fillColor(INK).font('Helvetica').fontSize(9).text(result.comment, { width: 480 });
            doc.moveDown(0.8);
        }
        doc.fillColor(MUTED).font('Helvetica').fontSize(8);
        doc.text(`Verified by ${verifier?.name ?? 'Laboratory scientist'} · ${result.verifiedAt?.toISOString().slice(0, 16).replace('T', ' ') ?? '—'}`);
        if (result.releasedAt)
            doc.text(`Released ${result.releasedAt.toISOString().slice(0, 16).replace('T', ' ')}`);
        doc.moveDown(1.2);
        this.footer(doc, lab);
        doc.end();
        return done;
    }
    async renderCumulative(report, lab) {
        const doc = new pdfkit_1.default({ size: 'A4', margin: 48, bufferPages: true });
        const chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        const done = new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));
        this.letterhead(doc, lab);
        doc.moveDown(1.2);
        doc.fillColor(INK).font('Helvetica-Bold').fontSize(16).text('Cumulative laboratory report');
        doc
            .fillColor(MUTED)
            .font('Helvetica')
            .fontSize(9)
            .text(`${report.patient.firstName} ${report.patient.lastName} · ${report.patient.mrn}`);
        doc.moveDown(0.8);
        for (const group of report.results) {
            if (doc.y > 690)
                doc.addPage();
            doc
                .fillColor(ACCENT)
                .font('Helvetica-Bold')
                .fontSize(10)
                .text(`${group.testName} · ${group.discipline.replace('_', ' ')}`);
            const top = doc.y + 6;
            const columns = [48, 250, 340, 430];
            doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(7);
            doc
                .text('Analyte', columns[0], top)
                .text('Latest', columns[1], top)
                .text('Reference', columns[2], top)
                .text('Flag', columns[3], top);
            doc.moveDown(0.5);
            for (const value of group.latest.values) {
                const y = doc.y;
                doc.fillColor(INK).font('Helvetica').fontSize(8);
                doc.text(value.analyteName ?? value.analyteKey, columns[0], y, { width: 180 });
                doc.text(`${value.value ?? '—'} ${value.unit ?? ''}`, columns[1], y, { width: 80 });
                doc.fillColor(MUTED).text(value.referenceText ?? '—', columns[2], y, { width: 80 });
                doc
                    .fillColor(value.critical ? '#B8391D' : MUTED)
                    .font('Helvetica-Bold')
                    .text(value.flag.replace('_', ' '), columns[3], y, { width: 80 });
                doc.moveDown(0.35);
            }
            doc.moveDown(0.7);
        }
        this.footer(doc, lab);
        doc.end();
        return done;
    }
    letterhead(doc, lab) {
        doc.rect(48, 42, 5, 34).fill(ACCENT);
        doc
            .fillColor(INK)
            .font('Helvetica-Bold')
            .fontSize(13)
            .text(lab?.name ?? 'Laboratory', 60, 44);
        doc
            .fillColor(MUTED)
            .font('Helvetica')
            .fontSize(8)
            .text([lab?.address, lab?.phone, lab?.email].filter(Boolean).join(' · '), 60, 61, {
            width: 450,
        });
    }
    detailRow(doc, labelA, valueA, labelB, valueB) {
        const y = doc.y;
        doc.fillColor(MUTED).font('Helvetica').fontSize(8).text(labelA, 48, y);
        doc
            .fillColor(INK)
            .font('Helvetica-Bold')
            .fontSize(10)
            .text(valueA, 100, y - 1);
        doc.fillColor(MUTED).font('Helvetica').fontSize(8).text(labelB, 330, y);
        doc
            .fillColor(INK)
            .font('Helvetica-Bold')
            .fontSize(10)
            .text(valueB, 380, y - 1);
        doc.y = y + 18;
    }
    footer(doc, lab) {
        doc
            .fillColor(MUTED)
            .font('Helvetica')
            .fontSize(7)
            .text(`${lab?.name ?? 'Laboratory'} · This is a laboratory-generated diagnostic result. Verify with the issuing laboratory.`, 48, 790, { width: 500, align: 'center' });
    }
    async store(buffer, labId, filename, folder) {
        const dir = node_path_1.default.resolve(this.config.get('STORAGE_DIR') ?? './storage', folder, labId);
        await (0, promises_1.mkdir)(dir, { recursive: true });
        const safe = filename.replace(/[^A-Za-z0-9_.-]/g, '_');
        const filePath = node_path_1.default.join(dir, `${Date.now()}-${safe}`);
        await (0, promises_1.writeFile)(filePath, buffer);
        return { path: filePath, filename: safe };
    }
};
exports.ResultPdfService = ResultPdfService;
exports.ResultPdfService = ResultPdfService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(result_schema_1.ResultSetModelName)),
    __param(1, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(2, (0, mongoose_1.InjectModel)(patient_schema_1.PatientModelName)),
    __param(3, (0, mongoose_1.InjectModel)(lab_schema_1.LabModelName)),
    __param(4, (0, mongoose_1.InjectModel)(user_schema_1.UserModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        config_1.ConfigService])
], ResultPdfService);
//# sourceMappingURL=result-pdf.service.js.map