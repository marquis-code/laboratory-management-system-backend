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
exports.SlidesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const actor_1 = require("../../../common/utils/actor");
const format_1 = require("../../../common/utils/format");
const crypto_1 = require("../../../common/utils/crypto");
const transaction_1 = require("../../../common/utils/transaction");
const histopathology_serializers_1 = require("../histopathology.serializers");
const audit_service_1 = require("../../../core/audit/audit.service");
const block_schema_1 = require("../blocks/block.schema");
const case_schema_1 = require("../../../core/cases/case.schema");
const case_workflow_service_1 = require("../../../core/custody/case-workflow.service");
const custody_service_1 = require("../../../core/custody/custody.service");
const slide_schema_1 = require("./slide.schema");
let SlidesService = class SlidesService {
    connection;
    slideModel;
    blockModel;
    caseModel;
    custody;
    workflow;
    audit;
    constructor(connection, slideModel, blockModel, caseModel, custody, workflow, audit) {
        this.connection = connection;
        this.slideModel = slideModel;
        this.blockModel = blockModel;
        this.caseModel = caseModel;
        this.custody = custody;
        this.workflow = workflow;
        this.audit = audit;
    }
    async list(query) {
        const filter = {};
        if (query.caseId)
            filter.caseId = new mongoose_2.Types.ObjectId(query.caseId);
        if (query.blockId)
            filter.blockId = new mongoose_2.Types.ObjectId(query.blockId);
        const [slides, total] = await Promise.all([
            this.slideModel
                .find(filter)
                .sort({ blockLabel: 1, slideNumber: 1 })
                .skip((query.page - 1) * query.limit)
                .limit(query.limit)
                .exec(),
            this.slideModel.countDocuments(filter).exec(),
        ]);
        return (0, format_1.buildPaginated)(slides.map(histopathology_serializers_1.toSlide), total, query.page, query.limit);
    }
    async cut(dto) {
        const actor = (0, actor_1.currentActor)();
        const stainType = dto.stainType ?? 'H_AND_E';
        if (stainType !== 'H_AND_E' && !dto.specialStain?.trim()) {
            throw new common_1.BadRequestException('Name the special stain or antibody.');
        }
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const block = await this.blockModel.findById(dto.blockId).session(session).exec();
            if (!block)
                throw new common_1.NotFoundException('Block not found.');
            if (block.status !== 'EMBEDDED' && block.status !== 'CUT') {
                throw new common_1.ConflictException('The block must be embedded before slides can be cut. Scan it through processing and embedding first.');
            }
            const caseDoc = await this.caseModel.findById(block.caseId).session(session).exec();
            if (!caseDoc)
                throw new common_1.NotFoundException('Case not found.');
            const now = new Date();
            if (block.status === 'EMBEDDED') {
                const before = (0, histopathology_serializers_1.toBlock)(block);
                block.status = 'CUT';
                block.currentStation = 'MICROTOMY';
                block.lastEventAt = now;
                await block.save({ session });
                await this.custody.append({
                    entityType: 'BLOCK',
                    entityId: block._id,
                    caseId: block.caseId,
                    eventType: 'CUT',
                    station: 'MICROTOMY',
                    fromState: 'EMBEDDED',
                    toState: 'CUT',
                    reason: 'Sections cut',
                    barcode: block.barcode,
                    metadata: { label: block.label, slidesCut: dto.count },
                    timestamp: now,
                }, actor, session);
                await this.audit.record({
                    action: 'UPDATE',
                    entityType: 'Block',
                    entityId: block._id.toString(),
                    caseId: block.caseId.toString(),
                    before,
                    after: (0, histopathology_serializers_1.toBlock)(block),
                }, session);
            }
            const existing = await this.slideModel
                .countDocuments({ blockId: block._id, caseId: block.caseId })
                .session(session)
                .exec();
            const created = [];
            for (let index = 0; index < dto.count; index += 1) {
                const slideNumber = existing + index + 1;
                const slide = new this.slideModel({
                    caseId: block.caseId,
                    specimenId: block.specimenId,
                    blockId: block._id,
                    blockLabel: block.label,
                    slideNumber,
                    label: (0, shared_1.slideLabel)(block.label, slideNumber),
                    barcode: (0, crypto_1.makeBarcode)('SL'),
                    stainType,
                    specialStain: dto.specialStain?.trim() || null,
                    status: 'CUT',
                    currentStation: 'MICROTOMY',
                    requestReason: null,
                    notes: dto.notes?.trim() || null,
                    createdBy: new mongoose_2.Types.ObjectId(actor.userId ?? ''),
                    lastEventAt: now,
                });
                await slide.save({ session });
                created.push(slide);
                await this.custody.append({
                    entityType: 'SLIDE',
                    entityId: slide._id,
                    caseId: slide.caseId,
                    eventType: 'CUT',
                    station: 'MICROTOMY',
                    fromState: 'ACCESSIONED',
                    toState: 'CUT',
                    reason: 'Slide created at microtomy',
                    barcode: slide.barcode,
                    metadata: { label: slide.label, stainType: slide.stainType },
                    timestamp: now,
                }, actor, session);
                await this.audit.record({
                    action: 'CREATE',
                    entityType: 'Slide',
                    entityId: slide._id.toString(),
                    caseId: slide.caseId.toString(),
                    after: (0, histopathology_serializers_1.toSlide)(slide),
                }, session);
            }
            block.slideCount += created.length;
            await block.save({ session });
            await this.caseModel
                .updateOne({ _id: caseDoc._id }, { $inc: { 'summary.slideCount': created.length } }, { session })
                .exec();
            await this.workflow.advance(caseDoc._id, 'IN_PROGRESS', actor, session, 'Slides cut');
            return created.map(histopathology_serializers_1.toSlide);
        });
    }
    async requestStain(dto) {
        const actor = (0, actor_1.currentActor)();
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const block = await this.blockModel.findById(dto.blockId).session(session).exec();
            if (!block)
                throw new common_1.NotFoundException('Block not found.');
            if (block.status === 'REJECTED' || block.status === 'ARCHIVED') {
                throw new common_1.ConflictException('This block cannot accept a new stain request.');
            }
            const caseDoc = await this.caseModel.findById(block.caseId).session(session).exec();
            if (!caseDoc)
                throw new common_1.NotFoundException('Case not found.');
            const existing = await this.slideModel
                .countDocuments({ blockId: block._id, caseId: block.caseId })
                .session(session)
                .exec();
            const slideNumber = existing + 1;
            const now = new Date();
            const slide = new this.slideModel({
                caseId: block.caseId,
                specimenId: block.specimenId,
                blockId: block._id,
                blockLabel: block.label,
                slideNumber,
                label: (0, shared_1.slideLabel)(block.label, slideNumber),
                barcode: (0, crypto_1.makeBarcode)('SL'),
                stainType: dto.stainType,
                specialStain: dto.specialStain.trim(),
                status: 'ACCESSIONED',
                currentStation: null,
                requestReason: dto.reason.trim(),
                notes: null,
                createdBy: new mongoose_2.Types.ObjectId(actor.userId ?? ''),
                lastEventAt: now,
            });
            await slide.save({ session });
            await this.custody.append({
                entityType: 'SLIDE',
                entityId: slide._id,
                caseId: slide.caseId,
                eventType: 'ACCESSIONED',
                station: null,
                fromState: null,
                toState: 'ACCESSIONED',
                reason: dto.reason.trim(),
                barcode: slide.barcode,
                metadata: {
                    label: slide.label,
                    stainType: slide.stainType,
                    specialStain: slide.specialStain,
                },
                timestamp: now,
            }, actor, session);
            block.slideCount += 1;
            await block.save({ session });
            await this.caseModel
                .updateOne({ _id: caseDoc._id }, { $inc: { 'summary.slideCount': 1 } }, { session })
                .exec();
            await this.audit.record({
                action: 'CREATE',
                entityType: 'Slide',
                entityId: slide._id.toString(),
                caseId: slide.caseId.toString(),
                after: (0, histopathology_serializers_1.toSlide)(slide),
                metadata: { specialStainRequest: true, reason: dto.reason },
            }, session);
            return (0, histopathology_serializers_1.toSlide)(slide);
        });
    }
    async requestRecut(slideId, dto) {
        const actor = (0, actor_1.currentActor)();
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const slide = await this.slideModel.findById(slideId).session(session).exec();
            if (!slide)
                throw new common_1.NotFoundException('Slide not found.');
            const check = (0, shared_1.checkTransition)('SLIDE', slide.status, 'RECUT_REQUESTED');
            if (!check.ok)
                throw new common_1.ConflictException(check.reason ?? 'This slide cannot be recut.');
            const before = (0, histopathology_serializers_1.toSlide)(slide);
            slide.status = 'RECUT_REQUESTED';
            slide.currentStation = 'PATHOLOGIST';
            slide.lastEventAt = new Date();
            await slide.save({ session });
            await this.custody.append({
                entityType: 'SLIDE',
                entityId: slide._id,
                caseId: slide.caseId,
                eventType: 'RECUT_REQUESTED',
                station: 'PATHOLOGIST',
                fromState: before.status,
                toState: 'RECUT_REQUESTED',
                reason: dto.reason,
                barcode: slide.barcode,
                metadata: { label: slide.label },
            }, actor, session);
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'Slide',
                entityId: slide._id.toString(),
                caseId: slide.caseId.toString(),
                before,
                after: (0, histopathology_serializers_1.toSlide)(slide),
                metadata: { reason: dto.reason, recut: true },
            }, session);
            return (0, histopathology_serializers_1.toSlide)(slide);
        });
    }
};
exports.SlidesService = SlidesService;
exports.SlidesService = SlidesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(1, (0, mongoose_1.InjectModel)(slide_schema_1.SlideModelName)),
    __param(2, (0, mongoose_1.InjectModel)(block_schema_1.BlockModelName)),
    __param(3, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __metadata("design:paramtypes", [Function, mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        custody_service_1.CustodyService,
        case_workflow_service_1.CaseWorkflowService,
        audit_service_1.AuditService])
], SlidesService);
//# sourceMappingURL=slides.service.js.map