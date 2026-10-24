"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsiModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const audit_module_1 = require("../../core/audit/audit.module");
const case_schema_1 = require("../../core/cases/case.schema");
const lab_schema_1 = require("../../core/labs/lab.schema");
const slide_schema_1 = require("../../disciplines/histopathology/slides/slide.schema");
const wsi_controller_1 = require("./wsi.controller");
const wsi_service_1 = require("./wsi.service");
let WsiModule = class WsiModule {
};
exports.WsiModule = WsiModule;
exports.WsiModule = WsiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            audit_module_1.AuditModule,
            mongoose_1.MongooseModule.forFeature([
                { name: slide_schema_1.SlideModelName, schema: slide_schema_1.SlideSchema },
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
                { name: lab_schema_1.LabModelName, schema: lab_schema_1.LabSchema },
            ]),
        ],
        controllers: [wsi_controller_1.WsiController],
        providers: [wsi_service_1.WsiService],
        exports: [wsi_service_1.WsiService],
    })
], WsiModule);
//# sourceMappingURL=wsi.module.js.map