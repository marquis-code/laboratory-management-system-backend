"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const block_schema_1 = require("../blocks/block.schema");
const case_schema_1 = require("../../../core/cases/case.schema");
const lab_schema_1 = require("../../../core/labs/lab.schema");
const patient_schema_1 = require("../../../core/patients/patient.schema");
const report_schema_1 = require("../../../core/reports/report.schema");
const specimen_schema_1 = require("../../../core/specimens/specimen.schema");
const user_schema_1 = require("../../../core/users/user.schema");
const pdf_service_1 = require("./pdf.service");
let PdfModule = class PdfModule {
};
exports.PdfModule = PdfModule;
exports.PdfModule = PdfModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: report_schema_1.ReportModelName, schema: report_schema_1.ReportSchema },
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
                { name: patient_schema_1.PatientModelName, schema: patient_schema_1.PatientSchema },
                { name: user_schema_1.UserModelName, schema: user_schema_1.UserSchema },
                { name: lab_schema_1.LabModelName, schema: lab_schema_1.LabSchema },
                { name: specimen_schema_1.SpecimenModelName, schema: specimen_schema_1.SpecimenSchema },
                { name: block_schema_1.BlockModelName, schema: block_schema_1.BlockSchema },
            ]),
        ],
        providers: [pdf_service_1.PdfService],
        exports: [pdf_service_1.PdfService],
    })
], PdfModule);
//# sourceMappingURL=pdf.module.js.map