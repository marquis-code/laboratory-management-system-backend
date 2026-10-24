"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const cases_module_1 = require("../cases/cases.module");
const case_schema_1 = require("../cases/case.schema");
const custody_event_schema_1 = require("../custody/custody-event.schema");
const patient_schema_1 = require("../patients/patient.schema");
const user_schema_1 = require("../users/user.schema");
const dashboard_controller_1 = require("./dashboard.controller");
const dashboard_service_1 = require("./dashboard.service");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
                { name: patient_schema_1.PatientModelName, schema: patient_schema_1.PatientSchema },
                { name: user_schema_1.UserModelName, schema: user_schema_1.UserSchema },
                { name: custody_event_schema_1.CustodyEventModelName, schema: custody_event_schema_1.CustodyEventSchema },
            ]),
            cases_module_1.CasesModule,
        ],
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService],
    })
], DashboardModule);
//# sourceMappingURL=dashboard.module.js.map