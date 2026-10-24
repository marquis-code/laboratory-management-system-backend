"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const audit_module_1 = require("../../core/audit/audit.module");
const block_schema_1 = require("../../disciplines/histopathology/blocks/block.schema");
const case_schema_1 = require("../../core/cases/case.schema");
const custody_module_1 = require("../../core/custody/custody.module");
const lab_schema_1 = require("../../core/labs/lab.schema");
const notifications_module_1 = require("../../core/notifications/notifications.module");
const slide_schema_1 = require("../../disciplines/histopathology/slides/slide.schema");
const user_schema_1 = require("../../core/users/user.schema");
const inventory_controller_1 = require("./inventory.controller");
const inventory_service_1 = require("./inventory.service");
const reagent_lot_schema_1 = require("./reagent-lot.schema");
const stain_run_schema_1 = require("./stain-run.schema");
let InventoryModule = class InventoryModule {
};
exports.InventoryModule = InventoryModule;
exports.InventoryModule = InventoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            audit_module_1.AuditModule,
            custody_module_1.CustodyModule,
            notifications_module_1.NotificationsModule,
            mongoose_1.MongooseModule.forFeature([
                { name: reagent_lot_schema_1.ReagentLotModelName, schema: reagent_lot_schema_1.ReagentLotSchema },
                { name: stain_run_schema_1.StainRunModelName, schema: stain_run_schema_1.StainRunSchema },
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
                { name: block_schema_1.BlockModelName, schema: block_schema_1.BlockSchema },
                { name: slide_schema_1.SlideModelName, schema: slide_schema_1.SlideSchema },
                { name: user_schema_1.UserModelName, schema: user_schema_1.UserSchema },
                { name: lab_schema_1.LabModelName, schema: lab_schema_1.LabSchema },
            ]),
        ],
        controllers: [inventory_controller_1.InventoryController],
        providers: [inventory_service_1.InventoryService],
        exports: [inventory_service_1.InventoryService],
    })
], InventoryModule);
//# sourceMappingURL=inventory.module.js.map