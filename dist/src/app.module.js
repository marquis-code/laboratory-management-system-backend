"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const mongoose_1 = require("@nestjs/mongoose");
const nestjs_pino_1 = require("nestjs-pino");
const node_crypto_1 = require("node:crypto");
const env_1 = require("./common/config/env");
const idempotency_module_1 = require("./common/idempotency/idempotency.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const health_module_1 = require("./common/health/health.module");
const request_context_middleware_1 = require("./common/middleware/request-context.middleware");
const audit_module_1 = require("./core/audit/audit.module");
const auth_module_1 = require("./core/auth/auth.module");
const billing_module_1 = require("./extensions/billing/billing.module");
const test_requests_module_1 = require("./core/test-requests/test-requests.module");
const catalog_module_1 = require("./core/catalog/catalog.module");
const results_module_1 = require("./core/results/results.module");
const rules_module_1 = require("./core/rules/rules.module");
const qc_module_1 = require("./core/qc/qc.module");
const preanalytics_module_1 = require("./core/preanalytics/preanalytics.module");
const microbiology_module_1 = require("./disciplines/microbiology/microbiology.module");
const quality_module_1 = require("./core/quality/quality.module");
const instruments_module_1 = require("./extensions/instruments/instruments.module");
const platform_module_1 = require("./core/platform/platform.module");
const leads_module_1 = require("./core/leads/leads.module");
const discipline_module_1 = require("./core/discipline/discipline.module");
const discipline_guard_1 = require("./core/discipline/discipline.guard");
const disciplines_module_1 = require("./disciplines/disciplines.module");
const histopathology_module_1 = require("./disciplines/histopathology/histopathology.module");
const blocks_module_1 = require("./disciplines/histopathology/blocks/blocks.module");
const cases_module_1 = require("./core/cases/cases.module");
const custody_module_1 = require("./core/custody/custody.module");
const dashboard_module_1 = require("./core/dashboard/dashboard.module");
const fhir_module_1 = require("./extensions/fhir/fhir.module");
const hl7_module_1 = require("./extensions/hl7/hl7.module");
const inventory_module_1 = require("./extensions/inventory/inventory.module");
const jobs_module_1 = require("./core/jobs/jobs.module");
const labels_module_1 = require("./core/labels/labels.module");
const labs_module_1 = require("./core/labs/labs.module");
const notifications_module_1 = require("./core/notifications/notifications.module");
const patients_module_1 = require("./core/patients/patients.module");
const portal_module_1 = require("./extensions/portal/portal.module");
const pdf_module_1 = require("./disciplines/histopathology/pdf/pdf.module");
const protocols_module_1 = require("./disciplines/histopathology/protocols/protocols.module");
const qa_module_1 = require("./extensions/qa/qa.module");
const reports_module_1 = require("./core/reports/reports.module");
const slides_module_1 = require("./disciplines/histopathology/slides/slides.module");
const specimens_module_1 = require("./core/specimens/specimens.module");
const sync_module_1 = require("./extensions/sync/sync.module");
const terminology_module_1 = require("./extensions/terminology/terminology.module");
const users_module_1 = require("./core/users/users.module");
const worklist_module_1 = require("./core/worklist/worklist.module");
const wsi_module_1 = require("./extensions/wsi/wsi.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(request_context_middleware_1.RequestContextMiddleware, request_context_middleware_1.TenantMiddleware)
            .forRoutes({ path: '{*splat}', method: common_1.RequestMethod.ALL });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                expandVariables: true,
                envFilePath: ['.env', '../.env', '../../.env'],
                validate: env_1.validateEnv,
            }),
            nestjs_pino_1.LoggerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const isDevelopment = config.get('NODE_ENV') === 'development';
                    let prettyTarget;
                    if (isDevelopment) {
                        try {
                            prettyTarget = require.resolve('pino-pretty');
                        }
                        catch {
                            prettyTarget = undefined;
                        }
                    }
                    return {
                        pinoHttp: {
                            level: config.get('LOG_LEVEL') ?? 'info',
                            genReqId: (req, res) => {
                                const existing = req.headers['x-request-id'];
                                const id = typeof existing === 'string' && existing.length > 0 ? existing : (0, node_crypto_1.randomUUID)();
                                res.setHeader('x-request-id', id);
                                return id;
                            },
                            redact: {
                                paths: [
                                    'req.headers.authorization',
                                    'req.headers.cookie',
                                    'res.headers["set-cookie"]',
                                    'password',
                                    'passwordHash',
                                    'refreshToken',
                                ],
                                censor: '[redacted]',
                            },
                            autoLogging: true,
                            transport: prettyTarget
                                ? {
                                    target: prettyTarget,
                                    options: {
                                        singleLine: true,
                                        colorize: true,
                                        translateTime: 'SYS:HH:MM:ss',
                                        ignore: 'pid,hostname',
                                    },
                                }
                                : undefined,
                            customProps: () => ({ service: 'histopathology-lims-api' }),
                        },
                    };
                },
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.getOrThrow('MONGODB_URI'),
                    autoIndex: true,
                    maxPoolSize: 25,
                    serverSelectionTimeoutMS: 15_000,
                }),
            }),
            audit_module_1.AuditModule,
            billing_module_1.BillingModule,
            test_requests_module_1.TestRequestsModule,
            catalog_module_1.CatalogModule,
            rules_module_1.RulesModule,
            qc_module_1.QcModule,
            preanalytics_module_1.PreanalyticsModule,
            microbiology_module_1.MicrobiologyModule,
            quality_module_1.QualityModule,
            instruments_module_1.InstrumentsModule,
            platform_module_1.PlatformModule,
            leads_module_1.LeadsModule,
            results_module_1.ResultsModule,
            discipline_module_1.DisciplineRegistryModule,
            disciplines_module_1.DisciplinesModule,
            histopathology_module_1.HistopathologyModule,
            idempotency_module_1.IdempotencyModule,
            auth_module_1.AuthModule,
            labs_module_1.LabsModule,
            users_module_1.UsersModule,
            patients_module_1.PatientsModule,
            custody_module_1.CustodyModule,
            cases_module_1.CasesModule,
            fhir_module_1.FhirModule,
            hl7_module_1.Hl7Module,
            specimens_module_1.SpecimensModule,
            blocks_module_1.BlocksModule,
            slides_module_1.SlidesModule,
            protocols_module_1.ProtocolsModule,
            qa_module_1.QaModule,
            sync_module_1.SyncModule,
            terminology_module_1.TerminologyModule,
            wsi_module_1.WsiModule,
            pdf_module_1.PdfModule,
            jobs_module_1.JobsModule,
            reports_module_1.ReportsModule,
            worklist_module_1.WorklistModule,
            dashboard_module_1.DashboardModule,
            labels_module_1.LabelsModule,
            inventory_module_1.InventoryModule,
            notifications_module_1.NotificationsModule,
            portal_module_1.PortalModule,
            health_module_1.HealthModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
            { provide: core_1.APP_GUARD, useClass: discipline_guard_1.DisciplineGuard },
            { provide: core_1.APP_FILTER, useClass: all_exceptions_filter_1.AllExceptionsFilter },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map