"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustodyPortsModule = exports.CustodyPortRegistry = void 0;
const common_1 = require("@nestjs/common");
let CustodyPortRegistry = class CustodyPortRegistry {
    scanHandler = null;
    locatorHandler = null;
    register(handler) {
        if (handler.scan)
            this.scanHandler = handler.scan;
        if (handler.locator)
            this.locatorHandler = handler.locator;
    }
};
exports.CustodyPortRegistry = CustodyPortRegistry;
exports.CustodyPortRegistry = CustodyPortRegistry = __decorate([
    (0, common_1.Injectable)()
], CustodyPortRegistry);
let CustodyPortsModule = class CustodyPortsModule {
};
exports.CustodyPortsModule = CustodyPortsModule;
exports.CustodyPortsModule = CustodyPortsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [CustodyPortRegistry],
        exports: [CustodyPortRegistry],
    })
], CustodyPortsModule);
//# sourceMappingURL=custody-ports.js.map