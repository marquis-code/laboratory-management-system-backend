"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustodyModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const case_schema_1 = require("../cases/case.schema");
const specimen_schema_1 = require("../specimens/specimen.schema");
const case_workflow_service_1 = require("./case-workflow.service");
const custody_controller_1 = require("./custody.controller");
const custody_event_schema_1 = require("./custody-event.schema");
const custody_service_1 = require("./custody.service");
const custody_ports_1 = require("./custody-ports");
const test_requests_module_1 = require("../test-requests/test-requests.module");
let CustodyModule = class CustodyModule {
};
exports.CustodyModule = CustodyModule;
exports.CustodyModule = CustodyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            custody_ports_1.CustodyPortsModule,
            test_requests_module_1.TestRequestsModule,
            mongoose_1.MongooseModule.forFeature([
                { name: custody_event_schema_1.CustodyEventModelName, schema: custody_event_schema_1.CustodyEventSchema },
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
                { name: specimen_schema_1.SpecimenModelName, schema: specimen_schema_1.SpecimenSchema },
            ]),
        ],
        controllers: [custody_controller_1.CustodyController],
        providers: [custody_service_1.CustodyService, case_workflow_service_1.CaseWorkflowService],
        exports: [custody_service_1.CustodyService, case_workflow_service_1.CaseWorkflowService],
    })
], CustodyModule);
//# sourceMappingURL=custody.module.js.map