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
exports.QualityService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const crypto_1 = require("../../common/utils/crypto");
const audit_service_1 = require("../audit/audit.service");
const case_schema_1 = require("../cases/case.schema");
const test_requests_service_1 = require("../test-requests/test-requests.service");
const test_request_schema_1 = require("../test-requests/test-request.schema");
const user_schema_1 = require("../users/user.schema");
const quality_schema_1 = require("./quality.schema");
let QualityService = class QualityService {
    equipmentModel;
    temperatureModel;
    ncModel;
    capaModel;
    sendOutModel;
    requestModel;
    caseModel;
    userModel;
    testRequests;
    audit;
    constructor(equipmentModel, temperatureModel, ncModel, capaModel, sendOutModel, requestModel, caseModel, userModel, testRequests, audit) {
        this.equipmentModel = equipmentModel;
        this.temperatureModel = temperatureModel;
        this.ncModel = ncModel;
        this.capaModel = capaModel;
        this.sendOutModel = sendOutModel;
        this.requestModel = requestModel;
        this.caseModel = caseModel;
        this.userModel = userModel;
        this.testRequests = testRequests;
        this.audit = audit;
    }
    async equipment() {
        const rows = await this.equipmentModel.find({}).sort({ name: 1 }).exec();
        return rows.map((row) => this.toEquipment(row));
    }
    async createEquipment(body, actor) {
        const parsed = shared_1.equipmentSchema.safeParse(body);
        if (!parsed.success)
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        const row = await this.equipmentModel.create({
            ...parsed.data,
            code: parsed.data.code.toUpperCase(),
            serialNumber: parsed.data.serialNumber ?? null,
            location: parsed.data.location ?? null,
            lastCalibrationAt: parsed.data.lastCalibrationAt
                ? new Date(parsed.data.lastCalibrationAt)
                : null,
            nextCalibrationAt: parsed.data.nextCalibrationAt
                ? new Date(parsed.data.nextCalibrationAt)
                : null,
            status: parsed.data.status ?? 'ACTIVE',
            active: parsed.data.active ?? true,
        });
        await this.audit.record({
            action: 'CREATE',
            entityType: 'Equipment',
            entityId: row._id.toString(),
            after: this.toEquipment(row),
            metadata: { actor: actor.userName },
        });
        return this.toEquipment(row);
    }
    async temperatureLogs(equipmentId) {
        const filter = {};
        if (equipmentId)
            filter.equipmentId = new mongoose_2.Types.ObjectId(equipmentId);
        const rows = await this.temperatureModel.find(filter).sort({ createdAt: -1 }).limit(100).exec();
        return Promise.all(rows.map((row) => this.toTemperature(row)));
    }
    async recordTemperature(equipmentId, body, actor) {
        const parsed = shared_1.temperatureLogSchema.safeParse(body);
        if (!parsed.success)
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        const equipment = await this.equipmentModel.findById(equipmentId).exec();
        if (!equipment)
            throw new common_1.NotFoundException('Equipment not found.');
        const min = parsed.data.minAllowed ?? null;
        const max = parsed.data.maxAllowed ?? null;
        const inRange = (min === null || parsed.data.temperature >= min) &&
            (max === null || parsed.data.temperature <= max);
        const row = await this.temperatureModel.create({
            equipmentId: equipment._id,
            temperature: parsed.data.temperature,
            unit: parsed.data.unit,
            minAllowed: min,
            maxAllowed: max,
            inRange,
            recordedBy: actor.userId ? new mongoose_2.Types.ObjectId(actor.userId) : null,
            notes: parsed.data.notes ?? null,
        });
        await this.audit.record({
            action: 'CREATE',
            entityType: 'TemperatureLog',
            entityId: row._id.toString(),
            after: { equipment: equipment.code, temperature: row.temperature, inRange },
            metadata: { actor: actor.userName },
        });
        return this.toTemperature(row);
    }
    async nonConformances() {
        const rows = await this.ncModel.find({}).sort({ createdAt: -1 }).limit(100).exec();
        return Promise.all(rows.map((row) => this.toNonConformance(row)));
    }
    async createNonConformance(body, actor) {
        const parsed = shared_1.nonConformanceSchema.safeParse(body);
        if (!parsed.success)
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        const row = await this.ncModel.create({
            code: (0, crypto_1.makeBarcode)('NC'),
            title: parsed.data.title,
            description: parsed.data.description,
            category: parsed.data.category,
            severity: parsed.data.severity,
            status: 'OPEN',
            reportedBy: actor.userId ? new mongoose_2.Types.ObjectId(actor.userId) : null,
            assignedTo: parsed.data.assignedToId ? new mongoose_2.Types.ObjectId(parsed.data.assignedToId) : null,
            dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
            rootCause: null,
        });
        await this.audit.record({
            action: 'CREATE',
            entityType: 'NonConformance',
            entityId: row._id.toString(),
            after: this.toNonConformance(row),
            metadata: { actor: actor.userName, severity: row.severity },
        });
        return this.toNonConformance(row);
    }
    async updateNonConformance(id, body, actor) {
        const parsed = shared_1.nonConformanceUpdateSchema.safeParse(body);
        if (!parsed.success)
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        const row = await this.ncModel.findById(id).exec();
        if (!row)
            throw new common_1.NotFoundException('Non-conformance not found.');
        const before = { status: row.status, severity: row.severity, rootCause: row.rootCause };
        if (parsed.data.status)
            row.status = parsed.data.status;
        if (parsed.data.severity)
            row.severity = parsed.data.severity;
        if (parsed.data.rootCause !== undefined)
            row.rootCause = parsed.data.rootCause ?? null;
        if (parsed.data.assignedToId !== undefined)
            row.assignedTo = parsed.data.assignedToId
                ? new mongoose_2.Types.ObjectId(parsed.data.assignedToId)
                : null;
        await row.save();
        await this.audit.record({
            action: 'UPDATE',
            entityType: 'NonConformance',
            entityId: row._id.toString(),
            before,
            after: { status: row.status, severity: row.severity, rootCause: row.rootCause },
            metadata: { actor: actor.userName },
        });
        return this.toNonConformance(row);
    }
    async addCapa(nonConformanceId, body, actor) {
        const parsed = shared_1.capaSchema.safeParse(body);
        if (!parsed.success)
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        const nc = await this.ncModel.findById(nonConformanceId).exec();
        if (!nc)
            throw new common_1.NotFoundException('Non-conformance not found.');
        const row = await this.capaModel.create({
            nonConformanceId: nc._id,
            action: parsed.data.action,
            owner: parsed.data.owner ?? null,
            dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
            status: parsed.data.status ?? 'OPEN',
            completedAt: null,
        });
        if (nc.status === 'OPEN')
            nc.status = 'CAPA';
        await nc.save();
        await this.audit.record({
            action: 'CREATE',
            entityType: 'CapaAction',
            entityId: row._id.toString(),
            after: { action: row.action, status: row.status },
            metadata: { actor: actor.userName, nonConformance: nc.code },
        });
        return this.toCapa(row);
    }
    async sendOuts() {
        const rows = await this.sendOutModel.find({}).sort({ createdAt: -1 }).limit(100).exec();
        return Promise.all(rows.map((row) => this.toSendOut(row)));
    }
    async createSendOut(body, actor) {
        const parsed = shared_1.sendOutSchema.safeParse(body);
        if (!parsed.success)
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        const request = await this.requestModel.findById(parsed.data.testRequestId).exec();
        if (!request)
            throw new common_1.NotFoundException('Test request not found.');
        const existing = await this.sendOutModel.findOne({ testRequestId: request._id }).exec();
        if (existing)
            throw new common_1.ConflictException('This test request already has a send-out.');
        const row = await this.sendOutModel.create({
            caseId: request.caseId,
            testRequestId: request._id,
            referenceLab: parsed.data.referenceLab,
            reason: parsed.data.reason ?? null,
            courier: parsed.data.courier ?? null,
            trackingNumber: parsed.data.trackingNumber ?? null,
            status: 'SENT',
            sentAt: new Date(),
            receivedAt: null,
            reportedAt: null,
            resultSummary: null,
            createdBy: actor.userId ? new mongoose_2.Types.ObjectId(actor.userId) : null,
        });
        await this.audit.record({
            action: 'CREATE',
            entityType: 'SendOut',
            entityId: row._id.toString(),
            caseId: row.caseId.toString(),
            after: { referenceLab: row.referenceLab, status: row.status },
            metadata: { actor: actor.userName },
        });
        return this.toSendOut(row);
    }
    async updateSendOut(id, body, actor) {
        const parsed = shared_1.sendOutUpdateSchema.safeParse(body);
        if (!parsed.success)
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        const row = await this.sendOutModel.findById(id).exec();
        if (!row)
            throw new common_1.NotFoundException('Send-out not found.');
        const before = row.status;
        if (parsed.data.status) {
            const allowed = {
                SENT: ['IN_TRANSIT', 'RECEIVED', 'CANCELLED'],
                IN_TRANSIT: ['RECEIVED', 'CANCELLED'],
                RECEIVED: ['REPORTED'],
                REPORTED: [],
                CANCELLED: [],
            };
            if (!(allowed[row.status] ?? []).includes(parsed.data.status))
                throw new common_1.ConflictException(`Cannot move send-out from ${row.status} to ${parsed.data.status}.`);
            row.status = parsed.data.status;
            if (row.status === 'RECEIVED')
                row.receivedAt = new Date();
            if (row.status === 'REPORTED')
                row.reportedAt = new Date();
        }
        if (parsed.data.resultSummary !== undefined)
            row.resultSummary = parsed.data.resultSummary ?? null;
        await row.save();
        if (row.status === 'REPORTED')
            await this.testRequests.setStatus(row.testRequestId, 'VERIFIED');
        await this.audit.record({
            action: 'UPDATE',
            entityType: 'SendOut',
            entityId: row._id.toString(),
            caseId: row.caseId.toString(),
            before: { status: before },
            after: { status: row.status },
            metadata: { actor: actor.userName },
        });
        return this.toSendOut(row);
    }
    async toSendOut(row) {
        const [request, caseDoc] = await Promise.all([
            this.requestModel.findById(row.testRequestId).exec(),
            this.caseModel.findById(row.caseId).exec(),
        ]);
        return {
            id: row._id.toString(),
            caseId: row.caseId.toString(),
            accessionNumber: caseDoc?.accessionNumber ?? '—',
            testRequestId: row.testRequestId.toString(),
            testName: request?.name ?? 'Test',
            referenceLab: row.referenceLab,
            reason: row.reason,
            courier: row.courier,
            trackingNumber: row.trackingNumber,
            status: row.status,
            sentAt: row.sentAt?.toISOString() ?? null,
            receivedAt: row.receivedAt?.toISOString() ?? null,
            reportedAt: row.reportedAt?.toISOString() ?? null,
            resultSummary: row.resultSummary,
            createdAt: row.createdAt.toISOString(),
        };
    }
    async toNonConformance(row) {
        const [reportedBy, assignedTo, actions] = await Promise.all([
            row.reportedBy ? this.userModel.findById(row.reportedBy).exec() : null,
            row.assignedTo ? this.userModel.findById(row.assignedTo).exec() : null,
            this.capaModel.find({ nonConformanceId: row._id }).sort({ createdAt: 1 }).exec(),
        ]);
        return {
            id: row._id.toString(),
            code: row.code,
            title: row.title,
            description: row.description,
            category: row.category,
            severity: row.severity,
            status: row.status,
            reportedBy: reportedBy
                ? {
                    id: reportedBy._id.toString(),
                    name: reportedBy.name,
                    email: reportedBy.email,
                    role: reportedBy.role,
                    subspecialties: reportedBy.subspecialties,
                    disciplines: reportedBy.disciplines ?? [],
                }
                : null,
            assignedTo: assignedTo
                ? {
                    id: assignedTo._id.toString(),
                    name: assignedTo.name,
                    email: assignedTo.email,
                    role: assignedTo.role,
                    subspecialties: assignedTo.subspecialties,
                    disciplines: assignedTo.disciplines ?? [],
                }
                : null,
            dueAt: row.dueAt?.toISOString() ?? null,
            rootCause: row.rootCause,
            actions: actions.map((action) => this.toCapa(action)),
            createdAt: row.createdAt.toISOString(),
            updatedAt: row.updatedAt.toISOString(),
        };
    }
    async toTemperature(row) {
        const [equipment, user] = await Promise.all([
            this.equipmentModel.findById(row.equipmentId).exec(),
            row.recordedBy ? this.userModel.findById(row.recordedBy).exec() : null,
        ]);
        return {
            id: row._id.toString(),
            equipmentId: row.equipmentId.toString(),
            equipmentName: equipment?.name ?? 'Equipment',
            temperature: row.temperature,
            unit: row.unit,
            minAllowed: row.minAllowed,
            maxAllowed: row.maxAllowed,
            inRange: row.inRange,
            recordedBy: user
                ? {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    subspecialties: user.subspecialties,
                    disciplines: user.disciplines ?? [],
                }
                : null,
            recordedAt: row.createdAt.toISOString(),
            notes: row.notes,
        };
    }
    toCapa(row) {
        return {
            id: row._id.toString(),
            action: row.action,
            owner: row.owner,
            dueAt: row.dueAt?.toISOString() ?? null,
            status: row.status,
            completedAt: row.completedAt?.toISOString() ?? null,
        };
    }
    toEquipment(row) {
        return {
            id: row._id.toString(),
            code: row.code,
            name: row.name,
            type: row.type,
            serialNumber: row.serialNumber,
            location: row.location,
            status: row.status,
            lastCalibrationAt: row.lastCalibrationAt?.toISOString() ?? null,
            nextCalibrationAt: row.nextCalibrationAt?.toISOString() ?? null,
            active: row.active,
        };
    }
};
exports.QualityService = QualityService;
exports.QualityService = QualityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(quality_schema_1.EquipmentModelName)),
    __param(1, (0, mongoose_1.InjectModel)(quality_schema_1.TemperatureLogModelName)),
    __param(2, (0, mongoose_1.InjectModel)(quality_schema_1.NonConformanceModelName)),
    __param(3, (0, mongoose_1.InjectModel)(quality_schema_1.CapaActionModelName)),
    __param(4, (0, mongoose_1.InjectModel)(quality_schema_1.SendOutModelName)),
    __param(5, (0, mongoose_1.InjectModel)(test_request_schema_1.TestRequestModelName)),
    __param(6, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(7, (0, mongoose_1.InjectModel)(user_schema_1.UserModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        test_requests_service_1.TestRequestsService,
        audit_service_1.AuditService])
], QualityService);
//# sourceMappingURL=quality.service.js.map