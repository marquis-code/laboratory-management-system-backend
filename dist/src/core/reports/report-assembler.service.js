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
exports.ReportAssemblerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const entities_1 = require("../../common/serializers/entities");
const user_schema_1 = require("../users/user.schema");
const report_version_schema_1 = require("./report-version.schema");
const report_schema_1 = require("./report.schema");
let ReportAssemblerService = class ReportAssemblerService {
    reportModel;
    versionModel;
    userModel;
    constructor(reportModel, versionModel, userModel) {
        this.reportModel = reportModel;
        this.versionModel = versionModel;
        this.userModel = userModel;
    }
    async forCase(caseId) {
        const report = await this.reportModel.findOne({ caseId: new mongoose_2.Types.ObjectId(caseId) }).exec();
        return report ? this.assemble(report) : null;
    }
    async byId(reportId) {
        const report = await this.reportModel.findById(reportId).exec();
        return report ? this.assemble(report) : null;
    }
    async assemble(report) {
        const versions = await this.versionModel
            .find({ reportId: report._id })
            .sort({ version: 1 })
            .exec();
        const userIds = new Set();
        if (report.signedOutBy)
            userIds.add(report.signedOutBy.toString());
        if (report.releasedBy)
            userIds.add(report.releasedBy.toString());
        for (const version of versions) {
            if (version.createdBy)
                userIds.add(version.createdBy.toString());
        }
        const users = userIds.size > 0
            ? await this.userModel
                .find({ _id: { $in: Array.from(userIds).map((id) => new mongoose_2.Types.ObjectId(id)) } })
                .exec()
            : [];
        const userMap = new Map(users.map((user) => [user._id.toString(), user]));
        const signer = report.signedOutBy ? (userMap.get(report.signedOutBy.toString()) ?? null) : null;
        const releaser = report.releasedBy ? (userMap.get(report.releasedBy.toString()) ?? null) : null;
        const versionDtos = versions.map((version) => (0, entities_1.toReportVersion)(version, version.createdBy ? (userMap.get(version.createdBy.toString()) ?? null) : null));
        return (0, entities_1.toReportDetail)(report, signer, versionDtos, releaser);
    }
};
exports.ReportAssemblerService = ReportAssemblerService;
exports.ReportAssemblerService = ReportAssemblerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(report_schema_1.ReportModelName)),
    __param(1, (0, mongoose_1.InjectModel)(report_version_schema_1.ReportVersionModelName)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.UserModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ReportAssemblerService);
//# sourceMappingURL=report-assembler.service.js.map