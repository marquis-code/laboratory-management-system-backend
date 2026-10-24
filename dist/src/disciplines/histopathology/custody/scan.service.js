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
exports.ScanService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const actor_1 = require("../../../common/utils/actor");
const transaction_1 = require("../../../common/utils/transaction");
const audit_service_1 = require("../../../core/audit/audit.service");
const block_schema_1 = require("../blocks/block.schema");
const case_schema_1 = require("../../../core/cases/case.schema");
const patient_schema_1 = require("../../../core/patients/patient.schema");
const slide_schema_1 = require("../slides/slide.schema");
const specimen_schema_1 = require("../../../core/specimens/specimen.schema");
const barcode_resolver_service_1 = require("./barcode-resolver.service");
const case_workflow_service_1 = require("../../../core/custody/case-workflow.service");
const custody_service_1 = require("../../../core/custody/custody.service");
const ENTITY_LABELS = {
    SPECIMEN: 'Specimen',
    BLOCK: 'Block',
    SLIDE: 'Slide',
};
let ScanService = class ScanService {
    connection;
    specimenModel;
    blockModel;
    slideModel;
    caseModel;
    patientModel;
    barcodeResolver;
    custody;
    workflow;
    audit;
    constructor(connection, specimenModel, blockModel, slideModel, caseModel, patientModel, barcodeResolver, custody, workflow, audit) {
        this.connection = connection;
        this.specimenModel = specimenModel;
        this.blockModel = blockModel;
        this.slideModel = slideModel;
        this.caseModel = caseModel;
        this.patientModel = patientModel;
        this.barcodeResolver = barcodeResolver;
        this.custody = custody;
        this.workflow = workflow;
        this.audit = audit;
    }
    async scan(input) {
        const actor = (0, actor_1.currentActor)();
        this.assertStationRole(input.station, actor);
        if (input.eventType && !input.reason?.trim()) {
            throw new common_1.BadRequestException('A reason is required for a rejection or recut request.');
        }
        if (input.eventType === 'RECUT_REQUESTED' && input.station !== 'PATHOLOGIST') {
            throw new common_1.BadRequestException('Recuts are requested from the pathologist desk.');
        }
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const match = await this.barcodeResolver.resolve(input.barcode, session);
            if (!match) {
                throw new common_1.NotFoundException(`No specimen, block or slide matches barcode ${input.barcode}. Check the label and try again.`);
            }
            const entityType = match.entityType;
            const entity = match.entity;
            const currentState = entity.status;
            let target;
            if (input.eventType) {
                target = input.eventType;
                if (input.eventType === 'RECUT_REQUESTED' && entityType !== 'SLIDE') {
                    throw new common_1.BadRequestException('Only slides can be sent for a recut.');
                }
                const check = (0, shared_1.checkTransition)(entityType, currentState, target);
                if (!check.ok) {
                    throw new common_1.ConflictException(check.reason ?? 'Invalid transition.');
                }
            }
            else {
                const stationTargetState = (0, shared_1.stationTarget)(entityType, input.station);
                if (!stationTargetState) {
                    throw new common_1.BadRequestException(`A ${ENTITY_LABELS[entityType].toLowerCase()} is not scanned at the ${shared_1.STATION_LABELS[input.station]} station.`);
                }
                const inferred = (0, shared_1.inferScanTarget)(entityType, input.station, currentState);
                if (!inferred) {
                    const check = (0, shared_1.checkTransition)(entityType, currentState, stationTargetState);
                    throw new common_1.ConflictException(check.reason ?? `${entity.label} cannot advance at ${shared_1.STATION_LABELS[input.station]}.`);
                }
                target = inferred;
            }
            const now = new Date();
            const updated = await this.persistState(match, target, input.station, now, input.reason, session);
            await this.custody.append({
                entityType,
                entityId: updated._id,
                caseId: updated.caseId,
                eventType: target,
                station: input.station,
                fromState: currentState,
                toState: target,
                reason: input.reason ?? null,
                barcode: updated.barcode,
                metadata: {
                    label: updated.label,
                    ...(input.metadata ?? {}),
                },
                timestamp: now,
            }, actor, session);
            if (target === 'GROSSED') {
                await this.workflow.advance(updated.caseId, 'IN_PROGRESS', actor, session, `Scan at ${shared_1.STATION_LABELS[input.station]}`);
            }
            else if (target === 'WITH_PATHOLOGIST') {
                await this.workflow.advance(updated.caseId, 'PENDING_REVIEW', actor, session, `Scan at ${shared_1.STATION_LABELS[input.station]}`);
            }
            await this.caseModel
                .updateOne({ _id: updated.caseId }, { $set: { lastScannedAt: now } }, { session })
                .exec();
            const caseDoc = await this.caseModel.findById(updated.caseId).session(session).exec();
            if (!caseDoc)
                throw new common_1.NotFoundException('Case not found for this item.');
            const patient = await this.patientModel.findById(caseDoc.patientId).session(session).exec();
            if (!patient)
                throw new common_1.NotFoundException('Patient not found for this case.');
            await this.audit.record({
                action: 'SCAN',
                entityType: ENTITY_LABELS[entityType],
                entityId: updated._id.toString(),
                caseId: caseDoc._id.toString(),
                before: {
                    status: currentState,
                    currentStation: entity.currentStation,
                    label: entity.label,
                },
                after: {
                    status: target,
                    currentStation: input.station,
                    label: updated.label,
                    station: input.station,
                },
                metadata: {
                    barcode: updated.barcode,
                    ...(input.reason ? { reason: input.reason } : {}),
                    ...(input.reasonCode ? { reasonCode: input.reasonCode } : {}),
                },
            }, session);
            const message = target === 'REJECTED'
                ? `${updated.label} rejected and held.`
                : target === 'RECUT_REQUESTED'
                    ? `${updated.label} sent for recut.`
                    : `${updated.label} → ${shared_1.PHYSICAL_STATE_LABELS[target]}`;
            return {
                entity: {
                    entityType,
                    id: updated._id.toString(),
                    barcode: updated.barcode,
                    label: updated.label,
                    status: target,
                    currentStation: input.station,
                    caseId: caseDoc._id.toString(),
                    accessionNumber: caseDoc.accessionNumber,
                    patientName: `${patient.firstName} ${patient.lastName}`,
                    caseStatus: caseDoc.status,
                },
                transition: {
                    from: currentState,
                    to: target,
                    eventType: target,
                    station: input.station,
                },
                message,
                nextHint: (0, shared_1.scanNextHint)(target),
                timestamp: now.toISOString(),
            };
        });
    }
    assertStationRole(station, actor) {
        const allowed = shared_1.STATION_ROLES[station];
        if (!actor.userRole || !allowed.includes(actor.userRole)) {
            throw new common_1.ForbiddenException(`Your role cannot scan at the ${shared_1.STATION_LABELS[station]} station.`);
        }
    }
    async persistState(match, target, station, now, reason, session) {
        const baseFilter = { _id: match.entity._id, status: match.entity.status };
        const update = { status: target, currentStation: station };
        if (match.entityType === 'BLOCK') {
            update.lastEventAt = now;
            const updated = await this.blockModel
                .findOneAndUpdate(baseFilter, { $set: update }, { new: true, session, runValidators: true })
                .exec();
            if (!updated)
                throw this.concurrentScanError(match.entity.label);
            return updated;
        }
        if (match.entityType === 'SLIDE') {
            update.lastEventAt = now;
            const updated = await this.slideModel
                .findOneAndUpdate(baseFilter, { $set: update }, { new: true, session, runValidators: true })
                .exec();
            if (!updated)
                throw this.concurrentScanError(match.entity.label);
            return updated;
        }
        if (target === 'REJECTED')
            update.rejectionReason = reason ?? null;
        const updated = await this.specimenModel
            .findOneAndUpdate(baseFilter, { $set: update }, { new: true, session, runValidators: true })
            .exec();
        if (!updated)
            throw this.concurrentScanError(match.entity.label);
        return updated;
    }
    concurrentScanError(label) {
        return new common_1.ConflictException(`${label} was already advanced by another station. Refresh and scan again.`);
    }
};
exports.ScanService = ScanService;
exports.ScanService = ScanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(1, (0, mongoose_1.InjectModel)(specimen_schema_1.SpecimenModelName)),
    __param(2, (0, mongoose_1.InjectModel)(block_schema_1.BlockModelName)),
    __param(3, (0, mongoose_1.InjectModel)(slide_schema_1.SlideModelName)),
    __param(4, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(5, (0, mongoose_1.InjectModel)(patient_schema_1.PatientModelName)),
    __metadata("design:paramtypes", [Function, mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        barcode_resolver_service_1.BarcodeResolverService,
        custody_service_1.CustodyService,
        case_workflow_service_1.CaseWorkflowService,
        audit_service_1.AuditService])
], ScanService);
//# sourceMappingURL=scan.service.js.map