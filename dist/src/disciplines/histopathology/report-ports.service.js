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
exports.HistopathologyReportPortsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const protocol_schema_1 = require("./protocols/protocol.schema");
const pdf_service_1 = require("./pdf/pdf.service");
const report_ports_1 = require("../../core/reports/report-ports");
let HistopathologyReportPortsService = class HistopathologyReportPortsService {
    protocolModel;
    pdf;
    registry;
    constructor(protocolModel, pdf, registry) {
        this.protocolModel = protocolModel;
        this.pdf = pdf;
        this.registry = registry;
    }
    onModuleInit() {
        this.registry.register('HISTOPATHOLOGY', {
            protocols: {
                findById: (protocolId, session) => this.findProtocol(protocolId, session),
            },
            renderer: {
                generateAndStore: (reportId) => this.pdf.generateAndStore(reportId),
                getOrGenerate: (reportId) => this.pdf.getOrGenerate(reportId),
            },
        });
    }
    async findProtocol(protocolId, session) {
        const protocol = await this.protocolModel.findById(protocolId).session(session).exec();
        return protocol ? protocol.toObject() : null;
    }
};
exports.HistopathologyReportPortsService = HistopathologyReportPortsService;
exports.HistopathologyReportPortsService = HistopathologyReportPortsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(protocol_schema_1.ProtocolModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        pdf_service_1.PdfService,
        report_ports_1.ReportPortRegistry])
], HistopathologyReportPortsService);
//# sourceMappingURL=report-ports.service.js.map