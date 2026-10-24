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
exports.InstrumentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lab_schema_1 = require("../../core/labs/lab.schema");
const test_request_schema_1 = require("../../core/test-requests/test-request.schema");
const tenant_context_1 = require("../../common/context/tenant-context");
const instrument_parser_1 = require("./instrument.parser");
const instrument_schema_1 = require("./instrument.schema");
let InstrumentsService = class InstrumentsService {
    messageModel;
    requestModel;
    labModel;
    constructor(messageModel, requestModel, labModel) {
        this.messageModel = messageModel;
        this.requestModel = requestModel;
        this.labModel = labModel;
    }
    async ingest(protocol, raw) {
        if (!raw.trim())
            throw new common_1.BadRequestException('An instrument message is required.');
        const tenant = (0, tenant_context_1.currentTenant)();
        const lab = tenant ? await this.labModel.findById(tenant.labId).exec() : null;
        const parsed = (0, instrument_parser_1.parseInstrumentMessage)(protocol, raw);
        const request = parsed.accessionNumber
            ? await this.requestModel.findOne({ accessionNumber: parsed.accessionNumber }).exec()
            : null;
        const message = await this.messageModel.create({
            protocol,
            labCode: lab?.code ?? null,
            accessionNumber: parsed.accessionNumber,
            testCode: parsed.testCode,
            patientName: parsed.patientName,
            values: parsed.values,
            status: request ? 'MATCHED' : 'UNMATCHED',
            error: request ? null : 'No matching accession in this laboratory.',
            rawMessage: raw,
        });
        return this.toMessage(message);
    }
    async list() {
        const rows = await this.messageModel.find({}).sort({ createdAt: -1 }).limit(100).exec();
        return rows.map((row) => this.toMessage(row));
    }
    toMessage(row) {
        return {
            id: row._id.toString(),
            protocol: row.protocol,
            labCode: row.labCode,
            accessionNumber: row.accessionNumber,
            testCode: row.testCode,
            patientName: row.patientName,
            values: row.values,
            status: row.status,
            error: row.error,
            rawMessage: row.rawMessage,
            createdAt: row.createdAt.toISOString(),
        };
    }
};
exports.InstrumentsService = InstrumentsService;
exports.InstrumentsService = InstrumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(instrument_schema_1.InstrumentMessageModelName)),
    __param(1, (0, mongoose_1.InjectModel)(test_request_schema_1.TestRequestModelName)),
    __param(2, (0, mongoose_1.InjectModel)(lab_schema_1.LabModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], InstrumentsService);
//# sourceMappingURL=instruments.service.js.map