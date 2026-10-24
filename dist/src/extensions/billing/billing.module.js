"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const audit_module_1 = require("../../core/audit/audit.module");
const case_schema_1 = require("../../core/cases/case.schema");
const labs_module_1 = require("../../core/labs/labs.module");
const patient_schema_1 = require("../../core/patients/patient.schema");
const billing_controller_1 = require("./billing.controller");
const billing_service_1 = require("./billing.service");
const invoice_schema_1 = require("./invoice.schema");
const payment_schema_1 = require("./payment.schema");
let BillingModule = class BillingModule {
};
exports.BillingModule = BillingModule;
exports.BillingModule = BillingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            audit_module_1.AuditModule,
            labs_module_1.LabsModule,
            mongoose_1.MongooseModule.forFeature([
                { name: invoice_schema_1.InvoiceModelName, schema: invoice_schema_1.InvoiceSchema },
                { name: payment_schema_1.PaymentModelName, schema: payment_schema_1.PaymentSchema },
                { name: case_schema_1.CaseModelName, schema: case_schema_1.CaseSchema },
                { name: patient_schema_1.PatientModelName, schema: patient_schema_1.PatientSchema },
            ]),
        ],
        controllers: [billing_controller_1.BillingController],
        providers: [billing_service_1.BillingService],
        exports: [billing_service_1.BillingService],
    })
], BillingModule);
//# sourceMappingURL=billing.module.js.map