"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorklistModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const cases_module_1 = require("../cases/cases.module");
const test_requests_module_1 = require("../test-requests/test-requests.module");
const case_schema_1 = require("../cases/case.schema");
const labs_module_1 = require("../labs/labs.module");
const worklist_controller_1 = require("./worklist.controller");
const worklist_service_1 = require("./worklist.service");
let WorklistModule = class WorklistModule {
};
exports.WorklistModule = WorklistModule;
exports.WorklistModule = WorklistModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema }]),
            cases_module_1.CasesModule,
            test_requests_module_1.TestRequestsModule,
            labs_module_1.LabsModule,
        ],
        controllers: [worklist_controller_1.WorklistController],
        providers: [worklist_service_1.WorklistService],
    })
], WorklistModule);
//# sourceMappingURL=worklist.module.js.map