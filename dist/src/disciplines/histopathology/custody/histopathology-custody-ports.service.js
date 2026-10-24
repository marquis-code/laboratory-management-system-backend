"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistopathologyCustodyPortsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const custody_ports_1 = require("../../../core/custody/custody-ports");
const report_ports_1 = require("../../../core/reports/report-ports");
const locator_service_1 = require("./locator.service");
const report_propagation_service_1 = require("./report-propagation.service");
const scan_service_1 = require("./scan.service");
let HistopathologyCustodyPortsService = class HistopathologyCustodyPortsService {
    scanService;
    locatorService;
    propagation;
    custodyPorts;
    reportPorts;
    constructor(scanService, locatorService, propagation, custodyPorts, reportPorts) {
        this.scanService = scanService;
        this.locatorService = locatorService;
        this.propagation = propagation;
        this.custodyPorts = custodyPorts;
        this.reportPorts = reportPorts;
    }
    onModuleInit() {
        this.custodyPorts.register({
            scan: { scan: (dto) => this.scanService.scan(dto) },
            locator: {
                locate: (barcode) => this.locatorService.locate(barcode),
                caseTimeline: (caseId) => this.locatorService.caseTimeline(caseId),
                entityTimeline: (entityType, entityId) => this.locatorService.entityTimeline(entityType, entityId),
            },
        });
        this.reportPorts.register('HISTOPATHOLOGY', {
            finalizer: {
                markReported: async (caseId, actor, session) => {
                    await this.propagation.markReported(new mongoose_1.Types.ObjectId(caseId), actor, session);
                },
            },
        });
    }
};
exports.HistopathologyCustodyPortsService = HistopathologyCustodyPortsService;
exports.HistopathologyCustodyPortsService = HistopathologyCustodyPortsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [scan_service_1.ScanService,
        locator_service_1.LocatorService,
        report_propagation_service_1.ReportPropagationService,
        custody_ports_1.CustodyPortRegistry,
        report_ports_1.ReportPortRegistry])
], HistopathologyCustodyPortsService);
//# sourceMappingURL=histopathology-custody-ports.service.js.map