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
var TatCheckService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TatCheckService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tenant_context_1 = require("../../common/context/tenant-context");
const tenant_context_2 = require("../../common/context/tenant-context");
const case_schema_1 = require("../cases/case.schema");
const lab_schema_1 = require("../labs/lab.schema");
const notification_schema_1 = require("../notifications/notification.schema");
let TatCheckService = TatCheckService_1 = class TatCheckService {
    labModel;
    caseModel;
    notificationModel;
    logger = new common_1.Logger(TatCheckService_1.name);
    constructor(labModel, caseModel, notificationModel) {
        this.labModel = labModel;
        this.caseModel = caseModel;
        this.notificationModel = notificationModel;
    }
    async runAllLabs() {
        const labs = await this.labModel.find({ active: true }).select('_id').exec();
        let total = 0;
        for (const lab of labs) {
            total += await (0, tenant_context_2.runWithTenant)({ labId: lab._id.toString() }, () => this.checkLab());
        }
        return total;
    }
    async runCurrentLab() {
        const tenant = (0, tenant_context_1.currentTenant)();
        if (!tenant)
            return 0;
        return this.checkLab();
    }
    async checkLab() {
        const now = new Date();
        const cases = await this.caseModel
            .find({
            status: { $in: ['RECEIVED', 'IN_PROGRESS', 'PENDING_REVIEW'] },
            tatDeadline: { $lt: now },
            tatBreachedAt: null,
        })
            .limit(500)
            .exec();
        for (const caseDoc of cases) {
            await this.caseModel.updateOne({ _id: caseDoc._id }, { $set: { tatBreachedAt: now } }).exec();
            const overdueHours = Math.round(((now.getTime() - caseDoc.tatDeadline.getTime()) / 3_600_000) * 10) / 10;
            const notification = new this.notificationModel({
                type: 'TAT_BREACH',
                title: `TAT breach — ${caseDoc.accessionNumber}`,
                body: `The ${caseDoc.priority.toLowerCase()} case ${caseDoc.accessionNumber} is ${overdueHours}h beyond its ${caseDoc.tatDeadline.toISOString()} turnaround deadline.`,
                caseId: caseDoc._id.toString(),
                entityType: 'Case',
                entityId: caseDoc._id.toString(),
                userId: caseDoc.assignedPathologistId ?? null,
                role: caseDoc.assignedPathologistId ? null : 'LAB_ADMIN',
                readAt: null,
                metadata: { overdueHours, priority: caseDoc.priority },
            });
            await notification.save();
        }
        if (cases.length > 0) {
            this.logger.warn(`Flagged ${cases.length} TAT breaches.`);
        }
        return cases.length;
    }
};
exports.TatCheckService = TatCheckService;
exports.TatCheckService = TatCheckService = TatCheckService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(lab_schema_1.LabModelName)),
    __param(1, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(2, (0, mongoose_1.InjectModel)(notification_schema_1.NotificationModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], TatCheckService);
void mongoose_2.Types;
//# sourceMappingURL=tat-check.service.js.map