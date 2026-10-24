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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FhirController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const parse_object_id_pipe_1 = require("../../common/pipes/parse-object-id.pipe");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const fhir_dto_1 = require("./dto/fhir.dto");
const fhir_service_1 = require("./fhir.service");
let FhirController = class FhirController {
    fhir;
    constructor(fhir) {
        this.fhir = fhir;
    }
    metadata() {
        return this.fhir.capabilityStatement();
    }
    patient(id) {
        return this.fhir.patient(id);
    }
    patients(query) {
        return this.fhir.searchPatients(query);
    }
    serviceRequest(id) {
        return this.fhir.serviceRequest(id);
    }
    serviceRequests(query) {
        return this.fhir.searchServiceRequests(query);
    }
    specimen(id) {
        return this.fhir.specimen(id);
    }
    specimens(query) {
        return this.fhir.searchSpecimens(query);
    }
    diagnosticReport(id) {
        return this.fhir.diagnosticReport(id);
    }
    diagnosticReports(query) {
        return this.fhir.searchDiagnosticReports(query);
    }
};
exports.FhirController = FhirController;
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)('metadata'),
    (0, common_1.Header)('Content-Type', 'application/fhir+json; charset=utf-8'),
    (0, swagger_1.ApiOperation)({ summary: 'FHIR R4 CapabilityStatement' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FhirController.prototype, "metadata", null);
__decorate([
    (0, common_1.Get)('Patient/:id'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'GROSSER', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Header)('Content-Type', 'application/fhir+json; charset=utf-8'),
    (0, swagger_1.ApiOperation)({ summary: 'FHIR R4 Patient read' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FhirController.prototype, "patient", null);
__decorate([
    (0, common_1.Get)('Patient'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'GROSSER', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Header)('Content-Type', 'application/fhir+json; charset=utf-8'),
    (0, swagger_1.ApiOperation)({ summary: 'FHIR R4 Patient search by identifier or _id' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fhir_dto_1.FhirSearchDto]),
    __metadata("design:returntype", void 0)
], FhirController.prototype, "patients", null);
__decorate([
    (0, common_1.Get)('ServiceRequest/:id'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'GROSSER', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Header)('Content-Type', 'application/fhir+json; charset=utf-8'),
    (0, swagger_1.ApiOperation)({ summary: 'FHIR R4 ServiceRequest read' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FhirController.prototype, "serviceRequest", null);
__decorate([
    (0, common_1.Get)('ServiceRequest'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'GROSSER', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Header)('Content-Type', 'application/fhir+json; charset=utf-8'),
    (0, swagger_1.ApiOperation)({ summary: 'FHIR R4 ServiceRequest search' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fhir_dto_1.FhirSearchDto]),
    __metadata("design:returntype", void 0)
], FhirController.prototype, "serviceRequests", null);
__decorate([
    (0, common_1.Get)('Specimen/:id'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'GROSSER', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Header)('Content-Type', 'application/fhir+json; charset=utf-8'),
    (0, swagger_1.ApiOperation)({ summary: 'FHIR R4 Specimen read' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FhirController.prototype, "specimen", null);
__decorate([
    (0, common_1.Get)('Specimen'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'GROSSER', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Header)('Content-Type', 'application/fhir+json; charset=utf-8'),
    (0, swagger_1.ApiOperation)({ summary: 'FHIR R4 Specimen search' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fhir_dto_1.FhirSearchDto]),
    __metadata("design:returntype", void 0)
], FhirController.prototype, "specimens", null);
__decorate([
    (0, common_1.Get)('DiagnosticReport/:id'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'GROSSER', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Header)('Content-Type', 'application/fhir+json; charset=utf-8'),
    (0, swagger_1.ApiOperation)({ summary: 'FHIR R4 DiagnosticReport read' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FhirController.prototype, "diagnosticReport", null);
__decorate([
    (0, common_1.Get)('DiagnosticReport'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'GROSSER', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Header)('Content-Type', 'application/fhir+json; charset=utf-8'),
    (0, swagger_1.ApiOperation)({ summary: 'FHIR R4 DiagnosticReport search by subject, status or date' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fhir_dto_1.FhirSearchDto]),
    __metadata("design:returntype", void 0)
], FhirController.prototype, "diagnosticReports", null);
exports.FhirController = FhirController = __decorate([
    (0, swagger_1.ApiTags)('FHIR R4'),
    (0, common_1.Controller)('fhir/r4'),
    __metadata("design:paramtypes", [fhir_service_1.FhirService])
], FhirController);
//# sourceMappingURL=fhir.controller.js.map