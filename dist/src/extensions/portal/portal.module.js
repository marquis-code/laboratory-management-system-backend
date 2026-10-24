"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("../../core/auth/auth.module");
const case_schema_1 = require("../../core/cases/case.schema");
const custody_module_1 = require("../../core/custody/custody.module");
const lab_schema_1 = require("../../core/labs/lab.schema");
const notifications_module_1 = require("../../core/notifications/notifications.module");
const patient_schema_1 = require("../../core/patients/patient.schema");
const pdf_module_1 = require("../../disciplines/histopathology/pdf/pdf.module");
const results_module_1 = require("../../core/results/results.module");
const result_schema_1 = require("../../core/results/result.schema");
const report_assembler_service_1 = require("../../core/reports/report-assembler.service");
const report_version_schema_1 = require("../../core/reports/report-version.schema");
const report_schema_1 = require("../../core/reports/report.schema");
const user_schema_1 = require("../../core/users/user.schema");
const portal_token_schema_1 = require("./portal-token.schema");
const portal_controller_1 = require("./portal.controller");
const portal_service_1 = require("./portal.service");
let PortalModule = class PortalModule {
};
exports.PortalModule = PortalModule;
exports.PortalModule = PortalModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            custody_module_1.CustodyModule,
            pdf_module_1.PdfModule,
            results_module_1.ResultsModule,
            notifications_module_1.NotificationsModule,
            mongoose_1.MongooseModule.forFeature([
                { name: portal_token_schema_1.PortalTokenModelName, schema: portal_token_schema_1.PortalTokenSchema },
                { name: user_schema_1.UserModelName, schema: user_schema_1.UserSchema },
                { name: lab_schema_1.LabModelName, schema: lab_schema_1.LabSchema },
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
                { name: patient_schema_1.PatientModelName, schema: patient_schema_1.PatientSchema },
                { name: report_schema_1.ReportModelName, schema: report_schema_1.ReportSchema },
                { name: report_version_schema_1.ReportVersionModelName, schema: report_version_schema_1.ReportVersionSchema },
                { name: result_schema_1.ResultSetModelName, schema: result_schema_1.ResultSetSchema },
            ]),
        ],
        controllers: [portal_controller_1.PortalController],
        providers: [portal_service_1.PortalService, report_assembler_service_1.ReportAssemblerService],
    })
], PortalModule);
//# sourceMappingURL=portal.module.js.map