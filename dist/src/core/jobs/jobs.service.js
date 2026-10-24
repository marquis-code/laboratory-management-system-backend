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
var JobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("bullmq");
const tenant_context_1 = require("../../common/context/tenant-context");
const notification_service_1 = require("../notifications/notification.service");
const inventory_service_1 = require("../../extensions/inventory/inventory.service");
const tat_check_service_1 = require("./tat-check.service");
const report_ports_1 = require("../reports/report-ports");
function redisConnection(url) {
    const parsed = new URL(url);
    const dbSegment = parsed.pathname.replace(/^\//, '');
    const db = dbSegment ? Number(dbSegment) : undefined;
    return {
        host: parsed.hostname,
        port: parsed.port ? Number(parsed.port) : 6379,
        username: parsed.username || undefined,
        password: parsed.password || undefined,
        db: Number.isFinite(db) ? db : undefined,
        tls: parsed.protocol === 'rediss:' ? {} : undefined,
        maxRetriesPerRequest: null,
    };
}
let JobsService = JobsService_1 = class JobsService {
    config;
    reportPorts;
    tatCheck;
    notifications;
    inventory;
    logger = new common_1.Logger(JobsService_1.name);
    renderer() {
        const renderer = this.reportPorts.renderer('HISTOPATHOLOGY');
        if (!renderer)
            throw new Error('Histopathology report renderer is not registered.');
        return renderer;
    }
    enabled;
    pdfQueue;
    notificationsQueue;
    maintenanceQueue;
    pdfWorker;
    notificationsWorker;
    maintenanceWorker;
    constructor(config, reportPorts, tatCheck, notifications, inventory) {
        this.config = config;
        this.reportPorts = reportPorts;
        this.tatCheck = tatCheck;
        this.notifications = notifications;
        this.inventory = inventory;
        this.enabled = config.get('QUEUES_ENABLED') ?? true;
    }
    onModuleInit() {
        if (!this.enabled) {
            this.logger.warn('Queues disabled (QUEUES_ENABLED=false). PDF and notifications run inline.');
            return;
        }
        let connection;
        try {
            connection = redisConnection(this.config.getOrThrow('REDIS_URL'));
        }
        catch (error) {
            this.logger.error({ err: error }, 'Invalid REDIS_URL; background jobs are disabled.');
            return;
        }
        this.pdfQueue = new bullmq_1.Queue('lims-reports', { connection });
        this.notificationsQueue = new bullmq_1.Queue('lims-notifications', { connection });
        this.maintenanceQueue = new bullmq_1.Queue('lims-maintenance', { connection });
        this.pdfWorker = new bullmq_1.Worker('lims-reports', async (job) => {
            if (job.name !== 'generate-pdf')
                return;
            await (0, tenant_context_1.runWithTenant)({ labId: String(job.data.labId) }, () => this.renderer().generateAndStore(String(job.data.reportId)));
        }, { connection, concurrency: 2 });
        this.notificationsWorker = new bullmq_1.Worker('lims-notifications', async (job) => {
            await (0, tenant_context_1.runWithTenant)({ labId: String(job.data.labId) }, () => this.notifications.send(job.data));
        }, { connection, concurrency: 4 });
        this.maintenanceWorker = new bullmq_1.Worker('lims-maintenance', async (job) => {
            if (job.name === 'tat-check') {
                const count = await this.tatCheck.runAllLabs();
                this.logger.log(`TAT breach check completed; ${count} cases flagged.`);
            }
            if (job.name === 'inventory-expiry') {
                const count = await this.inventory.runExpiryChecks();
                this.logger.log(`Inventory expiry check completed; ${count} lots expired.`);
            }
        }, { connection, concurrency: 1 });
        for (const worker of [this.pdfWorker, this.notificationsWorker, this.maintenanceWorker]) {
            worker.on('failed', (job, error) => {
                this.logger.error({ err: error, queue: worker.name, jobId: job?.id, jobName: job?.name }, 'Background job failed');
            });
        }
        void this.maintenanceQueue
            .upsertJobScheduler('tat-checks-15m', { every: 15 * 60 * 1_000 }, { name: 'tat-check', data: {} })
            .catch((error) => {
            this.logger.error({ err: error }, 'Could not register the recurring TAT check.');
        });
        void this.maintenanceQueue
            .upsertJobScheduler('inventory-expiry-daily', { every: 24 * 60 * 60 * 1_000 }, { name: 'inventory-expiry', data: {} })
            .catch((error) => {
            this.logger.error({ err: error }, 'Could not register the inventory expiry check.');
        });
    }
    async onModuleDestroy() {
        await Promise.allSettled([
            this.pdfWorker?.close(),
            this.notificationsWorker?.close(),
            this.maintenanceWorker?.close(),
            this.pdfQueue?.close(),
            this.notificationsQueue?.close(),
            this.maintenanceQueue?.close(),
        ]);
    }
    async enqueuePdf(reportId, labId, version) {
        if (!this.enabled || !this.pdfQueue) {
            await (0, tenant_context_1.runWithTenant)({ labId }, () => this.renderer().generateAndStore(reportId));
            return { queued: false, reportId, version };
        }
        try {
            await this.pdfQueue.add('generate-pdf', { reportId, labId, version }, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 2_000 },
                removeOnComplete: 100,
                removeOnFail: 200,
            });
            return { queued: true, reportId, version };
        }
        catch (error) {
            this.logger.error({ err: error }, 'PDF queue unavailable; generating inline.');
            await (0, tenant_context_1.runWithTenant)({ labId }, () => this.renderer().generateAndStore(reportId));
            return { queued: false, reportId, version };
        }
    }
    async enqueueNotification(payload) {
        if (!this.enabled || !this.notificationsQueue) {
            await (0, tenant_context_1.runWithTenant)({ labId: payload.labId }, () => this.notifications.send(payload));
            return;
        }
        try {
            await this.notificationsQueue.add('notify', payload, {
                attempts: 3,
                removeOnComplete: 200,
                removeOnFail: 200,
            });
        }
        catch (error) {
            this.logger.error({ err: error }, 'Notification queue unavailable; writing inline.');
            await (0, tenant_context_1.runWithTenant)({ labId: payload.labId }, () => this.notifications.send(payload));
        }
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = JobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        report_ports_1.ReportPortRegistry,
        tat_check_service_1.TatCheckService,
        notification_service_1.NotificationService,
        inventory_service_1.InventoryService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map