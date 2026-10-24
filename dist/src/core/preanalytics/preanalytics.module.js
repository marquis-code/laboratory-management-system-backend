"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreanalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const audit_module_1 = require("../audit/audit.module");
const test_request_schema_1 = require("../test-requests/test-request.schema");
const preanalytics_controller_1 = require("./preanalytics.controller");
const preanalytics_service_1 = require("./preanalytics.service");
const preanalytics_schema_1 = require("./preanalytics.schema");
let PreanalyticsModule = class PreanalyticsModule {
};
exports.PreanalyticsModule = PreanalyticsModule;
exports.PreanalyticsModule = PreanalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: preanalytics_schema_1.CollectionCentreModelName, schema: preanalytics_schema_1.CollectionCentreSchema },
                { name: preanalytics_schema_1.ConsignmentModelName, schema: preanalytics_schema_1.ConsignmentSchema },
                { name: test_request_schema_1.TestRequestModelName, schema: test_request_schema_1.TestRequestSchema },
            ]),
            audit_module_1.AuditModule,
        ],
        controllers: [preanalytics_controller_1.PreanalyticsController],
        providers: [preanalytics_service_1.PreanalyticsService],
        exports: [preanalytics_service_1.PreanalyticsService],
    })
], PreanalyticsModule);
//# sourceMappingURL=preanalytics.module.js.map