"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const case_schema_1 = require("../cases/case.schema");
const custody_module_1 = require("../custody/custody.module");
const jobs_module_1 = require("../jobs/jobs.module");
const lab_schema_1 = require("../labs/lab.schema");
const patient_schema_1 = require("../patients/patient.schema");
const qa_module_1 = require("../../extensions/qa/qa.module");
const terminology_module_1 = require("../../extensions/terminology/terminology.module");
const user_schema_1 = require("../users/user.schema");
const report_assembler_service_1 = require("./report-assembler.service");
const report_version_schema_1 = require("./report-version.schema");
const report_schema_1 = require("./report.schema");
const reports_controller_1 = require("./reports.controller");
const report_ports_1 = require("./report-ports");
const test_requests_module_1 = require("../test-requests/test-requests.module");
const reports_service_1 = require("./reports.service");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: report_schema_1.ReportModelName, schema: report_schema_1.ReportSchema },
                { name: report_version_schema_1.ReportVersionModelName, schema: report_version_schema_1.ReportVersionSchema },
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
                { name: patient_schema_1.PatientModelName, schema: patient_schema_1.PatientSchema },
                { name: user_schema_1.UserModelName, schema: user_schema_1.UserSchema },
                { name: lab_schema_1.LabModelName, schema: lab_schema_1.LabSchema },
            ]),
            custody_module_1.CustodyModule,
            jobs_module_1.JobsModule,
            qa_module_1.QaModule,
            terminology_module_1.TerminologyModule,
            report_ports_1.ReportPortsModule,
            test_requests_module_1.TestRequestsModule,
        ],
        controllers: [reports_controller_1.ReportsController],
        providers: [reports_service_1.ReportsService, report_assembler_service_1.ReportAssemblerService],
        exports: [reports_service_1.ReportsService, report_assembler_service_1.ReportAssemblerService],
    })
], ReportsModule);
//# sourceMappingURL=reports.module.js.map