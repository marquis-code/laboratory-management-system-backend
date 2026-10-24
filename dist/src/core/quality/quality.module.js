"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QualityModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const audit_module_1 = require("../audit/audit.module");
const case_schema_1 = require("../cases/case.schema");
const test_requests_module_1 = require("../test-requests/test-requests.module");
const test_request_schema_1 = require("../test-requests/test-request.schema");
const user_schema_1 = require("../users/user.schema");
const quality_controller_1 = require("./quality.controller");
const quality_service_1 = require("./quality.service");
const quality_schema_1 = require("./quality.schema");
let QualityModule = class QualityModule {
};
exports.QualityModule = QualityModule;
exports.QualityModule = QualityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: quality_schema_1.EquipmentModelName, schema: quality_schema_1.EquipmentSchema },
                { name: quality_schema_1.TemperatureLogModelName, schema: quality_schema_1.TemperatureLogSchema },
                { name: quality_schema_1.NonConformanceModelName, schema: quality_schema_1.NonConformanceSchema },
                { name: quality_schema_1.CapaActionModelName, schema: quality_schema_1.CapaActionSchema },
                { name: quality_schema_1.SendOutModelName, schema: quality_schema_1.SendOutSchema },
                { name: test_request_schema_1.TestRequestModelName, schema: test_request_schema_1.TestRequestSchema },
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
                { name: user_schema_1.UserModelName, schema: user_schema_1.UserSchema },
            ]),
            test_requests_module_1.TestRequestsModule,
            audit_module_1.AuditModule,
        ],
        controllers: [quality_controller_1.QualityController],
        providers: [quality_service_1.QualityService],
        exports: [quality_service_1.QualityService],
    })
], QualityModule);
//# sourceMappingURL=quality.module.js.map