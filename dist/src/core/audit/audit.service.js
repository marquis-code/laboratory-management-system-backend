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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tenant_context_1 = require("../../common/context/tenant-context");
const actor_1 = require("../../common/utils/actor");
const format_1 = require("../../common/utils/format");
const entities_1 = require("../../common/serializers/entities");
const audit_log_schema_1 = require("./audit-log.schema");
let AuditService = class AuditService {
    auditModel;
    constructor(auditModel) {
        this.auditModel = auditModel;
    }
    /**
     * Append an audit record. Pass the caller's transaction session so the audit
     * entry commits (or rolls back) with the business change it describes.
     */
    async record(input, session) {
        const tenant = (0, tenant_context_1.currentTenant)();
        if (!tenant)
            return;
        const actor = input.actor ?? (0, actor_1.currentActor)();
        const context = (0, actor_1.requestAuditContext)();
        const doc = new this.auditModel({
            action: input.action,
            entityType: input.entityType,
            entityId: input.entityId ?? null,
            caseId: input.caseId ?? null,
            userId: actor.userId ? new mongoose_2.Types.ObjectId(actor.userId) : null,
            userName: actor.userName,
            userRole: actor.userRole ?? null,
            before: (0, format_1.auditSnapshot)(input.before),
            after: (0, format_1.auditSnapshot)(input.after),
            metadata: input.metadata ?? {},
            ip: context.ip,
            userAgent: context.userAgent,
            requestId: context.requestId,
        });
        await doc.save(session ? { session } : {});
    }
    async list(query) {
        const filter = {};
        if (query.action)
            filter.action = query.action;
        if (query.entityType)
            filter.entityType = query.entityType;
        if (query.entityId)
            filter.entityId = query.entityId;
        if (query.userId)
            filter.userId = new mongoose_2.Types.ObjectId(query.userId);
        if (query.from || query.to) {
            const range = {};
            if (query.from) {
                const from = (0, format_1.parseDateOnly)(query.from);
                if (from)
                    range.$gte = from;
            }
            if (query.to) {
                const to = (0, format_1.parseDateOnly)(query.to);
                if (to) {
                    to.setUTCHours(23, 59, 59, 999);
                    range.$lte = to;
                }
            }
            if (Object.keys(range).length > 0)
                filter.createdAt = range;
        }
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const [documents, total] = await Promise.all([
            this.auditModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.auditModel.countDocuments(filter).exec(),
        ]);
        return (0, format_1.buildPaginated)(documents.map((document) => (0, entities_1.toAuditLog)(document)), total, page, limit);
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(audit_log_schema_1.AuditLogModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AuditService);
//# sourceMappingURL=audit.service.js.map