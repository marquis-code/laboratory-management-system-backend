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
exports.HistopathologyLabelArtifactsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const label_artifacts_1 = require("../../core/labels/label-artifacts");
const block_schema_1 = require("./blocks/block.schema");
const slide_schema_1 = require("./slides/slide.schema");
const specimen_schema_1 = require("../../core/specimens/specimen.schema");
let HistopathologyLabelArtifactsService = class HistopathologyLabelArtifactsService {
    blockModel;
    slideModel;
    specimenModel;
    registry;
    constructor(blockModel, slideModel, specimenModel, registry) {
        this.blockModel = blockModel;
        this.slideModel = slideModel;
        this.specimenModel = specimenModel;
        this.registry = registry;
    }
    onModuleInit() {
        this.registry.register({
            discipline: 'HISTOPATHOLOGY',
            entity: (type, id) => this.entity(type, id),
            forCase: (caseId) => this.forCase(caseId),
        });
    }
    async entity(type, id) {
        if (type === 'BLOCK') {
            const block = await this.blockModel.findById(id).exec();
            if (!block)
                return null;
            const specimen = await this.specimenModel.findById(block.specimenId).exec();
            return {
                kind: 'BLOCK',
                caseId: block.caseId.toString(),
                barcode: block.barcode,
                label: block.label,
                detail: specimen ? `${specimen.specimenType} · ${specimen.site}` : 'Block',
                date: block.createdAt,
            };
        }
        const slide = await this.slideModel.findById(id).exec();
        if (!slide)
            return null;
        return this.slideArtifact(slide);
    }
    async forCase(caseId) {
        const [blocks, slides] = await Promise.all([
            this.blockModel.find({ caseId }).sort({ specimenSequence: 1, blockNumber: 1 }).exec(),
            this.slideModel.find({ caseId }).sort({ blockLabel: 1, slideNumber: 1 }).exec(),
        ]);
        const artifacts = [];
        for (const block of blocks) {
            const specimen = await this.specimenModel.findById(block.specimenId).exec();
            artifacts.push({
                kind: 'BLOCK',
                caseId: block.caseId.toString(),
                barcode: block.barcode,
                label: block.label,
                detail: specimen ? `${specimen.specimenType} · ${specimen.site}` : 'Block',
                date: block.createdAt,
            });
        }
        for (const slide of slides)
            artifacts.push(await this.slideArtifact(slide));
        return artifacts;
    }
    async slideArtifact(slide) {
        const specimen = await this.specimenModel.findById(slide.specimenId).exec();
        const stain = slide.specialStain
            ? `${shared_1.STAIN_TYPE_LABELS[slide.stainType]} · ${slide.specialStain}`
            : shared_1.STAIN_TYPE_LABELS[slide.stainType];
        return {
            kind: 'SLIDE',
            caseId: slide.caseId.toString(),
            barcode: slide.barcode,
            label: slide.label,
            detail: specimen ? `${specimen.specimenType} · ${stain}` : stain,
            date: slide.createdAt,
        };
    }
};
exports.HistopathologyLabelArtifactsService = HistopathologyLabelArtifactsService;
exports.HistopathologyLabelArtifactsService = HistopathologyLabelArtifactsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(block_schema_1.BlockModelName)),
    __param(1, (0, mongoose_1.InjectModel)(slide_schema_1.SlideModelName)),
    __param(2, (0, mongoose_1.InjectModel)(specimen_schema_1.SpecimenModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        label_artifacts_1.LabelArtifactRegistry])
], HistopathologyLabelArtifactsService);
//# sourceMappingURL=label-artifacts.service.js.map