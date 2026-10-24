"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBlock = toBlock;
exports.toSlide = toSlide;
exports.ToSlide = toSlide;
exports.toProtocol = toProtocol;
const shared_1 = require("@lims/shared");
const format_1 = require("../../common/utils/format");
const entities_1 = require("../../common/serializers/entities");
function toBlock(block) {
    return {
        id: block._id.toString(),
        caseId: block.caseId.toString(),
        specimenId: block.specimenId.toString(),
        specimenLabel: (0, shared_1.specimenLetter)(block.specimenSequence),
        blockNumber: block.blockNumber,
        label: block.label,
        barcode: block.barcode,
        grossDescription: block.grossDescription,
        status: block.status,
        currentStation: block.currentStation,
        slideCount: block.slideCount,
        lastEventAt: (0, format_1.toIso)(block.lastEventAt),
        createdAt: (0, format_1.toIso)(block.createdAt) ?? new Date().toISOString(),
    };
}
function toSlide(slide) {
    return {
        id: slide._id.toString(),
        caseId: slide.caseId.toString(),
        specimenId: slide.specimenId.toString(),
        blockId: slide.blockId.toString(),
        blockLabel: slide.blockLabel,
        slideNumber: slide.slideNumber,
        label: slide.label,
        barcode: slide.barcode,
        stainType: slide.stainType,
        specialStain: slide.specialStain,
        status: slide.status,
        currentStation: slide.currentStation,
        recutOfSlideId: slide.recutOfSlideId ? slide.recutOfSlideId.toString() : null,
        requestReason: slide.requestReason,
        notes: slide.notes,
        stainRunId: slide.stainRunId ? slide.stainRunId.toString() : null,
        wsi: (0, entities_1.toWsiInfo)(slide),
        lastEventAt: (0, format_1.toIso)(slide.lastEventAt),
        createdAt: (0, format_1.toIso)(slide.createdAt) ?? new Date().toISOString(),
    };
}
function toProtocol(protocol) {
    return {
        id: protocol._id.toString(),
        key: protocol.key,
        title: protocol.title,
        cancerType: protocol.cancerType,
        subspecialty: protocol.subspecialty,
        version: protocol.version,
        active: protocol.active,
        content: protocol.content,
        createdAt: (0, format_1.toIso)(protocol.createdAt) ?? new Date().toISOString(),
        updatedAt: (0, format_1.toIso)(protocol.updatedAt) ?? new Date().toISOString(),
    };
}
//# sourceMappingURL=histopathology.serializers.js.map