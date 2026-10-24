"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportPortsModule = exports.ReportPortRegistry = void 0;
const common_1 = require("@nestjs/common");
let ReportPortRegistry = class ReportPortRegistry {
    ports = new Map();
    register(discipline, ports) {
        this.ports.set(discipline, { ...this.ports.get(discipline), ...ports });
    }
    protocols(discipline = 'HISTOPATHOLOGY') {
        return this.ports.get(discipline)?.protocols ?? null;
    }
    renderer(discipline = 'HISTOPATHOLOGY') {
        return this.ports.get(discipline)?.renderer ?? null;
    }
    finalizer(discipline = 'HISTOPATHOLOGY') {
        return this.ports.get(discipline)?.finalizer ?? null;
    }
};
exports.ReportPortRegistry = ReportPortRegistry;
exports.ReportPortRegistry = ReportPortRegistry = __decorate([
    (0, common_1.Injectable)()
], ReportPortRegistry);
let ReportPortsModule = class ReportPortsModule {
};
exports.ReportPortsModule = ReportPortsModule;
exports.ReportPortsModule = ReportPortsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [ReportPortRegistry],
        exports: [ReportPortRegistry],
    })
], ReportPortsModule);
//# sourceMappingURL=report-ports.js.map