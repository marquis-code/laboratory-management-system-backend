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
exports.SpecimensService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const actor_1 = require("../../common/utils/actor");
const format_1 = require("../../common/utils/format");
const transaction_1 = require("../../common/utils/transaction");
const entities_1 = require("../../common/serializers/entities");
const audit_service_1 = require("../audit/audit.service");
const case_schema_1 = require("../cases/case.schema");
const custody_service_1 = require("../custody/custody.service");
const specimen_schema_1 = require("./specimen.schema");
let SpecimensService = class SpecimensService {
    connection;
    specimenModel;
    caseModel;
    custody;
    audit;
    constructor(connection, specimenModel, caseModel, custody, audit) {
        this.connection = connection;
        this.specimenModel = specimenModel;
        this.caseModel = caseModel;
        this.custody = custody;
        this.audit = audit;
    }
    async list(query) {
        const filter = {};
        if (query.caseId)
            filter.caseId = new mongoose_2.Types.ObjectId(query.caseId);
        const [specimens, total] = await Promise.all([
            this.specimenModel
                .find(filter)
                .sort({ receivedAt: -1, sequence: 1 })
                .skip((query.page - 1) * query.limit)
                .limit(query.limit)
                .exec(),
            this.specimenModel.countDocuments(filter).exec(),
        ]);
        return (0, format_1.buildPaginated)(specimens.map(entities_1.toSpecimen), total, query.page, query.limit);
    }
    async reject(id, reason, reasonCode = 'OTHER') {
        const actor = (0, actor_1.currentActor)();
        const specimen = await (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const current = await this.specimenModel.findById(id).session(session).exec();
            if (!current)
                throw new common_1.NotFoundException('Specimen not found.');
            const check = (0, shared_1.checkTransition)('SPECIMEN', current.status, 'REJECTED');
            if (!check.ok)
                throw new common_1.ConflictException(check.reason ?? 'Specimen cannot be rejected.');
            const caseDoc = await this.caseModel.findById(current.caseId).session(session).exec();
            if (!caseDoc)
                throw new common_1.NotFoundException('Case not found.');
            const before = (0, entities_1.toSpecimen)(current);
            current.status = 'REJECTED';
            current.rejectionReason = reason;
            current.rejectionCode = reasonCode;
            await current.save({ session });
            await this.custody.append({
                entityType: 'SPECIMEN',
                entityId: current._id,
                caseId: current.caseId,
                eventType: 'REJECTED',
                station: null,
                fromState: before.status,
                toState: 'REJECTED',
                reason,
                barcode: current.barcode,
                metadata: {
                    label: current.label,
                    ...(current.rejectionReason ? { rejectionReason: current.rejectionReason } : {}),
                },
            }, actor, session);
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'Specimen',
                entityId: current._id.toString(),
                caseId: caseDoc._id.toString(),
                before,
                after: (0, entities_1.toSpecimen)(current),
                metadata: { reason, reasonCode },
            }, session);
            return current;
        });
        return (0, entities_1.toSpecimen)(specimen);
    }
};
exports.SpecimensService = SpecimensService;
exports.SpecimensService = SpecimensService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(1, (0, mongoose_1.InjectModel)(specimen_schema_1.SpecimenModelName)),
    __param(2, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __metadata("design:paramtypes", [Function, mongoose_2.Model,
        mongoose_2.Model,
        custody_service_1.CustodyService,
        audit_service_1.AuditService])
], SpecimensService);
//# sourceMappingURL=specimens.service.js.map