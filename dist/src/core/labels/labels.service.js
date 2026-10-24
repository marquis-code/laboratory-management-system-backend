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
exports.LabelsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pdfkit_1 = __importDefault(require("pdfkit"));
const bwip_js_1 = __importDefault(require("bwip-js"));
const case_schema_1 = require("../cases/case.schema");
const lab_schema_1 = require("../labs/lab.schema");
const patient_schema_1 = require("../patients/patient.schema");
const specimen_schema_1 = require("../specimens/specimen.schema");
const label_artifacts_1 = require("./label-artifacts");
const LABEL_WIDTH = 141.73;
const LABEL_HEIGHT = 70.87;
let LabelsService = class LabelsService {
    caseModel;
    patientModel;
    specimenModel;
    labModel;
    labelArtifacts;
    constructor(caseModel, patientModel, specimenModel, labModel, labelArtifacts) {
        this.caseModel = caseModel;
        this.patientModel = patientModel;
        this.specimenModel = specimenModel;
        this.labModel = labModel;
        this.labelArtifacts = labelArtifacts;
    }
    async entityLabel(entityType, id, format, symbology) {
        const type = entityType.toUpperCase();
        if (type !== 'SPECIMEN' && type !== 'BLOCK' && type !== 'SLIDE') {
            throw new common_1.BadRequestException('Label entity type must be specimen, block or slide.');
        }
        const objectId = new mongoose_2.Types.ObjectId(id);
        if (type === 'SPECIMEN') {
            const specimen = await this.specimenModel.findById(objectId).exec();
            if (!specimen)
                throw new common_1.NotFoundException('Specimen not found.');
            const [caseDoc, lab] = await Promise.all([
                this.caseModel.findById(specimen.caseId).exec(),
                this.caseModel
                    .findById(specimen.caseId)
                    .then((found) => (found ? this.labModel.findById(found.labId).exec() : null)),
            ]);
            if (!caseDoc)
                throw new common_1.NotFoundException('Case not found.');
            const patient = await this.patientModel.findById(caseDoc.patientId).exec();
            if (!lab)
                throw new common_1.NotFoundException('Laboratory not found.');
            const data = this.specimenLabel(specimen, caseDoc, patient, lab);
            return this.render([data], format, symbology, caseDoc.accessionNumber);
        }
        const artifact = await this.artifact(type, id);
        if (!artifact)
            throw new common_1.NotFoundException(`${type === 'BLOCK' ? 'Block' : 'Slide'} not found.`);
        const [caseDoc, lab] = await Promise.all([
            this.caseModel.findById(artifact.caseId).exec(),
            this.caseModel
                .findById(artifact.caseId)
                .then((found) => (found ? this.labModel.findById(found.labId).exec() : null)),
        ]);
        if (!caseDoc || !lab)
            throw new common_1.NotFoundException('Cannot resolve label.');
        const patient = await this.patientModel.findById(caseDoc.patientId).exec();
        return this.render([this.artifactLabel(artifact, caseDoc, patient, lab)], format, symbology, caseDoc.accessionNumber);
    }
    async caseLabels(caseId, format, symbology, include = 'all') {
        const caseDoc = await this.caseModel.findById(caseId).exec();
        if (!caseDoc)
            throw new common_1.NotFoundException('Case not found.');
        const [patient, lab, specimens, artifacts] = await Promise.all([
            this.patientModel.findById(caseDoc.patientId).exec(),
            this.labModel.findById(caseDoc.labId).exec(),
            this.specimenModel.find({ caseId: caseDoc._id }).sort({ sequence: 1 }).exec(),
            this.labelArtifacts.forCase(caseDoc._id.toString()),
        ]);
        if (!lab)
            throw new common_1.NotFoundException('Laboratory not found.');
        const labels = [];
        if (include === 'all' || include === 'specimens') {
            for (const specimen of specimens) {
                labels.push(this.specimenLabel(specimen, caseDoc, patient, lab));
            }
        }
        for (const artifact of artifacts) {
            if (include === 'all' ||
                (include === 'blocks' && artifact.kind === 'BLOCK') ||
                (include === 'slides' && artifact.kind === 'SLIDE')) {
                labels.push(this.artifactLabel(artifact, caseDoc, patient, lab));
            }
        }
        if (labels.length === 0) {
            throw new common_1.NotFoundException('No printable labels exist for this case yet.');
        }
        return this.render(labels, format, symbology, caseDoc.accessionNumber);
    }
    specimenLabel(specimen, caseDoc, patient, lab) {
        return {
            barcode: specimen.barcode,
            label: specimen.label,
            accession: caseDoc.accessionNumber,
            labCode: lab.code,
            patientName: patient ? this.patientName(patient) : '',
            detail: `${specimen.specimenType} · ${specimen.site}`,
            date: this.date(specimen.receivedAt ?? specimen.createdAt),
            kind: 'SPECIMEN',
        };
    }
    artifactLabel(artifact, caseDoc, patient, lab) {
        return {
            barcode: artifact.barcode,
            label: artifact.label,
            accession: caseDoc.accessionNumber,
            labCode: lab.code,
            patientName: patient ? this.patientName(patient) : '',
            detail: artifact.detail,
            date: this.date(artifact.date),
            kind: artifact.kind,
        };
    }
    async artifact(type, id) {
        const provider = this.labelArtifacts.get();
        if (!provider)
            throw new common_1.NotFoundException('No label provider is registered.');
        return provider.entity(type, id);
    }
    async render(labels, format, symbology, accession) {
        if (format === 'zpl') {
            return {
                body: labels.map((label) => this.zpl(label, symbology)).join('\n'),
                contentType: 'text/plain; charset=utf-8',
                filename: `${accession}-labels.zpl`,
            };
        }
        if (format === 'svg') {
            if (labels.length !== 1) {
                throw new common_1.BadRequestException('SVG preview supports one label at a time.');
            }
            const svg = await this.svg(labels[0], symbology);
            return {
                body: svg,
                contentType: 'image/svg+xml; charset=utf-8',
                filename: `${accession}-${labels[0]?.label ?? 'label'}.svg`,
            };
        }
        const body = await this.pdf(labels, symbology);
        return {
            body,
            contentType: 'application/pdf',
            filename: `${accession}-labels.pdf`,
        };
    }
    async symbol(barcode, symbology) {
        return bwip_js_1.default.toBuffer({
            bcid: symbology === 'qr' ? 'qrcode' : 'datamatrix',
            text: barcode,
            scale: 4,
            height: symbology === 'qr' ? 12 : 12,
            includetext: false,
            backgroundcolor: 'FFFFFF',
            padding: 1,
        });
    }
    async pdf(labels, symbology) {
        const doc = new pdfkit_1.default({
            size: [LABEL_WIDTH, LABEL_HEIGHT],
            margin: 0,
            autoFirstPage: false,
            info: { Title: 'Histopathology labels', Creator: 'Histopathology LIMS' },
        });
        const chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        const finished = new Promise((resolve, reject) => {
            doc.on('end', () => resolve());
            doc.on('error', (error) => reject(error));
        });
        for (const label of labels) {
            doc.addPage({ size: [LABEL_WIDTH, LABEL_HEIGHT], margin: 0 });
            doc
                .rect(1, 1, LABEL_WIDTH - 2, LABEL_HEIGHT - 2)
                .strokeColor('#A8A29A')
                .lineWidth(0.4)
                .stroke();
            const png = await this.symbol(label.barcode, symbology);
            doc.image(png, 4, 14, { fit: [44, 44] });
            doc
                .font('Helvetica-Bold')
                .fontSize(5.4)
                .fillColor('#5F6663')
                .text(`${label.labCode} · ${label.accession}`, 52, 5, { width: 86 });
            doc
                .font('Helvetica-Bold')
                .fontSize(15)
                .fillColor('#171A1C')
                .text(label.label, 52, 14, { width: 50 });
            doc
                .font('Helvetica-Bold')
                .fontSize(5.2)
                .fillColor('#171A1C')
                .text(label.detail.toUpperCase(), 52, 37, { width: 86, height: 15, ellipsis: true });
            doc
                .font('Helvetica')
                .fontSize(5.2)
                .fillColor('#3E4642')
                .text(this.ascii(label.patientName), 52, 50, { width: 86, ellipsis: true });
            doc
                .font('Courier')
                .fontSize(4.6)
                .fillColor('#5F6663')
                .text(label.barcode, 52, 61, { width: 86, ellipsis: true });
            doc
                .font('Helvetica')
                .fontSize(4.4)
                .fillColor('#7A817C')
                .text(label.date, 4, 61, { width: 44, align: 'center' });
        }
        doc.end();
        await finished;
        return Buffer.concat(chunks);
    }
    zpl(label, symbology) {
        const safe = (value) => this.ascii(value).replace(/[\^~\\]/g, ' ');
        const symbol = symbology === 'qr'
            ? `^FO20,40^BQN,2,5^FDQA,${safe(label.barcode)}^FS`
            : `^FO20,64^BXN,5,200,0,0,1^FD${safe(label.barcode)}^FS`;
        return [
            '^XA',
            '^PW400',
            '^LL203',
            '^CI28',
            symbol,
            `^FO170,16^A0N,20,20^FD${safe(label.labCode)} ${safe(label.accession)}^FS`,
            `^FO170,42^A0N,38,38^FD${safe(label.label)}^FS`,
            `^FO170,88^A0N,15,15^FD${safe(label.detail).slice(0, 36)}^FS`,
            `^FO170,108^A0N,15,15^FD${safe(label.patientName).slice(0, 36)}^FS`,
            `^FO170,132^A0N,13,13^FD${safe(label.barcode)}^FS`,
            `^FO170,156^A0N,13,13^FD${safe(label.date)}^FS`,
            '^XZ',
        ].join('\n');
    }
    async svg(label, symbology) {
        const symbolSvg = bwip_js_1.default.toSVG({
            bcid: symbology === 'qr' ? 'qrcode' : 'datamatrix',
            text: label.barcode,
            scale: 3,
            padding: 1,
            backgroundcolor: 'FFFFFF',
        });
        const encoded = Buffer.from(symbolSvg, 'utf8').toString('base64');
        const escape = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="250" viewBox="0 0 500 250" role="img" aria-label="Label for ${escape(label.label)} ${escape(label.barcode)}">
  <rect width="500" height="250" fill="#ffffff"/>
  <rect x="4" y="4" width="492" height="242" fill="none" stroke="#a8a29a" stroke-width="2"/>
  <image href="data:image/svg+xml;base64,${encoded}" x="16" y="52" width="156" height="156"/>
  <g font-family="Helvetica, Arial, sans-serif" fill="#171a1c">
    <text x="190" y="34" font-size="18" font-weight="700" fill="#5f6663">${escape(label.labCode)} · ${escape(label.accession)}</text>
    <text x="190" y="88" font-size="54" font-weight="700">${escape(label.label)}</text>
    <text x="190" y="124" font-size="17" font-weight="700">${escape(label.detail.toUpperCase()).slice(0, 44)}</text>
    <text x="190" y="150" font-size="17">${escape(label.patientName).slice(0, 44)}</text>
    <text x="190" y="190" font-family="monospace" font-size="14" fill="#5f6663">${escape(label.barcode)}</text>
    <text x="190" y="218" font-size="14" fill="#7a817c">${escape(label.date)}</text>
    <text x="16" y="232" font-size="13" fill="#7a817c">${escape(label.kind)}</text>
  </g>
</svg>`;
    }
    patientName(patient) {
        return `${patient.firstName} ${patient.lastName}`.toUpperCase();
    }
    date(value) {
        return value.toISOString().slice(0, 10);
    }
    ascii(value) {
        return value
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\x20-\x7E]/g, '');
    }
};
exports.LabelsService = LabelsService;
exports.LabelsService = LabelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(1, (0, mongoose_1.InjectModel)(patient_schema_1.PatientModelName)),
    __param(2, (0, mongoose_1.InjectModel)(specimen_schema_1.SpecimenModelName)),
    __param(3, (0, mongoose_1.InjectModel)(lab_schema_1.LabModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        label_artifacts_1.LabelArtifactRegistry])
], LabelsService);
//# sourceMappingURL=labels.service.js.map