"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QaModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const audit_module_1 = require("../../core/audit/audit.module");
const case_schema_1 = require("../../core/cases/case.schema");
const lab_schema_1 = require("../../core/labs/lab.schema");
const notifications_module_1 = require("../../core/notifications/notifications.module");
const patient_schema_1 = require("../../core/patients/patient.schema");
const report_schema_1 = require("../../core/reports/report.schema");
const user_schema_1 = require("../../core/users/user.schema");
const qa_controller_1 = require("./qa.controller");
const qa_review_schema_1 = require("./qa-review.schema");
const qa_service_1 = require("./qa.service");
let QaModule = class QaModule {
};
exports.QaModule = QaModule;
exports.QaModule = QaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            audit_module_1.AuditModule,
            notifications_module_1.NotificationsModule,
            mongoose_1.MongooseModule.forFeature([
                { name: qa_review_schema_1.QaReviewModelName, schema: qa_review_schema_1.QaReviewSchema },
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
                { name: patient_schema_1.PatientModelName, schema: patient_schema_1.PatientSchema },
                { name: report_schema_1.ReportModelName, schema: report_schema_1.ReportSchema },
                { name: user_schema_1.UserModelName, schema: user_schema_1.UserSchema },
                { name: lab_schema_1.LabModelName, schema: lab_schema_1.LabSchema },
            ]),
        ],
        controllers: [qa_controller_1.QaController],
        providers: [qa_service_1.QaService],
        exports: [qa_service_1.QaService],
    })
], QaModule);
//# sourceMappingURL=qa.module.js.map