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
exports.IdempotencyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const node_crypto_1 = require("node:crypto");
const idempotency_schema_1 = require("./idempotency.schema");
let IdempotencyService = class IdempotencyService {
    model;
    constructor(model) {
        this.model = model;
    }
    hash(value) {
        return (0, node_crypto_1.createHash)('sha256').update(JSON.stringify(value)).digest('hex');
    }
    async run(key, requestHash, scope, work) {
        const existing = await this.model.findOne({ key, scope }).exec();
        if (existing) {
            if (existing.requestHash !== requestHash) {
                throw new common_1.ConflictException('This idempotency key was used for a different request.');
            }
            if (existing.status === 'COMPLETED') {
                return { value: existing.response, duplicate: true };
            }
            throw new common_1.ConflictException('This request is already being processed. Retry shortly.');
        }
        try {
            await this.model.create({
                key,
                scope,
                requestHash,
                status: 'PENDING',
                expiresAt: new Date(Date.now() + 7 * 86_400_000),
            });
        }
        catch (error) {
            if (isDuplicateKey(error)) {
                const concurrent = await this.model.findOne({ key, scope }).exec();
                if (concurrent?.status === 'COMPLETED') {
                    return { value: concurrent.response, duplicate: true };
                }
                throw new common_1.ConflictException('This request is already being processed. Retry shortly.');
            }
            throw error;
        }
        try {
            const value = await work();
            await this.model
                .updateOne({ key, scope }, { $set: { status: 'COMPLETED', response: value, statusCode: 200 } })
                .exec();
            return { value, duplicate: false };
        }
        catch (error) {
            await this.model.deleteOne({ key, scope }).exec();
            throw error;
        }
    }
};
exports.IdempotencyService = IdempotencyService;
exports.IdempotencyService = IdempotencyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(idempotency_schema_1.IdempotencyModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], IdempotencyService);
function isDuplicateKey(error) {
    return (typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000);
}
//# sourceMappingURL=idempotency.service.js.map