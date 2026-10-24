"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InventoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const actor_1 = require("../../common/utils/actor");
const format_1 = require("../../common/utils/format");
const transaction_1 = require("../../common/utils/transaction");
const audit_service_1 = require("../../core/audit/audit.service");
const block_schema_1 = require("../../disciplines/histopathology/blocks/block.schema");
const case_schema_1 = require("../../core/cases/case.schema");
const custody_service_1 = require("../../core/custody/custody.service");
const lab_schema_1 = require("../../core/labs/lab.schema");
const notification_service_1 = require("../../core/notifications/notification.service");
const slide_schema_1 = require("../../disciplines/histopathology/slides/slide.schema");
const user_schema_1 = require("../../core/users/user.schema");
const reagent_lot_schema_1 = require("./reagent-lot.schema");
const stain_run_schema_1 = require("./stain-run.schema");
let InventoryService = InventoryService_1 = class InventoryService {
    connection;
    lotModel;
    runModel;
    caseModel;
    blockModel;
    slideModel;
    userModel;
    labModel;
    custody;
    audit;
    notifications;
    config;
    logger = new common_1.Logger(InventoryService_1.name);
    constructor(connection, lotModel, runModel, caseModel, blockModel, slideModel, userModel, labModel, custody, audit, notifications, config) {
        this.connection = connection;
        this.lotModel = lotModel;
        this.runModel = runModel;
        this.caseModel = caseModel;
        this.blockModel = blockModel;
        this.slideModel = slideModel;
        this.userModel = userModel;
        this.labModel = labModel;
        this.custody = custody;
        this.audit = audit;
        this.notifications = notifications;
        this.config = config;
    }
    async listLots(query) {
        const filter = {};
        if (query.category)
            filter.category = query.category;
        if (query.status)
            filter.status = query.status;
        if (query.q) {
            const regex = new RegExp(query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            filter.$or = [{ name: regex }, { vendor: regex }, { lotNumber: regex }];
        }
        if (query.expiringWithinDays !== undefined) {
            filter.expiresAt = {
                $gte: new Date(),
                $lte: new Date(Date.now() + query.expiringWithinDays * 86_400_000),
            };
            filter.status = 'ACTIVE';
        }
        const [docs, total] = await Promise.all([
            this.lotModel
                .find(filter)
                .sort({ expiresAt: 1, name: 1 })
                .skip((query.page - 1) * query.limit)
                .limit(query.limit)
                .exec(),
            this.lotModel.countDocuments(filter).exec(),
        ]);
        return (0, format_1.buildPaginated)(await Promise.all(docs.map((doc) => this.toLot(doc))), total, query.page, query.limit);
    }
    async createLot(dto, actor) {
        if (new Date(dto.expiresAt) <= new Date(dto.receivedAt)) {
            throw new common_1.ConflictException('Expiry must be after the date the lot was received.');
        }
        if (dto.openedAt && new Date(dto.openedAt) < new Date(dto.receivedAt)) {
            throw new common_1.ConflictException('Opened date cannot be before the received date.');
        }
        const existing = await this.lotModel
            .findOne({ lotNumber: dto.lotNumber.trim(), vendor: dto.vendor.trim() })
            .exec();
        if (existing)
            throw new common_1.ConflictException('This vendor lot number is already registered.');
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const lot = new this.lotModel({
                name: dto.name.trim(),
                category: dto.category,
                vendor: dto.vendor.trim(),
                catalogNumber: dto.catalogNumber?.trim() || null,
                lotNumber: dto.lotNumber.trim(),
                storageLocation: dto.storageLocation?.trim() || null,
                quantity: dto.quantity,
                initialQuantity: dto.quantity,
                unit: dto.unit.trim(),
                receivedAt: new Date(dto.receivedAt),
                openedAt: dto.openedAt ? new Date(dto.openedAt) : null,
                expiresAt: new Date(dto.expiresAt),
                status: 'QUARANTINED',
                validationStatus: 'PENDING',
                reorderLevel: dto.reorderLevel ?? 0,
                notes: dto.notes?.trim() || null,
                createdBy: new mongoose_2.Types.ObjectId(actor.id),
            });
            await lot.save({ session });
            await this.audit.record({
                action: 'CREATE',
                entityType: 'ReagentLot',
                entityId: lot._id.toString(),
                after: this.lotSnapshot(lot),
                metadata: { lotNumber: lot.lotNumber, vendor: lot.vendor },
            }, session);
            return this.toLot(lot);
        });
    }
    async updateLot(id, dto, _actor) {
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const lot = await this.lotModel.findById(id).session(session).exec();
            if (!lot)
                throw new common_1.NotFoundException('Reagent lot not found.');
            const before = this.lotSnapshot(lot);
            if (dto.name !== undefined)
                lot.name = dto.name.trim();
            if (dto.vendor !== undefined)
                lot.vendor = dto.vendor.trim();
            if (dto.storageLocation !== undefined)
                lot.storageLocation = dto.storageLocation.trim() || null;
            if (dto.openedAt !== undefined)
                lot.openedAt = dto.openedAt ? new Date(dto.openedAt) : null;
            if (dto.expiresAt !== undefined)
                lot.expiresAt = new Date(dto.expiresAt);
            if (dto.quantity !== undefined) {
                lot.quantity = dto.quantity;
                if (lot.quantity <= 0 && lot.status === 'ACTIVE')
                    lot.status = 'DEPLETED';
            }
            if (dto.reorderLevel !== undefined)
                lot.reorderLevel = dto.reorderLevel;
            if (dto.notes !== undefined)
                lot.notes = dto.notes.trim() || null;
            await lot.save({ session });
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'ReagentLot',
                entityId: lot._id.toString(),
                before,
                after: this.lotSnapshot(lot),
            }, session);
            return this.toLot(lot);
        });
    }
    async validateLot(id, dto, actor) {
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const lot = await this.lotModel.findById(id).session(session).exec();
            if (!lot)
                throw new common_1.NotFoundException('Reagent lot not found.');
            if (lot.expiresAt <= new Date()) {
                throw new common_1.ConflictException('An expired lot cannot be validated.');
            }
            const before = this.lotSnapshot(lot);
            lot.validationStatus = 'VALIDATED';
            lot.validatedAt = new Date();
            lot.validatedBy = new mongoose_2.Types.ObjectId(actor.id);
            lot.validationNote = dto.note?.trim() || null;
            lot.status = lot.quantity > 0 ? 'ACTIVE' : 'DEPLETED';
            await lot.save({ session });
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'ReagentLot',
                entityId: lot._id.toString(),
                before,
                after: this.lotSnapshot(lot),
                metadata: { event: 'validated' },
            }, session);
            return this.toLot(lot);
        });
    }
    async rejectLot(id, dto, _actor) {
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const lot = await this.lotModel.findById(id).session(session).exec();
            if (!lot)
                throw new common_1.NotFoundException('Reagent lot not found.');
            const before = this.lotSnapshot(lot);
            lot.status = 'REJECTED';
            lot.validationStatus = 'FAILED';
            lot.validationNote = dto.note?.trim() || 'Rejected by laboratory QC.';
            await lot.save({ session });
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'ReagentLot',
                entityId: lot._id.toString(),
                before,
                after: this.lotSnapshot(lot),
                metadata: { event: 'rejected', note: lot.validationNote },
            }, session);
            return this.toLot(lot);
        });
    }
    async adjustLot(id, dto, _actor) {
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const lot = await this.lotModel.findById(id).session(session).exec();
            if (!lot)
                throw new common_1.NotFoundException('Reagent lot not found.');
            const next = lot.quantity + dto.delta;
            if (next < 0)
                throw new common_1.ConflictException('Stock cannot fall below zero.');
            const before = this.lotSnapshot(lot);
            lot.quantity = next;
            if (next === 0 && lot.status === 'ACTIVE')
                lot.status = 'DEPLETED';
            if (next > 0 && lot.status === 'DEPLETED')
                lot.status = 'ACTIVE';
            await lot.save({ session });
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'ReagentLot',
                entityId: lot._id.toString(),
                before,
                after: this.lotSnapshot(lot),
                metadata: { event: 'stock-adjustment', delta: dto.delta, note: dto.note },
            }, session);
            return this.toLot(lot);
        });
    }
    async listRuns(query) {
        const filter = {};
        if (query.caseId)
            filter.caseId = new mongoose_2.Types.ObjectId(query.caseId);
        if (query.status)
            filter.status = query.status;
        const [docs, total] = await Promise.all([
            this.runModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip((query.page - 1) * query.limit)
                .limit(query.limit)
                .exec(),
            this.runModel.countDocuments(filter).exec(),
        ]);
        return (0, format_1.buildPaginated)(await Promise.all(docs.map((doc) => this.toRun(doc))), total, query.page, query.limit);
    }
    async createRun(dto, actor) {
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const caseDoc = await this.caseModel.findById(dto.caseId).session(session).exec();
            if (!caseDoc)
                throw new common_1.NotFoundException('Case not found.');
            if (dto.slideId) {
                const slide = await this.slideModel
                    .findOne({ _id: dto.slideId, caseId: caseDoc._id })
                    .session(session)
                    .exec();
                if (!slide)
                    throw new common_1.NotFoundException('Slide not found in this case.');
                if (slide.status !== 'CUT' &&
                    slide.status !== 'STAINED' &&
                    slide.status !== 'RECUT_REQUESTED') {
                    throw new common_1.ConflictException('This slide is not waiting for a stain run.');
                }
            }
            if (dto.blockId) {
                const block = await this.blockModel
                    .findOne({ _id: dto.blockId, caseId: caseDoc._id })
                    .session(session)
                    .exec();
                if (!block)
                    throw new common_1.NotFoundException('Block not found in this case.');
            }
            const lots = await this.assertUsableLots(dto.lots, session);
            const now = new Date();
            const run = new this.runModel({
                caseId: caseDoc._id,
                slideId: dto.slideId ? new mongoose_2.Types.ObjectId(dto.slideId) : null,
                blockId: dto.blockId ? new mongoose_2.Types.ObjectId(dto.blockId) : null,
                stainType: dto.stainType,
                stainName: dto.stainName.trim(),
                status: 'RUNNING',
                qcResult: 'PENDING',
                lots: lots.map(({ lot, quantityUsed }) => ({
                    lotId: lot._id,
                    lotNumber: lot.lotNumber,
                    name: lot.name,
                    quantityUsed,
                })),
                equipment: dto.equipment?.trim() || null,
                operatorId: new mongoose_2.Types.ObjectId(actor.id),
                startedAt: now,
                notes: dto.notes?.trim() || null,
                createdBy: new mongoose_2.Types.ObjectId(actor.id),
            });
            await run.save({ session });
            for (const { lot, quantityUsed } of lots) {
                const next = lot.quantity - quantityUsed;
                lot.quantity = next;
                if (next <= 0)
                    lot.status = 'DEPLETED';
                await lot.save({ session });
                await this.audit.record({
                    action: 'UPDATE',
                    entityType: 'ReagentLot',
                    entityId: lot._id.toString(),
                    before: { quantity: lot.quantity + quantityUsed, status: lot.status },
                    after: { quantity: lot.quantity, status: lot.status },
                    metadata: { event: 'stain-run-consumption', stainRunId: run._id.toString() },
                }, session);
            }
            if (dto.slideId) {
                await this.slideModel
                    .updateOne({ _id: dto.slideId }, { $set: { stainRunId: run._id } }, { session })
                    .exec();
            }
            await this.audit.record({
                action: 'CREATE',
                entityType: 'StainRun',
                entityId: run._id.toString(),
                caseId: caseDoc._id.toString(),
                after: this.runSnapshot(run),
                metadata: { stainName: run.stainName, lots: lots.length },
            }, session);
            return this.toRun(run);
        });
    }
    async completeRun(id, dto, actor) {
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const run = await this.runModel.findById(id).session(session).exec();
            if (!run)
                throw new common_1.NotFoundException('Stain run not found.');
            if (run.status === 'COMPLETED')
                throw new common_1.ConflictException('This run is already complete.');
            const caseDoc = await this.caseModel.findById(run.caseId).session(session).exec();
            if (!caseDoc)
                throw new common_1.NotFoundException('Case not found.');
            const before = this.runSnapshot(run);
            run.status =
                dto.qcResult === 'FAIL' ? 'FAILED' : dto.qcResult === 'PENDING' ? 'QC_HOLD' : 'COMPLETED';
            run.qcResult = dto.qcResult;
            run.completedAt = new Date();
            if (dto.notes !== undefined)
                run.notes = dto.notes.trim() || null;
            await run.save({ session });
            if (dto.qcResult === 'PASS' && run.slideId) {
                const slide = await this.slideModel.findById(run.slideId).session(session).exec();
                if (slide) {
                    const check = (0, shared_1.checkTransition)('SLIDE', slide.status, 'STAINED');
                    if (check.ok) {
                        const from = slide.status;
                        slide.status = 'STAINED';
                        slide.currentStation = 'STAINING';
                        slide.lastEventAt = new Date();
                        await slide.save({ session });
                        await this.custody.append({
                            entityType: 'SLIDE',
                            entityId: slide._id,
                            caseId: slide.caseId,
                            eventType: 'STAINED',
                            station: 'STAINING',
                            fromState: from,
                            toState: 'STAINED',
                            reason: `Stain run ${run.stainName} passed QC`,
                            barcode: slide.barcode,
                            metadata: {
                                label: slide.label,
                                stainRunId: run._id.toString(),
                                stainName: run.stainName,
                            },
                            timestamp: new Date(),
                        }, this.toActor(actor), session);
                    }
                }
            }
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'StainRun',
                entityId: run._id.toString(),
                caseId: run.caseId.toString(),
                before,
                after: this.runSnapshot(run),
                metadata: { qcResult: run.qcResult },
            }, session);
            return this.toRun(run);
        });
    }
    async checkExpiries() {
        const now = new Date();
        const soon = new Date(now.getTime() + 30 * 86_400_000);
        const lots = await this.lotModel
            .find({
            status: { $in: ['ACTIVE', 'QUARANTINED'] },
            expiresAt: { $lte: soon },
        })
            .limit(500)
            .exec();
        let expired = 0;
        for (const lot of lots) {
            if (lot.expiresAt <= now && lot.status !== 'EXPIRED') {
                lot.status = 'EXPIRED';
                lot.expiryAlertedAt = now;
                await lot.save();
                expired += 1;
                await this.notifications.send({
                    labId: lot.labId.toString(),
                    type: 'LOT_EXPIRED',
                    title: `Lot expired — ${lot.name}`,
                    body: `${lot.name} (lot ${lot.lotNumber}) expired on ${lot.expiresAt.toISOString().slice(0, 10)}. Remove it from active use.`,
                    role: 'LAB_ADMIN',
                    entityType: 'ReagentLot',
                    entityId: lot._id.toString(),
                    metadata: { lotNumber: lot.lotNumber, vendor: lot.vendor },
                });
            }
            else if (lot.status === 'ACTIVE' &&
                lot.expiresAt > now &&
                (!lot.expiryAlertedAt || now.getTime() - lot.expiryAlertedAt.getTime() > 7 * 86_400_000)) {
                lot.expiryAlertedAt = now;
                await lot.save();
                const days = Math.ceil((lot.expiresAt.getTime() - now.getTime()) / 86_400_000);
                await this.notifications.send({
                    labId: lot.labId.toString(),
                    type: 'LOT_EXPIRING',
                    title: `Lot expiring in ${days} days — ${lot.name}`,
                    body: `${lot.name} (lot ${lot.lotNumber}) expires on ${lot.expiresAt.toISOString().slice(0, 10)}. Plan a replacement before it leaves the validated window.`,
                    role: 'LAB_ADMIN',
                    entityType: 'ReagentLot',
                    entityId: lot._id.toString(),
                    metadata: { lotNumber: lot.lotNumber, days },
                });
            }
        }
        if (expired > 0)
            this.logger.warn(`Marked ${expired} reagent lots expired.`);
        return expired;
    }
    async runExpiryChecks() {
        const labs = await this.labModel.find({ active: true }).select('_id').exec();
        let total = 0;
        for (const lab of labs) {
            total += await this.runInTenant(lab._id.toString(), () => this.checkExpiries());
        }
        return total;
    }
    async runInTenant(labId, fn) {
        const { runWithTenant } = await Promise.resolve().then(() => __importStar(require('../../common/context/tenant-context')));
        return runWithTenant({ labId }, fn);
    }
    async assertUsableLots(selections, session) {
        const results = [];
        for (const selection of selections) {
            const lot = await this.lotModel.findById(selection.lotId).session(session).exec();
            if (!lot)
                throw new common_1.NotFoundException('Reagent lot not found.');
            if (lot.status !== 'ACTIVE' || lot.validationStatus !== 'VALIDATED') {
                throw new common_1.ConflictException(`${lot.name} (lot ${lot.lotNumber}) is not validated and active. Expired or unvalidated lots cannot be used.`);
            }
            if (lot.expiresAt <= new Date()) {
                throw new common_1.ConflictException(`${lot.name} (lot ${lot.lotNumber}) has expired.`);
            }
            if (lot.quantity < selection.quantityUsed) {
                throw new common_1.ConflictException(`${lot.name} has only ${lot.quantity} ${lot.unit} left; ${selection.quantityUsed} requested.`);
            }
            results.push({ lot, quantityUsed: selection.quantityUsed });
        }
        return results;
    }
    async toLot(doc) {
        let validatedBy = null;
        if (doc.validatedBy) {
            const user = await this.userModel.findById(doc.validatedBy).exec();
            if (user)
                validatedBy = {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    subspecialties: user.subspecialties,
                    disciplines: user.disciplines ?? [],
                };
        }
        return {
            id: doc._id.toString(),
            name: doc.name,
            category: doc.category,
            vendor: doc.vendor,
            catalogNumber: doc.catalogNumber,
            lotNumber: doc.lotNumber,
            storageLocation: doc.storageLocation,
            quantity: doc.quantity,
            initialQuantity: doc.initialQuantity,
            unit: doc.unit,
            receivedAt: doc.receivedAt.toISOString(),
            openedAt: doc.openedAt ? doc.openedAt.toISOString() : null,
            expiresAt: doc.expiresAt.toISOString(),
            status: doc.status,
            validationStatus: doc.validationStatus,
            validatedAt: doc.validatedAt ? doc.validatedAt.toISOString() : null,
            validatedBy,
            notes: doc.notes,
            createdAt: doc.createdAt.toISOString(),
        };
    }
    async toRun(doc) {
        const [operator, caseDoc, slide] = await Promise.all([
            doc.operatorId ? this.userModel.findById(doc.operatorId).exec() : null,
            this.caseModel.findById(doc.caseId).select('accessionNumber').exec(),
            doc.slideId ? this.slideModel.findById(doc.slideId).select('label').exec() : null,
        ]);
        return {
            id: doc._id.toString(),
            caseId: doc.caseId.toString(),
            accessionNumber: caseDoc?.accessionNumber ?? '—',
            slideLabel: slide?.label ?? null,
            slideId: doc.slideId ? doc.slideId.toString() : null,
            blockId: doc.blockId ? doc.blockId.toString() : null,
            stainType: doc.stainType,
            stainName: doc.stainName,
            status: doc.status,
            qcResult: doc.qcResult,
            lots: doc.lots.map((lot) => ({
                lotId: lot.lotId.toString(),
                lotNumber: lot.lotNumber,
                name: lot.name,
                quantityUsed: lot.quantityUsed,
            })),
            equipment: doc.equipment,
            operator: operator
                ? {
                    id: operator._id.toString(),
                    name: operator.name,
                    email: operator.email,
                    role: operator.role,
                    subspecialties: operator.subspecialties,
                    disciplines: operator.disciplines ?? [],
                }
                : null,
            startedAt: doc.startedAt ? doc.startedAt.toISOString() : null,
            completedAt: doc.completedAt ? doc.completedAt.toISOString() : null,
            notes: doc.notes,
            createdAt: doc.createdAt.toISOString(),
        };
    }
    lotSnapshot(lot) {
        return {
            name: lot.name,
            lotNumber: lot.lotNumber,
            status: lot.status,
            validationStatus: lot.validationStatus,
            quantity: lot.quantity,
            expiresAt: lot.expiresAt.toISOString(),
        };
    }
    runSnapshot(run) {
        return {
            stainName: run.stainName,
            status: run.status,
            qcResult: run.qcResult,
            lots: run.lots.map((lot) => lot.lotNumber),
        };
    }
    toActor(actor) {
        return { userId: actor.id, userName: actor.name, userRole: actor.role };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = InventoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(1, (0, mongoose_1.InjectModel)(reagent_lot_schema_1.ReagentLotModelName)),
    __param(2, (0, mongoose_1.InjectModel)(stain_run_schema_1.StainRunModelName)),
    __param(3, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(4, (0, mongoose_1.InjectModel)(block_schema_1.BlockModelName)),
    __param(5, (0, mongoose_1.InjectModel)(slide_schema_1.SlideModelName)),
    __param(6, (0, mongoose_1.InjectModel)(user_schema_1.UserModelName)),
    __param(7, (0, mongoose_1.InjectModel)(lab_schema_1.LabModelName)),
    __metadata("design:paramtypes", [Function, mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        custody_service_1.CustodyService,
        audit_service_1.AuditService,
        notification_service_1.NotificationService,
        config_1.ConfigService])
], InventoryService);
void actor_1.currentActor;
void shared_1.REAGENT_CATEGORY_LABELS;
void config_1.ConfigService;
//# sourceMappingURL=inventory.service.js.map