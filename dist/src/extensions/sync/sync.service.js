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
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@lims/shared");
const idempotency_service_1 = require("../../common/idempotency/idempotency.service");
const custody_ports_1 = require("../../core/custody/custody-ports");
let SyncService = class SyncService {
    custody;
    idempotency;
    constructor(custody, idempotency) {
        this.custody = custody;
        this.idempotency = idempotency;
    }
    async batch(dto) {
        const results = [];
        for (const mutation of dto.mutations) {
            results.push(await this.apply(mutation));
        }
        return { results, syncedAt: new Date().toISOString() };
    }
    async apply(mutation) {
        try {
            if (mutation.type !== 'SCAN' && mutation.type !== 'REJECT' && mutation.type !== 'RECUT') {
                throw new common_1.BadRequestException('This mutation type is not supported by the sync endpoint.');
            }
            const parsed = shared_1.scanIdempotencySchema.safeParse(mutation.payload);
            if (!parsed.success) {
                throw new common_1.BadRequestException(parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`));
            }
            const payload = parsed.data;
            const scanInput = {
                barcode: payload.barcode,
                station: payload.station,
                eventType: mutation.type === 'REJECT'
                    ? 'REJECTED'
                    : mutation.type === 'RECUT'
                        ? 'RECUT_REQUESTED'
                        : payload.eventType,
                reason: payload.reason,
                reasonCode: payload.reasonCode,
                metadata: { ...(payload.metadata ?? {}), sync: true, clientId: mutation.id },
            };
            const outcome = await this.idempotency.run(mutation.id, this.idempotency.hash({ type: mutation.type, payload }), 'sync-mutation', () => this.custody.scanHandler.scan(scanInput));
            return {
                id: mutation.id,
                ok: true,
                duplicate: outcome.duplicate,
                result: outcome.value,
                error: null,
            };
        }
        catch (error) {
            return {
                id: mutation.id,
                ok: false,
                duplicate: false,
                result: null,
                error: error instanceof Error ? error.message : 'Sync failed.',
            };
        }
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [custody_ports_1.CustodyPortRegistry,
        idempotency_service_1.IdempotencyService])
], SyncService);
//# sourceMappingURL=sync.service.js.map