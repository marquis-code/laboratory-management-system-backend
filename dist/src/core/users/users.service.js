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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const format_1 = require("../../common/utils/format");
const crypto_1 = require("../../common/utils/crypto");
const transaction_1 = require("../../common/utils/transaction");
const entities_1 = require("../../common/serializers/entities");
const audit_service_1 = require("../audit/audit.service");
const user_schema_1 = require("./user.schema");
let UsersService = class UsersService {
    userModel;
    connection;
    audit;
    constructor(userModel, connection, audit) {
        this.userModel = userModel;
        this.connection = connection;
        this.audit = audit;
    }
    async list(query) {
        const filter = {};
        if (query.role)
            filter.role = query.role;
        if (query.active !== undefined)
            filter.active = query.active;
        if (query.q) {
            const regex = new RegExp((0, format_1.escapeRegex)(query.q), 'i');
            filter.$or = [{ name: regex }, { email: regex }];
        }
        const page = query.page;
        const limit = query.limit;
        const [users, total] = await Promise.all([
            this.userModel
                .find(filter)
                .sort({ active: -1, name: 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.userModel.countDocuments(filter).exec(),
        ]);
        return (0, format_1.buildPaginated)(users.map((user) => (0, entities_1.toUser)(user)), total, page, limit);
    }
    async pathologists() {
        const users = await this.userModel
            .find({ role: 'PATHOLOGIST', active: true })
            .sort({ name: 1 })
            .exec();
        return users.map((user) => (0, entities_1.toUserSummary)(user));
    }
    async findActiveById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            return null;
        return this.userModel.findById(id).exec();
    }
    async assertActivePathologist(id) {
        const user = await this.findActiveById(id);
        if (!user || !user.active || user.role !== 'PATHOLOGIST') {
            throw new common_1.BadRequestException('Select an active pathologist from this laboratory.');
        }
        return user;
    }
    async create(dto, actor) {
        if (dto.role === 'SUPER_ADMIN' && actor.role !== 'SUPER_ADMIN') {
            throw new common_1.ForbiddenException('Only a super administrator can create another super administrator.');
        }
        const email = dto.email.trim().toLowerCase();
        const existing = await this.userModel.findOne({ email }).exec();
        if (existing)
            throw new common_1.ConflictException('A user with this email already exists in the laboratory.');
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const passwordHash = await (0, crypto_1.hashPassword)(dto.password);
            const user = new this.userModel({
                name: dto.name.trim(),
                email,
                passwordHash,
                role: dto.role,
                phone: dto.phone?.trim() || null,
                subspecialties: dto.subspecialties ?? [],
                disciplines: dto.disciplines ?? ((0, shared_1.isClinicalRole)(dto.role) ? ['HISTOPATHOLOGY'] : []),
            });
            await user.save({ session });
            await this.audit.record({
                action: 'CREATE',
                entityType: 'User',
                entityId: user._id.toString(),
                after: (0, entities_1.toUser)(user),
                metadata: { role: user.role },
            }, session);
            return (0, entities_1.toUser)(user);
        });
    }
    async update(id, dto, actor) {
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const user = await this.userModel.findById(id).session(session).exec();
            if (!user)
                throw new common_1.NotFoundException('User not found.');
            const before = (0, entities_1.toUser)(user);
            if (id === actor.id && dto.role && dto.role !== user.role) {
                throw new common_1.ForbiddenException('You cannot change your own role.');
            }
            if (id === actor.id && dto.active === false) {
                throw new common_1.ForbiddenException('You cannot deactivate your own account.');
            }
            if ((dto.role === 'SUPER_ADMIN' || user.role === 'SUPER_ADMIN') &&
                actor.role !== 'SUPER_ADMIN') {
                throw new common_1.ForbiddenException('Only a super administrator can manage super administrator roles.');
            }
            if (dto.name !== undefined)
                user.name = dto.name.trim();
            if (dto.role !== undefined)
                user.role = dto.role;
            if (dto.active !== undefined)
                user.active = dto.active;
            if (dto.phone !== undefined)
                user.phone = dto.phone.trim() || null;
            if (dto.subspecialties !== undefined)
                user.subspecialties = dto.subspecialties;
            if (dto.disciplines !== undefined)
                user.disciplines = dto.disciplines;
            if (dto.role !== undefined &&
                (0, shared_1.isClinicalRole)(dto.role) &&
                (user.disciplines ?? []).length === 0) {
                user.disciplines = ['HISTOPATHOLOGY'];
            }
            if (dto.active === false)
                user.refreshTokenHash = null;
            await user.save({ session });
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'User',
                entityId: user._id.toString(),
                before,
                after: (0, entities_1.toUser)(user),
            }, session);
            return (0, entities_1.toUser)(user);
        });
    }
    async resetPassword(id, password, actor) {
        const user = await this.userModel.findById(id).exec();
        if (!user)
            throw new common_1.NotFoundException('User not found.');
        if (user.role === 'SUPER_ADMIN' && actor.role !== 'SUPER_ADMIN') {
            throw new common_1.ForbiddenException('Only a super administrator can reset this account.');
        }
        const passwordHash = await (0, crypto_1.hashPassword)(password);
        await (0, transaction_1.withTransaction)(this.connection, async (session) => {
            await this.userModel
                .updateOne({ _id: user._id }, { $set: { passwordHash, refreshTokenHash: null } }, { session })
                .exec();
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'User',
                entityId: user._id.toString(),
                metadata: { passwordReset: true, targetUser: user.email },
            }, session);
        });
        return { success: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.UserModelName)),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model, Function, audit_service_1.AuditService])
], UsersService);
//# sourceMappingURL=users.service.js.map