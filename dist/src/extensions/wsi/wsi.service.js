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
exports.WsiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const node_crypto_1 = require("node:crypto");
const tenant_context_1 = require("../../common/context/tenant-context");
const audit_service_1 = require("../../core/audit/audit.service");
const case_schema_1 = require("../../core/cases/case.schema");
const lab_schema_1 = require("../../core/labs/lab.schema");
const histopathology_serializers_1 = require("../../disciplines/histopathology/histopathology.serializers");
const slide_schema_1 = require("../../disciplines/histopathology/slides/slide.schema");
let WsiService = class WsiService {
    slideModel;
    caseModel;
    labModel;
    audit;
    config;
    constructor(slideModel, caseModel, labModel, audit, config) {
        this.slideModel = slideModel;
        this.caseModel = caseModel;
        this.labModel = labModel;
        this.audit = audit;
        this.config = config;
    }
    async link(slideId, dto, user) {
        const slide = await this.slideModel.findById(slideId).exec();
        if (!slide)
            throw new common_1.NotFoundException('Slide not found.');
        const now = new Date();
        slide.wsiStatus = 'LINKED';
        slide.wsiUrl = dto.url;
        slide.wsiViewerUrl = dto.viewerUrl ?? dto.url;
        slide.wsiScanner = dto.scanner?.trim() || null;
        slide.wsiMagnification = dto.magnification?.trim() || null;
        slide.wsiAddedAt = now;
        slide.wsiAddedBy = new mongoose_2.Types.ObjectId(user.id);
        slide.wsiMetadata = dto.notes ? { notes: dto.notes.trim() } : {};
        await slide.save();
        await this.audit.record({
            action: 'UPDATE',
            entityType: 'Slide',
            entityId: slide._id.toString(),
            caseId: slide.caseId.toString(),
            after: { wsiStatus: slide.wsiStatus, url: slide.wsiUrl },
            metadata: { event: 'wsi-linked' },
        });
        return { slide: (0, histopathology_serializers_1.ToSlide)(slide), wsi: toWsi(slide) };
    }
    async byBarcode(barcode) {
        const slide = await this.slideModel.findOne({ barcode: barcode.trim().toUpperCase() }).exec();
        if (!slide)
            throw new common_1.NotFoundException('Slide not found.');
        const caseDoc = await this.caseModel.findById(slide.caseId).exec();
        return {
            slide: (0, histopathology_serializers_1.ToSlide)(slide),
            wsi: toWsi(slide),
            accessionNumber: caseDoc?.accessionNumber ?? null,
        };
    }
    async webhook(dto, signature) {
        const secret = this.config.get('WSI_WEBHOOK_SECRET');
        if (!secret) {
            throw new common_1.ForbiddenException('WSI webhooks are not configured for this deployment.');
        }
        const expected = (0, node_crypto_1.createHmac)('sha256', secret).update(JSON.stringify(dto)).digest('hex');
        if (!signature || !safeEqual(signature, expected)) {
            throw new common_1.ForbiddenException('Invalid WSI webhook signature.');
        }
        const lab = dto.labCode
            ? await this.labModel.findOne({ code: dto.labCode.toUpperCase(), active: true }).exec()
            : null;
        if (!lab)
            throw new common_1.BadRequestException('A valid labCode is required on the WSI webhook.');
        return (0, tenant_context_1.runWithTenant)({ labId: lab._id.toString() }, async () => {
            const slide = await this.slideModel
                .findOne({ barcode: dto.barcode.trim().toUpperCase() })
                .exec();
            if (!slide)
                throw new common_1.NotFoundException('Slide barcode does not exist in this laboratory.');
            slide.wsiStatus = dto.status ?? 'LINKED';
            slide.wsiUrl = dto.url;
            slide.wsiViewerUrl = dto.url;
            slide.wsiScanner = dto.scanner?.trim() || null;
            slide.wsiAddedAt = new Date();
            slide.wsiMetadata = dto.metadata ?? {};
            await slide.save();
            await this.audit.record({
                action: 'WEBHOOK',
                entityType: 'Slide',
                entityId: slide._id.toString(),
                caseId: slide.caseId.toString(),
                after: { wsiStatus: slide.wsiStatus, url: slide.wsiUrl },
                metadata: { source: 'wsi-scanner' },
            });
            return { slide: (0, histopathology_serializers_1.ToSlide)(slide), wsi: toWsi(slide) };
        });
    }
};
exports.WsiService = WsiService;
exports.WsiService = WsiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(slide_schema_1.SlideModelName)),
    __param(1, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(2, (0, mongoose_1.InjectModel)(lab_schema_1.LabModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        audit_service_1.AuditService,
        config_1.ConfigService])
], WsiService);
function toWsi(slide) {
    if (!slide.wsiStatus)
        return null;
    return {
        status: slide.wsiStatus,
        url: slide.wsiUrl ?? null,
        viewerUrl: slide.wsiViewerUrl ?? null,
        scanner: slide.wsiScanner ?? null,
        magnification: slide.wsiMagnification ?? null,
        addedAt: slide.wsiAddedAt ? slide.wsiAddedAt.toISOString() : null,
        addedBy: slide.wsiAddedBy ? slide.wsiAddedBy.toString() : null,
        metadata: slide.wsiMetadata ?? {},
    };
}
function safeEqual(left, right) {
    const a = Buffer.from(left, 'utf8');
    const b = Buffer.from(right, 'utf8');
    return a.length === b.length && (0, node_crypto_1.timingSafeEqual)(a, b);
}
//# sourceMappingURL=wsi.service.js.map