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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const lead_schema_1 = require("./lead.schema");
let LeadsService = class LeadsService {
    leadModel;
    constructor(leadModel) {
        this.leadModel = leadModel;
    }
    async create(body) {
        const parsed = shared_1.leadCreateSchema.safeParse(body);
        if (!parsed.success)
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        const lead = await this.leadModel.create(parsed.data);
        return this.toLead(lead);
    }
    async list() {
        const rows = await this.leadModel.find({}).sort({ createdAt: -1 }).limit(200).exec();
        return rows.map((row) => this.toLead(row));
    }
    async update(id, body) {
        const parsed = shared_1.leadUpdateSchema.safeParse(body);
        if (!parsed.success)
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        const lead = await this.leadModel
            .findByIdAndUpdate(id, { $set: { status: parsed.data.status } }, { new: true })
            .exec();
        if (!lead)
            throw new common_1.NotFoundException('Lead not found.');
        return this.toLead(lead);
    }
    toLead(row) {
        return {
            id: row._id.toString(),
            type: row.type,
            organizationName: row.organizationName,
            contactName: row.contactName,
            email: row.email,
            phone: row.phone,
            role: row.role,
            departments: row.departments,
            monthlyVolume: row.monthlyVolume,
            message: row.message,
            status: row.status,
            createdAt: row.createdAt.toISOString(),
        };
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(lead_schema_1.LeadModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LeadsService);
//# sourceMappingURL=leads.service.js.map