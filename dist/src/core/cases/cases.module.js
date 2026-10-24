"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const custody_module_1 = require("../custody/custody.module");
const labs_module_1 = require("../labs/labs.module");
const patient_schema_1 = require("../patients/patient.schema");
const patients_module_1 = require("../patients/patients.module");
const report_schema_1 = require("../reports/report.schema");
const reports_module_1 = require("../reports/reports.module");
const specimen_schema_1 = require("../specimens/specimen.schema");
const user_schema_1 = require("../users/user.schema");
const users_module_1 = require("../users/users.module");
const test_requests_module_1 = require("../test-requests/test-requests.module");
const case_schema_1 = require("./case.schema");
const cases_controller_1 = require("./cases.controller");
const case_artifacts_1 = require("./case-artifacts");
const cases_service_1 = require("./cases.service");
let CasesModule = class CasesModule {
};
exports.CasesModule = CasesModule;
exports.CasesModule = CasesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
                { name: patient_schema_1.PatientModelName, schema: patient_schema_1.PatientSchema },
                { name: specimen_schema_1.SpecimenModelName, schema: specimen_schema_1.SpecimenSchema },
                { name: report_schema_1.ReportModelName, schema: report_schema_1.ReportSchema },
                { name: user_schema_1.UserModelName, schema: user_schema_1.UserSchema },
            ]),
            patients_module_1.PatientsModule,
            labs_module_1.LabsModule,
            users_module_1.UsersModule,
            custody_module_1.CustodyModule,
            reports_module_1.ReportsModule,
            test_requests_module_1.TestRequestsModule,
        ],
        controllers: [cases_controller_1.CasesController],
        providers: [cases_service_1.CasesService, case_artifacts_1.CaseArtifactRegistry],
        exports: [cases_service_1.CasesService, case_artifacts_1.CaseArtifactRegistry],
    })
], CasesModule);
//# sourceMappingURL=cases.module.js.map