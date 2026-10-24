"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const case_schema_1 = require("../cases/case.schema");
const lab_schema_1 = require("../labs/lab.schema");
const patient_schema_1 = require("../patients/patient.schema");
const specimen_schema_1 = require("../specimens/specimen.schema");
const labels_controller_1 = require("./labels.controller");
const labels_service_1 = require("./labels.service");
const label_artifacts_1 = require("./label-artifacts");
let LabelsModule = class LabelsModule {
};
exports.LabelsModule = LabelsModule;
exports.LabelsModule = LabelsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
                { name: patient_schema_1.PatientModelName, schema: patient_schema_1.PatientSchema },
                { name: specimen_schema_1.SpecimenModelName, schema: specimen_schema_1.SpecimenSchema },
                { name: lab_schema_1.LabModelName, schema: lab_schema_1.LabSchema },
            ]),
        ],
        controllers: [labels_controller_1.LabelsController],
        providers: [labels_service_1.LabelsService, label_artifacts_1.LabelArtifactRegistry],
        exports: [labels_service_1.LabelsService, label_artifacts_1.LabelArtifactRegistry],
    })
], LabelsModule);
//# sourceMappingURL=labels.module.js.map