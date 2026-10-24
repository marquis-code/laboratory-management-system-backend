"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hl7Module = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const case_schema_1 = require("../../core/cases/case.schema");
const cases_module_1 = require("../../core/cases/cases.module");
const lab_schema_1 = require("../../core/labs/lab.schema");
const patient_schema_1 = require("../../core/patients/patient.schema");
const report_schema_1 = require("../../core/reports/report.schema");
const user_schema_1 = require("../../core/users/user.schema");
const hl7_controller_1 = require("./hl7.controller");
const hl7_service_1 = require("./hl7.service");
const mllp_server_1 = require("./mllp.server");
let Hl7Module = class Hl7Module {
};
exports.Hl7Module = Hl7Module;
exports.Hl7Module = Hl7Module = __decorate([
    (0, common_1.Module)({
        imports: [
            cases_module_1.CasesModule,
            mongoose_1.MongooseModule.forFeature([
                { name: lab_schema_1.LabModelName, schema: lab_schema_1.LabSchema },
                { name: user_schema_1.UserModelName, schema: user_schema_1.UserSchema },
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
                { name: patient_schema_1.PatientModelName, schema: patient_schema_1.PatientSchema },
                { name: report_schema_1.ReportModelName, schema: report_schema_1.ReportSchema },
            ]),
        ],
        controllers: [hl7_controller_1.Hl7Controller],
        providers: [hl7_service_1.Hl7Service, mllp_server_1.MllpServer],
        exports: [hl7_service_1.Hl7Service],
    })
], Hl7Module);
//# sourceMappingURL=hl7.module.js.map