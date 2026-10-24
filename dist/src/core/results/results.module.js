"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const audit_module_1 = require("../audit/audit.module");
const notifications_module_1 = require("../notifications/notifications.module");
const catalog_module_1 = require("../catalog/catalog.module");
const case_schema_1 = require("../cases/case.schema");
const lab_schema_1 = require("../labs/lab.schema");
const patient_schema_1 = require("../patients/patient.schema");
const rules_module_1 = require("../rules/rules.module");
const test_requests_module_1 = require("../test-requests/test-requests.module");
const test_request_schema_1 = require("../test-requests/test-request.schema");
const user_schema_1 = require("../users/user.schema");
const results_controller_1 = require("./results.controller");
const results_service_1 = require("./results.service");
const result_pdf_service_1 = require("./result-pdf.service");
const result_schema_1 = require("./result.schema");
let ResultsModule = class ResultsModule {
};
exports.ResultsModule = ResultsModule;
exports.ResultsModule = ResultsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: result_schema_1.ResultSetModelName, schema: result_schema_1.ResultSetSchema },
                { name: result_schema_1.ResultVersionModelName, schema: result_schema_1.ResultVersionSchema },
                { name: test_request_schema_1.TestRequestModelName, schema: test_request_schema_1.TestRequestSchema },
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
                { name: lab_schema_1.LabModelName, schema: lab_schema_1.LabSchema },
                { name: patient_schema_1.PatientModelName, schema: patient_schema_1.PatientSchema },
                { name: user_schema_1.UserModelName, schema: user_schema_1.UserSchema },
            ]),
            catalog_module_1.CatalogModule,
            rules_module_1.RulesModule,
            test_requests_module_1.TestRequestsModule,
            audit_module_1.AuditModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [results_controller_1.ResultsController],
        providers: [results_service_1.ResultsService, result_pdf_service_1.ResultPdfService],
        exports: [results_service_1.ResultsService, result_pdf_service_1.ResultPdfService],
    })
], ResultsModule);
//# sourceMappingURL=results.module.js.map