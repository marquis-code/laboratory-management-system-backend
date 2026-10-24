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
exports.HistopathologyCaseArtifactsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const histopathology_serializers_1 = require("./histopathology.serializers");
const case_artifacts_1 = require("../../core/cases/case-artifacts");
const block_schema_1 = require("./blocks/block.schema");
const slide_schema_1 = require("./slides/slide.schema");
let HistopathologyCaseArtifactsService = class HistopathologyCaseArtifactsService {
    blockModel;
    slideModel;
    registry;
    constructor(blockModel, slideModel, registry) {
        this.blockModel = blockModel;
        this.slideModel = slideModel;
        this.registry = registry;
    }
    onModuleInit() {
        this.registry.register({
            discipline: 'HISTOPATHOLOGY',
            load: (caseId) => this.load(caseId),
            metrics: (caseIds) => this.metrics(caseIds),
        });
    }
    async load(caseId) {
        const [blocks, slides] = await Promise.all([
            this.blockModel.find({ caseId }).sort({ specimenSequence: 1, blockNumber: 1 }).exec(),
            this.slideModel.find({ caseId }).sort({ blockLabel: 1, slideNumber: 1 }).exec(),
        ]);
        return { blocks: blocks.map(histopathology_serializers_1.toBlock), slides: slides.map(histopathology_serializers_1.toSlide) };
    }
    async metrics(caseIds) {
        const counts = new Map();
        if (caseIds.length === 0)
            return counts;
        const slides = await this.slideModel
            .find({ caseId: { $in: caseIds } })
            .select('caseId status')
            .exec();
        for (const slide of slides) {
            const key = slide.caseId.toString();
            const entry = counts.get(key) ?? { total: 0, pending: 0, stained: 0 };
            entry.total += 1;
            if (slide.status === 'WITH_PATHOLOGIST' || slide.status === 'RECUT_REQUESTED') {
                entry.pending += 1;
            }
            if (slide.status === 'STAINED')
                entry.stained += 1;
            counts.set(key, entry);
        }
        return counts;
    }
};
exports.HistopathologyCaseArtifactsService = HistopathologyCaseArtifactsService;
exports.HistopathologyCaseArtifactsService = HistopathologyCaseArtifactsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(block_schema_1.BlockModelName)),
    __param(1, (0, mongoose_1.InjectModel)(slide_schema_1.SlideModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        case_artifacts_1.CaseArtifactRegistry])
], HistopathologyCaseArtifactsService);
//# sourceMappingURL=case-artifacts.service.js.map