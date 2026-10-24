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
exports.PreanalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const crypto_1 = require("../../common/utils/crypto");
const audit_service_1 = require("../audit/audit.service");
const test_request_schema_1 = require("../test-requests/test-request.schema");
const preanalytics_schema_1 = require("./preanalytics.schema");
let PreanalyticsService = class PreanalyticsService {
    centreModel;
    consignmentModel;
    requestModel;
    audit;
    constructor(centreModel, consignmentModel, requestModel, audit) {
        this.centreModel = centreModel;
        this.consignmentModel = consignmentModel;
        this.requestModel = requestModel;
        this.audit = audit;
    }
    async centres() {
        const centres = await this.centreModel.find({}).sort({ name: 1 }).exec();
        return centres.map((centre) => this.toCentre(centre));
    }
    async createCentre(body, actor) {
        const parsed = shared_1.collectionCentreSchema.safeParse(body);
        if (!parsed.success)
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        const existing = await this.centreModel
            .findOne({ code: parsed.data.code.toUpperCase() })
            .exec();
        if (existing)
            throw new common_1.ConflictException('A collection centre with this code already exists.');
        const centre = await this.centreModel.create({
            ...parsed.data,
            code: parsed.data.code.toUpperCase(),
            homeCollection: parsed.data.homeCollection ?? false,
            active: parsed.data.active ?? true,
        });
        await this.audit.record({
            action: 'CREATE',
            entityType: 'CollectionCentre',
            entityId: centre._id.toString(),
            after: this.toCentre(centre),
            metadata: { actor: actor.userName },
        });
        return this.toCentre(centre);
    }
    async consignments() {
        const consignments = await this.consignmentModel
            .find({})
            .sort({ createdAt: -1 })
            .limit(100)
            .exec();
        return Promise.all(consignments.map((consignment) => this.toConsignment(consignment)));
    }
    async createConsignment(body, actor) {
        const parsed = shared_1.consignmentSchema.safeParse(body);
        if (!parsed.success)
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        const centre = await this.centreModel.findById(parsed.data.centreId).exec();
        if (!centre)
            throw new common_1.NotFoundException('Collection centre not found.');
        const requestIds = parsed.data.testRequestIds.map((id) => new mongoose_2.Types.ObjectId(id));
        const requests = await this.requestModel.find({ _id: { $in: requestIds } }).exec();
        if (requests.length !== requestIds.length)
            throw new common_1.NotFoundException('One or more test requests were not found.');
        if (requests.some((request) => request.status === 'RELEASED' || request.status === 'CANCELLED')) {
            throw new common_1.ConflictException('Closed test requests cannot be added to a consignment.');
        }
        const code = (0, crypto_1.makeBarcode)('CN');
        const consignment = await this.consignmentModel.create({
            code,
            centreId: centre._id,
            testRequestIds: requestIds,
            riderName: parsed.data.riderName ?? null,
            riderPhone: parsed.data.riderPhone ?? null,
            notes: parsed.data.notes ?? null,
            status: 'CREATED',
            createdBy: actor.userId ? new mongoose_2.Types.ObjectId(actor.userId) : null,
        });
        await this.requestModel.updateMany({ _id: { $in: requestIds } }, { $set: { consignmentId: consignment._id, collectionCentreId: centre._id } });
        await this.audit.record({
            action: 'CREATE',
            entityType: 'Consignment',
            entityId: consignment._id.toString(),
            after: await this.toConsignment(consignment),
            metadata: { actor: actor.userName },
        });
        return this.toConsignment(consignment);
    }
    async dispatch(id, actor) {
        const consignment = await this.consignmentModel.findById(id).exec();
        if (!consignment)
            throw new common_1.NotFoundException('Consignment not found.');
        if (consignment.status === 'RECEIVED' || consignment.status === 'REJECTED') {
            throw new common_1.ConflictException('This consignment is already closed.');
        }
        consignment.status = 'DISPATCHED';
        consignment.dispatchedAt = new Date();
        await consignment.save();
        await this.audit.record({
            action: 'UPDATE',
            entityType: 'Consignment',
            entityId: consignment._id.toString(),
            after: { status: consignment.status },
            metadata: { actor: actor.userName, handoff: true },
        });
        return this.toConsignment(consignment);
    }
    async receive(id, body, actor) {
        const parsed = shared_1.receiveConsignmentSchema.safeParse(body);
        if (!parsed.success)
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        const consignment = await this.consignmentModel.findById(id).exec();
        if (!consignment)
            throw new common_1.NotFoundException('Consignment not found.');
        if (consignment.status === 'RECEIVED' || consignment.status === 'REJECTED') {
            throw new common_1.ConflictException('This consignment is already closed.');
        }
        if (!parsed.data.accepted && !parsed.data.rejectionReason) {
            throw new common_1.BadRequestException('A rejection reason is required.');
        }
        consignment.status = parsed.data.accepted ? 'RECEIVED' : 'REJECTED';
        consignment.receivedAt = new Date();
        if (!parsed.data.accepted) {
            consignment.rejectedAt = new Date();
            consignment.rejectionReason = parsed.data.rejectionReason ?? null;
        }
        await consignment.save();
        await this.requestModel.updateMany({ _id: { $in: consignment.testRequestIds } }, { $set: { status: parsed.data.accepted ? 'RECEIVED' : 'CANCELLED' } });
        await this.audit.record({
            action: 'UPDATE',
            entityType: 'Consignment',
            entityId: consignment._id.toString(),
            after: { status: consignment.status },
            metadata: { actor: actor.userName, rejectionReason: consignment.rejectionReason },
        });
        return this.toConsignment(consignment);
    }
    async toConsignment(consignment) {
        const centre = await this.centreModel.findById(consignment.centreId).exec();
        return {
            id: consignment._id.toString(),
            code: consignment.code,
            centreId: consignment.centreId.toString(),
            centreName: centre?.name ?? 'Collection centre',
            riderName: consignment.riderName,
            riderPhone: consignment.riderPhone,
            status: consignment.status,
            testRequestIds: consignment.testRequestIds.map((id) => id.toString()),
            testRequestCount: consignment.testRequestIds.length,
            dispatchedAt: consignment.dispatchedAt?.toISOString() ?? null,
            receivedAt: consignment.receivedAt?.toISOString() ?? null,
            rejectedAt: consignment.rejectedAt?.toISOString() ?? null,
            rejectionReason: consignment.rejectionReason,
            notes: consignment.notes,
            createdAt: consignment.createdAt.toISOString(),
        };
    }
    toCentre(centre) {
        return {
            id: centre._id.toString(),
            code: centre.code,
            name: centre.name,
            address: centre.address,
            phone: centre.phone,
            homeCollection: centre.homeCollection,
            active: centre.active,
        };
    }
};
exports.PreanalyticsService = PreanalyticsService;
exports.PreanalyticsService = PreanalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(preanalytics_schema_1.CollectionCentreModelName)),
    __param(1, (0, mongoose_1.InjectModel)(preanalytics_schema_1.ConsignmentModelName)),
    __param(2, (0, mongoose_1.InjectModel)(test_request_schema_1.TestRequestModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        audit_service_1.AuditService])
], PreanalyticsService);
//# sourceMappingURL=preanalytics.service.js.map