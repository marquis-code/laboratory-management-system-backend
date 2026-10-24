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
exports.LabsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const transaction_1 = require("../../common/utils/transaction");
const entities_1 = require("../../common/serializers/entities");
const audit_service_1 = require("../audit/audit.service");
const lab_schema_1 = require("./lab.schema");
let LabsService = class LabsService {
    labModel;
    connection;
    audit;
    constructor(labModel, connection, audit) {
        this.labModel = labModel;
        this.connection = connection;
        this.audit = audit;
    }
    async getById(labId) {
        const lab = await this.labModel.findById(labId).exec();
        if (!lab)
            throw new common_1.NotFoundException('Laboratory not found.');
        return (0, entities_1.toLab)(lab);
    }
    /**
     * Atomically increments a per-lab counter. Used for accession numbers and
     * medical record numbers so concurrent reception desks cannot collide.
     */
    async nextSequence(labId, key, session) {
        const path = `accessionCounters.${key}`;
        const increment = { [path]: 1 };
        const lab = await this.labModel
            .findOneAndUpdate({ _id: labId }, { $inc: increment }, { new: true, session })
            .exec();
        if (!lab)
            throw new common_1.NotFoundException('Laboratory not found.');
        return lab.accessionCounters.get(key) ?? 1;
    }
    async allocateAccession(labId, session, discipline = 'HISTOPATHOLOGY') {
        const lab = await this.labModel.findById(labId).session(session).exec();
        if (!lab)
            throw new common_1.NotFoundException('Laboratory not found.');
        const enabled = lab.enabledDisciplines ?? ['HISTOPATHOLOGY'];
        if (!enabled.includes(discipline)) {
            throw new common_1.BadRequestException(`${discipline.replace('_', ' ').toLowerCase()} is not enabled for this laboratory.`);
        }
        const year = new Date().getUTCFullYear();
        const counterKey = discipline === 'HISTOPATHOLOGY' ? String(year) : `${discipline.toLowerCase()}-${year}`;
        const sequence = await this.nextSequence(labId, counterKey, session);
        const prefix = lab.accessionPrefixes?.[discipline] ??
            (discipline === 'HISTOPATHOLOGY'
                ? lab.accessionPrefix
                : shared_1.DISCIPLINE_ACCESSION_PREFIXES[discipline]);
        const accessionNumber = (0, shared_1.formatAccession)(lab.accessionFormat, {
            prefix,
            year,
            sequence,
        });
        return { accessionNumber, lab };
    }
    async allocateMrn(labId, session) {
        const year = new Date().getUTCFullYear();
        const sequence = await this.nextSequence(labId, `mrn-${year}`, session);
        return (0, shared_1.formatMrn)(year, sequence);
    }
    async update(labId, dto) {
        if (dto.accessionFormat) {
            const problem = (0, shared_1.validateAccessionFormat)(dto.accessionFormat);
            if (problem)
                throw new common_1.BadRequestException(problem);
        }
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const lab = await this.labModel.findById(labId).session(session).exec();
            if (!lab)
                throw new common_1.NotFoundException('Laboratory not found.');
            const before = (0, entities_1.toLab)(lab);
            if (dto.name !== undefined)
                lab.name = dto.name.trim();
            if (dto.address !== undefined)
                lab.address = dto.address.trim() || null;
            if (dto.phone !== undefined)
                lab.phone = dto.phone.trim() || null;
            if (dto.email !== undefined)
                lab.email = dto.email.trim() || null;
            if (dto.accessionPrefix !== undefined) {
                lab.accessionPrefix = dto.accessionPrefix.toUpperCase();
            }
            if (dto.accessionFormat !== undefined)
                lab.accessionFormat = dto.accessionFormat;
            if (dto.tatWarningPercent !== undefined)
                lab.tatWarningPercent = dto.tatWarningPercent;
            if (dto.timezone !== undefined)
                lab.timezone = dto.timezone;
            if (dto.qaSamplingPercent !== undefined)
                lab.qaSamplingPercent = dto.qaSamplingPercent;
            if (dto.currency !== undefined)
                lab.currency = dto.currency.toUpperCase();
            if (dto.enabledDisciplines !== undefined)
                lab.enabledDisciplines = dto.enabledDisciplines;
            if (dto.accessionPrefixes !== undefined) {
                lab.accessionPrefixes = Object.fromEntries(Object.entries(dto.accessionPrefixes)
                    .map(([discipline, prefix]) => [discipline, prefix.trim().toUpperCase()])
                    .filter(([, prefix]) => Boolean(prefix)));
            }
            if (dto.tatHours) {
                lab.tatHours = {
                    FROZEN: dto.tatHours.FROZEN ?? lab.tatHours.FROZEN,
                    URGENT: dto.tatHours.URGENT ?? lab.tatHours.URGENT,
                    ROUTINE: dto.tatHours.ROUTINE ?? lab.tatHours.ROUTINE,
                };
            }
            if (dto.letterhead) {
                lab.letterhead = this.mergeLetterhead(lab.letterhead, dto.letterhead);
            }
            await lab.save({ session });
            const after = (0, entities_1.toLab)(lab);
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'Lab',
                entityId: lab._id.toString(),
                before,
                after,
                metadata: { fields: Object.keys(dto) },
            }, session);
            return after;
        });
    }
    mergeLetterhead(current, patch) {
        const merged = {
            phone: current?.phone ?? null,
            email: current?.email ?? null,
            website: current?.website ?? null,
            pathologistName: current?.pathologistName ?? null,
            pathologistTitle: current?.pathologistTitle ?? null,
            qualifications: current?.qualifications ?? null,
            signatureText: current?.signatureText ?? null,
            footerNote: current?.footerNote ?? null,
        };
        for (const key of Object.keys(patch)) {
            const value = patch[key];
            if (value !== undefined) {
                merged[key] = value.trim() || null;
            }
        }
        return merged;
    }
};
exports.LabsService = LabsService;
exports.LabsService = LabsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(lab_schema_1.LabModelName)),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model, Function, audit_service_1.AuditService])
], LabsService);
//# sourceMappingURL=labs.service.js.map