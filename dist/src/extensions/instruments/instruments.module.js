"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const lab_schema_1 = require("../../core/labs/lab.schema");
const test_request_schema_1 = require("../../core/test-requests/test-request.schema");
const instruments_controller_1 = require("./instruments.controller");
const instruments_service_1 = require("./instruments.service");
const instrument_schema_1 = require("./instrument.schema");
let InstrumentsModule = class InstrumentsModule {
};
exports.InstrumentsModule = InstrumentsModule;
exports.InstrumentsModule = InstrumentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: instrument_schema_1.InstrumentMessageModelName, schema: instrument_schema_1.InstrumentMessageSchema },
                { name: test_request_schema_1.TestRequestModelName, schema: test_request_schema_1.TestRequestSchema },
                { name: lab_schema_1.LabModelName, schema: lab_schema_1.LabSchema },
            ]),
        ],
        controllers: [instruments_controller_1.InstrumentsController],
        providers: [instruments_service_1.InstrumentsService],
        exports: [instruments_service_1.InstrumentsService],
    })
], InstrumentsModule);
//# sourceMappingURL=instruments.module.js.map