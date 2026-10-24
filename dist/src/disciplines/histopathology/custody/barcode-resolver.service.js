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
exports.BarcodeResolverService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const block_schema_1 = require("../blocks/block.schema");
const slide_schema_1 = require("../slides/slide.schema");
const specimen_schema_1 = require("../../../core/specimens/specimen.schema");
let BarcodeResolverService = class BarcodeResolverService {
    specimenModel;
    blockModel;
    slideModel;
    constructor(specimenModel, blockModel, slideModel) {
        this.specimenModel = specimenModel;
        this.blockModel = blockModel;
        this.slideModel = slideModel;
    }
    async resolve(rawBarcode, session) {
        const barcode = (0, shared_1.normalizeBarcode)(rawBarcode);
        if (!barcode)
            return null;
        if (barcode.startsWith('SP-')) {
            const entity = await this.specimenModel
                .findOne({ barcode })
                .session(session ?? null)
                .exec();
            return entity ? { entityType: 'SPECIMEN', entity } : null;
        }
        if (barcode.startsWith('BL-')) {
            const entity = await this.blockModel
                .findOne({ barcode })
                .session(session ?? null)
                .exec();
            return entity ? { entityType: 'BLOCK', entity } : null;
        }
        if (barcode.startsWith('SL-')) {
            const entity = await this.slideModel
                .findOne({ barcode })
                .session(session ?? null)
                .exec();
            return entity ? { entityType: 'SLIDE', entity } : null;
        }
        // Manual entry or a non-standard label: search all three collections.
        const specimen = await this.specimenModel
            .findOne({ barcode })
            .session(session ?? null)
            .exec();
        if (specimen)
            return { entityType: 'SPECIMEN', entity: specimen };
        const block = await this.blockModel
            .findOne({ barcode })
            .session(session ?? null)
            .exec();
        if (block)
            return { entityType: 'BLOCK', entity: block };
        const slide = await this.slideModel
            .findOne({ barcode })
            .session(session ?? null)
            .exec();
        if (slide)
            return { entityType: 'SLIDE', entity: slide };
        return null;
    }
};
exports.BarcodeResolverService = BarcodeResolverService;
exports.BarcodeResolverService = BarcodeResolverService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(specimen_schema_1.SpecimenModelName)),
    __param(1, (0, mongoose_1.InjectModel)(block_schema_1.BlockModelName)),
    __param(2, (0, mongoose_1.InjectModel)(slide_schema_1.SlideModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], BarcodeResolverService);
//# sourceMappingURL=barcode-resolver.service.js.map