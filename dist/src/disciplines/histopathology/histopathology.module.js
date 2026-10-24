"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistopathologyModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const cases_module_1 = require("../../core/cases/cases.module");
const report_ports_1 = require("../../core/reports/report-ports");
const custody_module_1 = require("../../core/custody/custody.module");
const custody_ports_1 = require("../../core/custody/custody-ports");
const audit_module_1 = require("../../core/audit/audit.module");
const case_schema_1 = require("../../core/cases/case.schema");
const patient_schema_1 = require("../../core/patients/patient.schema");
const specimen_schema_1 = require("../../core/specimens/specimen.schema");
const block_schema_1 = require("./blocks/block.schema");
const case_artifacts_service_1 = require("./case-artifacts.service");
const slide_schema_1 = require("./slides/slide.schema");
const protocol_schema_1 = require("./protocols/protocol.schema");
const pdf_module_1 = require("./pdf/pdf.module");
const report_ports_service_1 = require("./report-ports.service");
const label_artifacts_service_1 = require("./label-artifacts.service");
const labels_module_1 = require("../../core/labels/labels.module");
const barcode_resolver_service_1 = require("./custody/barcode-resolver.service");
const histopathology_custody_ports_service_1 = require("./custody/histopathology-custody-ports.service");
const locator_service_1 = require("./custody/locator.service");
const report_propagation_service_1 = require("./custody/report-propagation.service");
const scan_service_1 = require("./custody/scan.service");
let HistopathologyModule = class HistopathologyModule {
};
exports.HistopathologyModule = HistopathologyModule;
exports.HistopathologyModule = HistopathologyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: block_schema_1.BlockModelName, schema: block_schema_1.BlockSchema },
                { name: slide_schema_1.SlideModelName, schema: slide_schema_1.SlideSchema },
                { name: protocol_schema_1.ProtocolModelName, schema: protocol_schema_1.ProtocolSchema },
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
                { name: patient_schema_1.PatientModelName, schema: patient_schema_1.PatientSchema },
                { name: specimen_schema_1.SpecimenModelName, schema: specimen_schema_1.SpecimenSchema },
            ]),
            cases_module_1.CasesModule,
            pdf_module_1.PdfModule,
            report_ports_1.ReportPortsModule,
            custody_module_1.CustodyModule,
            custody_ports_1.CustodyPortsModule,
            audit_module_1.AuditModule,
            labels_module_1.LabelsModule,
        ],
        providers: [
            case_artifacts_service_1.HistopathologyCaseArtifactsService,
            report_ports_service_1.HistopathologyReportPortsService,
            barcode_resolver_service_1.BarcodeResolverService,
            scan_service_1.ScanService,
            locator_service_1.LocatorService,
            report_propagation_service_1.ReportPropagationService,
            histopathology_custody_ports_service_1.HistopathologyCustodyPortsService,
            label_artifacts_service_1.HistopathologyLabelArtifactsService,
        ],
    })
], HistopathologyModule);
//# sourceMappingURL=histopathology.module.js.map