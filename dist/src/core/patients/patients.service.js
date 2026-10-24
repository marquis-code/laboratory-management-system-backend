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
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const format_1 = require("../../common/utils/format");
const transaction_1 = require("../../common/utils/transaction");
const entities_1 = require("../../common/serializers/entities");
const audit_service_1 = require("../audit/audit.service");
const labs_service_1 = require("../labs/labs.service");
const patient_schema_1 = require("./patient.schema");
let PatientsService = class PatientsService {
    patientModel;
    connection;
    labsService;
    audit;
    constructor(patientModel, connection, labsService, audit) {
        this.patientModel = patientModel;
        this.connection = connection;
        this.labsService = labsService;
        this.audit = audit;
    }
    async list(query) {
        const filter = {};
        if (query.q) {
            const regex = new RegExp((0, format_1.escapeRegex)(query.q), 'i');
            filter.$or = [{ mrn: regex }, { firstName: regex }, { lastName: regex }, { phone: regex }];
        }
        const [patients, total] = await Promise.all([
            this.patientModel
                .find(filter)
                .sort({ lastName: 1, firstName: 1 })
                .skip((query.page - 1) * query.limit)
                .limit(query.limit)
                .exec(),
            this.patientModel.countDocuments(filter).exec(),
        ]);
        return (0, format_1.buildPaginated)(patients.map(entities_1.toPatient), total, query.page, query.limit);
    }
    async get(id) {
        const patient = await this.patientModel.findById(id).exec();
        if (!patient)
            throw new common_1.NotFoundException('Patient not found.');
        return (0, entities_1.toPatient)(patient);
    }
    async create(dto, actor) {
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const patient = await this.createInSession(dto, actor, session, false);
            return (0, entities_1.toPatient)(patient);
        });
    }
    /**
     * Used by accessioning. If an MRN is supplied and already exists, that patient
     * is reused (and demographics refreshed) rather than duplicated.
     */
    async resolveForAccession(dto, actor, session) {
        if (dto.mrn) {
            const existing = await this.patientModel
                .findOne({ mrn: dto.mrn.trim().toUpperCase() })
                .session(session)
                .exec();
            if (existing) {
                this.applyDemographics(existing, dto);
                await existing.save({ session });
                return existing;
            }
        }
        return this.createInSession(dto, actor, session, true);
    }
    async update(id, dto, actor) {
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const patient = await this.patientModel.findById(id).session(session).exec();
            if (!patient)
                throw new common_1.NotFoundException('Patient not found.');
            const before = (0, entities_1.toPatient)(patient);
            this.applyDemographics(patient, dto);
            await patient.save({ session });
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'Patient',
                entityId: patient._id.toString(),
                before,
                after: (0, entities_1.toPatient)(patient),
                metadata: { actor: actor.email },
            }, session);
            return (0, entities_1.toPatient)(patient);
        });
    }
    async createInSession(dto, actor, session, allowExisting) {
        let mrn = dto.mrn?.trim().toUpperCase();
        if (mrn) {
            const duplicate = await this.patientModel.findOne({ mrn }).session(session).exec();
            if (duplicate) {
                if (allowExisting)
                    return duplicate;
                throw new common_1.ConflictException('A patient with this MRN already exists.');
            }
        }
        else {
            mrn = await this.labsService.allocateMrn(actor.labId, session);
        }
        const patient = new this.patientModel({
            mrn,
            firstName: dto.firstName.trim(),
            lastName: dto.lastName.trim(),
            sex: dto.sex,
            dateOfBirth: dto.dateOfBirth ? (0, format_1.parseDateOnly)(dto.dateOfBirth) : null,
            age: dto.age ?? this.ageFromDate(dto.dateOfBirth),
            phone: dto.phone?.trim() || null,
            email: dto.email?.trim().toLowerCase() || null,
            address: dto.address?.trim() || null,
            nationalId: dto.nationalId?.trim() || null,
            nextOfKin: this.mapNextOfKin(dto.nextOfKin),
            createdBy: new mongoose_2.Types.ObjectId(actor.id),
        });
        await patient.save({ session });
        await this.audit.record({
            action: 'CREATE',
            entityType: 'Patient',
            entityId: patient._id.toString(),
            after: (0, entities_1.toPatient)(patient),
            metadata: { mrn: patient.mrn },
        }, session);
        return patient;
    }
    applyDemographics(patient, dto) {
        if (dto.firstName !== undefined)
            patient.firstName = dto.firstName.trim();
        if (dto.lastName !== undefined)
            patient.lastName = dto.lastName.trim();
        if (dto.sex !== undefined)
            patient.sex = dto.sex;
        if (dto.dateOfBirth !== undefined) {
            patient.dateOfBirth = (0, format_1.parseDateOnly)(dto.dateOfBirth);
            if (dto.age === undefined)
                patient.age = this.ageFromDate(dto.dateOfBirth);
        }
        if (dto.age !== undefined)
            patient.age = dto.age;
        if (dto.phone !== undefined)
            patient.phone = dto.phone.trim() || null;
        if (dto.email !== undefined)
            patient.email = dto.email.trim().toLowerCase() || null;
        if (dto.address !== undefined)
            patient.address = dto.address.trim() || null;
        if (dto.nationalId !== undefined)
            patient.nationalId = dto.nationalId.trim() || null;
        if (dto.nextOfKin !== undefined)
            patient.nextOfKin = this.mapNextOfKin(dto.nextOfKin);
    }
    mapNextOfKin(input) {
        if (!input)
            return null;
        const kin = {
            name: input.name?.trim() || null,
            phone: input.phone?.trim() || null,
            relationship: input.relationship?.trim() || null,
        };
        return kin.name || kin.phone ? kin : null;
    }
    ageFromDate(dateOfBirth) {
        if (!dateOfBirth)
            return null;
        const dob = (0, format_1.parseDateOnly)(dateOfBirth);
        if (!dob)
            return null;
        const diff = Date.now() - dob.getTime();
        return Math.max(0, Math.floor(diff / (365.25 * 86_400_000)));
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(patient_schema_1.PatientModelName)),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model, Function, labs_service_1.LabsService,
        audit_service_1.AuditService])
], PatientsService);
//# sourceMappingURL=patients.service.js.map