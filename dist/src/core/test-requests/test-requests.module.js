"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRequestsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const case_schema_1 = require("../cases/case.schema");
const test_requests_controller_1 = require("./test-requests.controller");
const test_request_schema_1 = require("./test-request.schema");
const test_requests_service_1 = require("./test-requests.service");
let TestRequestsModule = class TestRequestsModule {
};
exports.TestRequestsModule = TestRequestsModule;
exports.TestRequestsModule = TestRequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: test_request_schema_1.TestRequestModelName, schema: test_request_schema_1.TestRequestSchema },
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
            ]),
        ],
        controllers: [test_requests_controller_1.TestRequestsController],
        providers: [test_requests_service_1.TestRequestsService],
        exports: [test_requests_service_1.TestRequestsService],
    })
], TestRequestsModule);
//# sourceMappingURL=test-requests.module.js.map