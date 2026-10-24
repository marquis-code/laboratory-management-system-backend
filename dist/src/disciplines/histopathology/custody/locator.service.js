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
exports.LocatorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const histopathology_serializers_1 = require("../histopathology.serializers");
const entities_1 = require("../../../common/serializers/entities");
const block_schema_1 = require("../blocks/block.schema");
const case_schema_1 = require("../../../core/cases/case.schema");
const patient_schema_1 = require("../../../core/patients/patient.schema");
const slide_schema_1 = require("../slides/slide.schema");
const specimen_schema_1 = require("../../../core/specimens/specimen.schema");
const barcode_resolver_service_1 = require("./barcode-resolver.service");
const custody_service_1 = require("../../../core/custody/custody.service");
let LocatorService = class LocatorService {
    caseModel;
    patientModel;
    specimenModel;
    blockModel;
    slideModel;
    barcodeResolver;
    custody;
    constructor(caseModel, patientModel, specimenModel, blockModel, slideModel, barcodeResolver, custody) {
        this.caseModel = caseModel;
        this.patientModel = patientModel;
        this.specimenModel = specimenModel;
        this.blockModel = blockModel;
        this.slideModel = slideModel;
        this.barcodeResolver = barcodeResolver;
        this.custody = custody;
    }
    async locate(rawBarcode) {
        const match = await this.barcodeResolver.resolve(rawBarcode);
        if (!match) {
            throw new common_1.NotFoundException(`No specimen, block or slide matches barcode ${rawBarcode.toUpperCase()}.`);
        }
        const entity = match.entity;
        const caseDoc = await this.caseModel.findById(entity.caseId).exec();
        if (!caseDoc)
            throw new common_1.NotFoundException('Case not found for this item.');
        const patient = await this.patientModel.findById(caseDoc.patientId).exec();
        if (!patient)
            throw new common_1.NotFoundException('Patient not found for this case.');
        let specimen = null;
        let block = null;
        let serialized;
        if (match.entityType === 'SPECIMEN') {
            specimen = match.entity;
            serialized = (0, entities_1.toSpecimen)(specimen);
        }
        else if (match.entityType === 'BLOCK') {
            block = match.entity;
            specimen = await this.specimenModel.findById(block.specimenId).exec();
            serialized = (0, histopathology_serializers_1.toBlock)(block);
        }
        else {
            const slide = match.entity;
            block = await this.blockModel.findById(slide.blockId).exec();
            specimen = block ? await this.specimenModel.findById(block.specimenId).exec() : null;
            serialized = (0, histopathology_serializers_1.toSlide)(slide);
        }
        const timeline = await this.custody.forEntity(match.entityType, entity._id.toString());
        const station = entity.currentStation;
        const currentLocation = station !== null
            ? { station, label: shared_1.STATION_LABELS[station] }
            : entity.status === 'ARCHIVED'
                ? { station: null, label: 'Archive' }
                : { station: null, label: shared_1.PHYSICAL_STATE_LABELS[entity.status] };
        return {
            entityType: match.entityType,
            entity: serialized,
            case: {
                id: caseDoc._id.toString(),
                accessionNumber: caseDoc.accessionNumber,
                status: caseDoc.status,
                priority: caseDoc.priority,
                patientName: `${patient.firstName} ${patient.lastName}`,
                patientMrn: patient.mrn,
                tatDeadline: caseDoc.tatDeadline.toISOString(),
            },
            specimen: specimen ? (0, entities_1.toSpecimen)(specimen) : null,
            block: block ? (0, histopathology_serializers_1.toBlock)(block) : null,
            timeline,
            currentLocation,
        };
    }
    async caseTimeline(caseId) {
        const caseDoc = await this.caseModel.findById(caseId).exec();
        if (!caseDoc)
            throw new common_1.NotFoundException('Case not found.');
        return this.custody.forCase(caseId);
    }
    async entityTimeline(entityType, entityId) {
        const allowed = ['SPECIMEN', 'BLOCK', 'SLIDE'];
        if (!allowed.includes(entityType)) {
            throw new common_1.NotFoundException('Unknown custody entity type.');
        }
        const events = await this.custody.forEntity(entityType, entityId);
        if (events.length === 0)
            throw new common_1.NotFoundException('No custody history for this item.');
        return events;
    }
};
exports.LocatorService = LocatorService;
exports.LocatorService = LocatorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(1, (0, mongoose_1.InjectModel)(patient_schema_1.PatientModelName)),
    __param(2, (0, mongoose_1.InjectModel)(specimen_schema_1.SpecimenModelName)),
    __param(3, (0, mongoose_1.InjectModel)(block_schema_1.BlockModelName)),
    __param(4, (0, mongoose_1.InjectModel)(slide_schema_1.SlideModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        barcode_resolver_service_1.BarcodeResolverService,
        custody_service_1.CustodyService])
], LocatorService);
void entities_1.toCustodyEvent;
//# sourceMappingURL=locator.service.js.map