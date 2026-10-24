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
exports.CustodyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const custody_event_schema_1 = require("./custody-event.schema");
const entities_1 = require("../../common/serializers/entities");
let CustodyService = class CustodyService {
    eventModel;
    constructor(eventModel) {
        this.eventModel = eventModel;
    }
    async append(input, actor, session) {
        if (!actor.userId) {
            throw new Error('Custody events require an authenticated actor.');
        }
        const event = new this.eventModel({
            entityType: input.entityType,
            entityId: input.entityId,
            caseId: input.caseId,
            eventType: input.eventType,
            station: input.station,
            fromState: input.fromState,
            toState: input.toState,
            reason: input.reason ?? null,
            userId: new mongoose_2.Types.ObjectId(actor.userId),
            userName: actor.userName,
            userRole: actor.userRole,
            timestamp: input.timestamp ?? new Date(),
            barcode: input.barcode ?? null,
            metadata: input.metadata ?? {},
        });
        await event.save({ session });
        return event;
    }
    async forEntity(entityType, entityId, limit = 500) {
        const events = await this.eventModel
            .find({ entityType, entityId: new mongoose_2.Types.ObjectId(entityId) })
            .sort({ timestamp: 1, _id: 1 })
            .limit(limit)
            .exec();
        return events.map((event) => (0, entities_1.toCustodyEvent)(event));
    }
    async forCase(caseId, limit = 2_000) {
        const events = await this.eventModel
            .find({ caseId: new mongoose_2.Types.ObjectId(caseId) })
            .sort({ timestamp: 1, _id: 1 })
            .limit(limit)
            .exec();
        return events.map((event) => (0, entities_1.toCustodyEvent)(event));
    }
    async latestForEntity(entityType, entityId) {
        const event = await this.eventModel
            .findOne({ entityType, entityId: new mongoose_2.Types.ObjectId(entityId) })
            .sort({ timestamp: -1, _id: -1 })
            .exec();
        if (!event)
            throw new common_1.NotFoundException('No custody history for this item.');
        return (0, entities_1.toCustodyEvent)(event);
    }
};
exports.CustodyService = CustodyService;
exports.CustodyService = CustodyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(custody_event_schema_1.CustodyEventModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CustodyService);
//# sourceMappingURL=custody.service.js.map