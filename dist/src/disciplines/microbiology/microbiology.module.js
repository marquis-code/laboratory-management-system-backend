"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrobiologyModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const audit_module_1 = require("../../core/audit/audit.module");
const case_schema_1 = require("../../core/cases/case.schema");
const patient_schema_1 = require("../../core/patients/patient.schema");
const test_requests_module_1 = require("../../core/test-requests/test-requests.module");
const test_request_schema_1 = require("../../core/test-requests/test-request.schema");
const microbiology_controller_1 = require("./microbiology.controller");
const microbiology_service_1 = require("./microbiology.service");
const microbiology_schema_1 = require("./microbiology.schema");
let MicrobiologyModule = class MicrobiologyModule {
};
exports.MicrobiologyModule = MicrobiologyModule;
exports.MicrobiologyModule = MicrobiologyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: microbiology_schema_1.OrganismModelName, schema: microbiology_schema_1.OrganismSchema },
                { name: microbiology_schema_1.AntibioticModelName, schema: microbiology_schema_1.AntibioticSchema },
                { name: microbiology_schema_1.BreakpointModelName, schema: microbiology_schema_1.BreakpointSchema },
                { name: microbiology_schema_1.CultureModelName, schema: microbiology_schema_1.CultureSchema },
                { name: microbiology_schema_1.IsolateModelName, schema: microbiology_schema_1.IsolateSchema },
                { name: microbiology_schema_1.SusceptibilityModelName, schema: microbiology_schema_1.SusceptibilitySchema },
                { name: test_request_schema_1.TestRequestModelName, schema: test_request_schema_1.TestRequestSchema },
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
                { name: patient_schema_1.PatientModelName, schema: patient_schema_1.PatientSchema },
            ]),
            test_requests_module_1.TestRequestsModule,
            audit_module_1.AuditModule,
        ],
        controllers: [microbiology_controller_1.MicrobiologyController],
        providers: [microbiology_service_1.MicrobiologyService],
        exports: [microbiology_service_1.MicrobiologyService],
    })
], MicrobiologyModule);
//# sourceMappingURL=microbiology.module.js.map