"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlidesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const block_schema_1 = require("../blocks/block.schema");
const case_schema_1 = require("../../../core/cases/case.schema");
const custody_module_1 = require("../../../core/custody/custody.module");
const slide_schema_1 = require("./slide.schema");
const slides_controller_1 = require("./slides.controller");
const slides_service_1 = require("./slides.service");
let SlidesModule = class SlidesModule {
};
exports.SlidesModule = SlidesModule;
exports.SlidesModule = SlidesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: slide_schema_1.SlideModelName, schema: slide_schema_1.SlideSchema },
                { name: block_schema_1.BlockModelName, schema: block_schema_1.BlockSchema },
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
            ]),
            custody_module_1.CustodyModule,
        ],
        controllers: [slides_controller_1.SlidesController],
        providers: [slides_service_1.SlidesService],
        exports: [slides_service_1.SlidesService],
    })
], SlidesModule);
//# sourceMappingURL=slides.module.js.map