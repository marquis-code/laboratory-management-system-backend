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
exports.ProtocolsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const transaction_1 = require("../../../common/utils/transaction");
const histopathology_serializers_1 = require("../histopathology.serializers");
const audit_service_1 = require("../../../core/audit/audit.service");
const protocol_schema_1 = require("./protocol.schema");
let ProtocolsService = class ProtocolsService {
    connection;
    protocolModel;
    audit;
    constructor(connection, protocolModel, audit) {
        this.connection = connection;
        this.protocolModel = protocolModel;
        this.audit = audit;
    }
    async list(query) {
        const filter = {};
        if (query.subspecialty)
            filter.subspecialty = query.subspecialty;
        if (query.active !== undefined)
            filter.active = query.active;
        const protocols = await this.protocolModel.find(filter).sort({ title: 1 }).exec();
        return protocols.map(histopathology_serializers_1.toProtocol);
    }
    async get(id) {
        const protocol = await this.protocolModel.findById(id).exec();
        if (!protocol)
            throw new common_1.NotFoundException('Protocol not found.');
        return (0, histopathology_serializers_1.toProtocol)(protocol);
    }
    async create(dto, actor) {
        const content = this.parseContent(dto.content);
        const key = dto.key.toLowerCase();
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const existing = await this.protocolModel.findOne({ key }).session(session).exec();
            if (existing)
                throw new common_1.ConflictException('A protocol with this key already exists.');
            const protocol = new this.protocolModel({
                key,
                title: dto.title.trim(),
                cancerType: dto.cancerType.trim(),
                subspecialty: dto.subspecialty.trim(),
                version: 1,
                active: true,
                content,
                createdBy: new mongoose_2.Types.ObjectId(actor.id),
            });
            await protocol.save({ session });
            await this.audit.record({
                action: 'CREATE',
                entityType: 'Protocol',
                entityId: protocol._id.toString(),
                after: (0, histopathology_serializers_1.toProtocol)(protocol),
            }, session);
            return (0, histopathology_serializers_1.toProtocol)(protocol);
        });
    }
    async update(id, dto, actor) {
        const content = dto.content ? this.parseContent(dto.content) : null;
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const protocol = await this.protocolModel.findById(id).session(session).exec();
            if (!protocol)
                throw new common_1.NotFoundException('Protocol not found.');
            const before = (0, histopathology_serializers_1.toProtocol)(protocol);
            if (dto.title !== undefined)
                protocol.title = dto.title.trim();
            if (dto.cancerType !== undefined)
                protocol.cancerType = dto.cancerType.trim();
            if (dto.subspecialty !== undefined)
                protocol.subspecialty = dto.subspecialty.trim();
            if (dto.active !== undefined)
                protocol.active = dto.active;
            if (content) {
                protocol.content = content;
                protocol.version += 1;
            }
            await protocol.save({ session });
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'Protocol',
                entityId: protocol._id.toString(),
                before,
                after: (0, histopathology_serializers_1.toProtocol)(protocol),
                metadata: { version: protocol.version, actor: actor.email },
            }, session);
            return (0, histopathology_serializers_1.toProtocol)(protocol);
        });
    }
    async deactivate(id, actor) {
        return this.update(id, { active: false }, actor);
    }
    parseContent(raw) {
        const parsed = shared_1.protocolContentSchema.safeParse(raw);
        if (!parsed.success) {
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`));
        }
        return parsed.data;
    }
};
exports.ProtocolsService = ProtocolsService;
exports.ProtocolsService = ProtocolsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(1, (0, mongoose_1.InjectModel)(protocol_schema_1.ProtocolModelName)),
    __metadata("design:paramtypes", [Function, mongoose_2.Model,
        audit_service_1.AuditService])
], ProtocolsService);
//# sourceMappingURL=protocols.service.js.map