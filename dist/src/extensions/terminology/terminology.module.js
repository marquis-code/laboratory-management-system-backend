"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminologyModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const audit_module_1 = require("../../core/audit/audit.module");
const terminology_controller_1 = require("./terminology.controller");
const terminology_schema_1 = require("./terminology.schema");
const terminology_service_1 = require("./terminology.service");
let TerminologyModule = class TerminologyModule {
};
exports.TerminologyModule = TerminologyModule;
exports.TerminologyModule = TerminologyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            audit_module_1.AuditModule,
            mongoose_1.MongooseModule.forFeature([{ name: terminology_schema_1.TerminologyModelName, schema: terminology_schema_1.TerminologySchema }]),
        ],
        controllers: [terminology_controller_1.TerminologyController],
        providers: [terminology_service_1.TerminologyService],
        exports: [terminology_service_1.TerminologyService],
    })
], TerminologyModule);
//# sourceMappingURL=terminology.module.js.map