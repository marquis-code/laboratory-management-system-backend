"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecimensModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const case_schema_1 = require("../cases/case.schema");
const custody_module_1 = require("../custody/custody.module");
const specimen_schema_1 = require("./specimen.schema");
const specimens_controller_1 = require("./specimens.controller");
const specimens_service_1 = require("./specimens.service");
let SpecimensModule = class SpecimensModule {
};
exports.SpecimensModule = SpecimensModule;
exports.SpecimensModule = SpecimensModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: specimen_schema_1.SpecimenModelName, schema: specimen_schema_1.SpecimenSchema },
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
            ]),
            custody_module_1.CustodyModule,
        ],
        controllers: [specimens_controller_1.SpecimensController],
        providers: [specimens_service_1.SpecimensService],
        exports: [specimens_service_1.SpecimensService],
    })
], SpecimensModule);
//# sourceMappingURL=specimens.module.js.map