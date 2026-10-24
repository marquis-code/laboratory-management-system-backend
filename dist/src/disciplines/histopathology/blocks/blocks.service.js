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
exports.BlocksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const actor_1 = require("../../../common/utils/actor");
const format_1 = require("../../../common/utils/format");
const crypto_1 = require("../../../common/utils/crypto");
const transaction_1 = require("../../../common/utils/transaction");
const entities_1 = require("../../../common/serializers/entities");
const histopathology_serializers_1 = require("../histopathology.serializers");
const audit_service_1 = require("../../../core/audit/audit.service");
const case_schema_1 = require("../../../core/cases/case.schema");
const case_workflow_service_1 = require("../../../core/custody/case-workflow.service");
const custody_service_1 = require("../../../core/custody/custody.service");
const specimen_schema_1 = require("../../../core/specimens/specimen.schema");
const block_schema_1 = require("./block.schema");
let BlocksService = class BlocksService {
    connection;
    blockModel;
    specimenModel;
    caseModel;
    custody;
    workflow;
    audit;
    constructor(connection, blockModel, specimenModel, caseModel, custody, workflow, audit) {
        this.connection = connection;
        this.blockModel = blockModel;
        this.specimenModel = specimenModel;
        this.caseModel = caseModel;
        this.custody = custody;
        this.workflow = workflow;
        this.audit = audit;
    }
    async list(query) {
        const filter = {};
        if (query.caseId)
            filter.caseId = new mongoose_2.Types.ObjectId(query.caseId);
        if (query.specimenId)
            filter.specimenId = new mongoose_2.Types.ObjectId(query.specimenId);
        const [blocks, total] = await Promise.all([
            this.blockModel
                .find(filter)
                .sort({ specimenSequence: 1, blockNumber: 1 })
                .skip((query.page - 1) * query.limit)
                .limit(query.limit)
                .exec(),
            this.blockModel.countDocuments(filter).exec(),
        ]);
        return (0, format_1.buildPaginated)(blocks.map(histopathology_serializers_1.toBlock), total, query.page, query.limit);
    }
    async gross(dto) {
        const actor = (0, actor_1.currentActor)();
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const specimen = await this.specimenModel.findById(dto.specimenId).session(session).exec();
            if (!specimen)
                throw new common_1.NotFoundException('Specimen not found.');
            if (specimen.status === 'REJECTED' || specimen.status === 'ARCHIVED') {
                throw new common_1.ConflictException('A rejected or archived specimen cannot be grossed.');
            }
            const caseDoc = await this.caseModel.findById(specimen.caseId).session(session).exec();
            if (!caseDoc)
                throw new common_1.NotFoundException('Case not found.');
            const existingCount = await this.blockModel
                .countDocuments({ specimenId: specimen._id, caseId: caseDoc._id })
                .session(session)
                .exec();
            const now = new Date();
            const created = [];
            for (let index = 0; index < dto.blockCount; index += 1) {
                const blockNumber = existingCount + index + 1;
                const label = (0, shared_1.blockLabel)(specimen.sequence, blockNumber);
                const block = new this.blockModel({
                    caseId: caseDoc._id,
                    specimenId: specimen._id,
                    specimenSequence: specimen.sequence,
                    blockNumber,
                    label,
                    barcode: (0, crypto_1.makeBarcode)('BL'),
                    grossDescription: dto.blockDescriptions?.[index]?.trim() || dto.grossDescription.trim(),
                    status: 'ACCESSIONED',
                    currentStation: null,
                    slideCount: 0,
                    lastEventAt: now,
                });
                await block.save({ session });
                created.push(block);
                await this.custody.append({
                    entityType: 'BLOCK',
                    entityId: block._id,
                    caseId: caseDoc._id,
                    eventType: 'ACCESSIONED',
                    station: null,
                    fromState: null,
                    toState: 'ACCESSIONED',
                    reason: 'Block created at grossing',
                    barcode: block.barcode,
                    metadata: { label: block.label, specimenLabel: specimen.label },
                    timestamp: now,
                }, actor, session);
                await this.audit.record({
                    action: 'CREATE',
                    entityType: 'Block',
                    entityId: block._id.toString(),
                    caseId: caseDoc._id.toString(),
                    after: (0, histopathology_serializers_1.toBlock)(block),
                    metadata: { grossedFrom: specimen.label },
                }, session);
            }
            const specimenBefore = (0, entities_1.toSpecimen)(specimen);
            specimen.grossDescription = dto.grossDescription.trim();
            if (specimen.status === 'ACCESSIONED') {
                specimen.status = 'GROSSED';
                specimen.currentStation = 'GROSSING';
                await specimen.save({ session });
                await this.custody.append({
                    entityType: 'SPECIMEN',
                    entityId: specimen._id,
                    caseId: caseDoc._id,
                    eventType: 'GROSSED',
                    station: 'GROSSING',
                    fromState: 'ACCESSIONED',
                    toState: 'GROSSED',
                    reason: 'Gross examination recorded',
                    barcode: specimen.barcode,
                    metadata: { label: specimen.label, blocksCreated: dto.blockCount },
                    timestamp: now,
                }, actor, session);
            }
            else {
                await specimen.save({ session });
            }
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'Specimen',
                entityId: specimen._id.toString(),
                caseId: caseDoc._id.toString(),
                before: specimenBefore,
                after: (0, entities_1.toSpecimen)(specimen),
                metadata: { blocksCreated: dto.blockCount },
            }, session);
            await this.caseModel
                .updateOne({ _id: caseDoc._id }, { $inc: { 'summary.blockCount': dto.blockCount } }, { session })
                .exec();
            await this.workflow.advance(caseDoc._id, 'IN_PROGRESS', actor, session, 'Grossing recorded');
            return created.map(histopathology_serializers_1.toBlock);
        });
    }
};
exports.BlocksService = BlocksService;
exports.BlocksService = BlocksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(1, (0, mongoose_1.InjectModel)(block_schema_1.BlockModelName)),
    __param(2, (0, mongoose_1.InjectModel)(specimen_schema_1.SpecimenModelName)),
    __param(3, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __metadata("design:paramtypes", [Function, mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        custody_service_1.CustodyService,
        case_workflow_service_1.CaseWorkflowService,
        audit_service_1.AuditService])
], BlocksService);
//# sourceMappingURL=blocks.service.js.map