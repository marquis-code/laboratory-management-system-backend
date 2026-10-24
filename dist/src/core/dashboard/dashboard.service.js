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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const format_1 = require("../../common/utils/format");
const cases_service_1 = require("../cases/cases.service");
const case_schema_1 = require("../cases/case.schema");
const custody_event_schema_1 = require("../custody/custody-event.schema");
const patient_schema_1 = require("../patients/patient.schema");
const user_schema_1 = require("../users/user.schema");
let DashboardService = class DashboardService {
    caseModel;
    patientModel;
    userModel;
    eventModel;
    casesService;
    constructor(caseModel, patientModel, userModel, eventModel, casesService) {
        this.caseModel = caseModel;
        this.patientModel = patientModel;
        this.userModel = userModel;
        this.eventModel = eventModel;
        this.casesService = casesService;
    }
    async getSummary(query, _user) {
        const days = query.days ?? 30;
        const now = new Date();
        const rangeStart = new Date(now.getTime() - days * 86_400_000);
        const today = (0, format_1.startOfDay)(now);
        const activeStatuses = ['RECEIVED', 'IN_PROGRESS', 'PENDING_REVIEW'];
        const [totalCases, active, overdue, reportedInRange, reportedToday, statusGroups, priorityGroups, avgTatAgg, recentRaw, overdueCases, workloadAgg, pathologists, casesInRange,] = await Promise.all([
            this.caseModel.countDocuments({}).exec(),
            this.caseModel.countDocuments({ status: { $in: activeStatuses } }).exec(),
            this.caseModel
                .countDocuments({ status: { $in: activeStatuses }, tatDeadline: { $lt: now } })
                .exec(),
            this.caseModel.countDocuments({ reportedAt: { $gte: rangeStart } }).exec(),
            this.caseModel.countDocuments({ reportedAt: { $gte: today } }).exec(),
            this.caseModel
                .aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
                .exec(),
            this.caseModel
                .aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }])
                .exec(),
            this.caseModel
                .aggregate([
                {
                    $match: {
                        reportedAt: { $gte: rangeStart, $ne: null },
                        status: { $in: ['REPORTED', 'AMENDED'] },
                    },
                },
                {
                    $project: {
                        hours: {
                            $divide: [{ $subtract: ['$reportedAt', '$receivedAt'] }, 3_600_000],
                        },
                    },
                },
                { $group: { _id: null, average: { $avg: '$hours' }, count: { $sum: 1 } } },
            ])
                .exec(),
            this.caseModel.find({}).sort({ receivedAt: -1 }).limit(8).exec(),
            this.caseModel
                .find({ status: { $in: activeStatuses }, tatDeadline: { $lt: now } })
                .sort({ tatDeadline: 1 })
                .limit(8)
                .exec(),
            this.caseModel
                .aggregate([
                { $match: { status: { $in: ['IN_PROGRESS', 'PENDING_REVIEW'] } } },
                {
                    $group: {
                        _id: '$assignedPathologistId',
                        active: { $sum: 1 },
                        pending: {
                            $sum: { $cond: [{ $eq: ['$status', 'PENDING_REVIEW'] }, 1, 0] },
                        },
                        reported: { $sum: 0 },
                    },
                },
            ])
                .exec(),
            this.userModel.find({ role: 'PATHOLOGIST', active: true }).sort({ name: 1 }).exec(),
            this.caseModel
                .find({ receivedAt: { $gte: rangeStart } })
                .select('_id receivedAt')
                .limit(2_000)
                .exec(),
        ]);
        const stageTat = await this.computeStageTat(casesInRange.map((item) => ({ id: item._id, receivedAt: item.receivedAt })));
        const workload = await this.computeWorkload(workloadAgg, pathologists, rangeStart);
        const recentCases = await this.casesService.decorateCases(recentRaw);
        const alerts = await this.buildAlerts(overdueCases, now);
        const statusMap = new Map(statusGroups.map((group) => [group._id, group.count]));
        const priorityMap = new Map(priorityGroups.map((group) => [group._id, group.count]));
        return {
            generatedAt: now.toISOString(),
            rangeDays: days,
            totals: {
                cases: totalCases,
                active,
                overdue,
                reportedInRange,
                reportedToday,
                averageTatHours: avgTatAgg[0]?.average !== undefined ? Math.round(avgTatAgg[0].average * 10) / 10 : null,
            },
            casesByStatus: shared_1.CASE_STATUSES.map((status) => ({
                status,
                count: statusMap.get(status) ?? 0,
            })),
            casesByPriority: shared_1.PRIORITIES.map((priority) => ({
                priority,
                count: priorityMap.get(priority) ?? 0,
            })),
            stageTat,
            workload,
            recentCases,
            alerts,
        };
    }
    async computeStageTat(cases) {
        if (cases.length === 0)
            return this.emptyStageTat();
        const caseIds = cases.map((item) => item.id);
        const events = await this.eventModel
            .find({
            caseId: { $in: caseIds },
            toState: {
                $in: [
                    'GROSSED',
                    'PROCESSING',
                    'EMBEDDED',
                    'CUT',
                    'STAINED',
                    'WITH_PATHOLOGIST',
                    'REPORTED',
                ],
            },
        })
            .select('caseId toState timestamp')
            .sort({ timestamp: 1 })
            .exec();
        const milestones = new Map();
        for (const event of events) {
            if (!event.caseId)
                continue;
            const key = event.caseId.toString();
            const perCase = milestones.get(key) ?? new Map();
            if (!perCase.has(event.toState))
                perCase.set(event.toState, event.timestamp);
            milestones.set(key, perCase);
        }
        const stageDefs = [
            {
                key: 'grossing',
                label: 'Accession → grossing',
                from: 'RECEIVED',
                to: 'GROSSED',
                fromCase: true,
            },
            { key: 'processing', label: 'Processing', from: 'GROSSED', to: 'PROCESSING' },
            { key: 'embedding', label: 'Embedding', from: 'PROCESSING', to: 'EMBEDDED' },
            { key: 'microtomy', label: 'Microtomy', from: 'EMBEDDED', to: 'CUT' },
            { key: 'staining', label: 'Staining', from: 'CUT', to: 'STAINED' },
            { key: 'pathologist', label: 'Pathologist desk', from: 'STAINED', to: 'WITH_PATHOLOGIST' },
            { key: 'reporting', label: 'Reporting', from: 'WITH_PATHOLOGIST', to: 'REPORTED' },
        ];
        return stageDefs.map((stage) => {
            const durations = [];
            for (const caseItem of cases) {
                const perCase = milestones.get(caseItem.id.toString());
                if (!perCase)
                    continue;
                const from = stage.fromCase ? caseItem.receivedAt : perCase.get(stage.from);
                const to = perCase.get(stage.to);
                if (from && to) {
                    const hours = (to.getTime() - from.getTime()) / 3_600_000;
                    if (hours >= 0)
                        durations.push(hours);
                }
            }
            const average = durations.length > 0
                ? Math.round((durations.reduce((sum, value) => sum + value, 0) / durations.length) * 10) /
                    10
                : null;
            return {
                key: stage.key,
                label: stage.label,
                averageHours: average,
                samples: durations.length,
            };
        });
    }
    emptyStageTat() {
        return [
            { key: 'grossing', label: 'Accession → grossing', averageHours: null, samples: 0 },
            { key: 'processing', label: 'Processing', averageHours: null, samples: 0 },
            { key: 'embedding', label: 'Embedding', averageHours: null, samples: 0 },
            { key: 'microtomy', label: 'Microtomy', averageHours: null, samples: 0 },
            { key: 'staining', label: 'Staining', averageHours: null, samples: 0 },
            { key: 'pathologist', label: 'Pathologist desk', averageHours: null, samples: 0 },
            { key: 'reporting', label: 'Reporting', averageHours: null, samples: 0 },
        ];
    }
    async computeWorkload(aggregate, pathologists, rangeStart) {
        const reportedAgg = await this.caseModel
            .aggregate([
            {
                $match: {
                    assignedPathologistId: { $ne: null },
                    reportedAt: { $gte: rangeStart },
                },
            },
            {
                $group: {
                    _id: '$assignedPathologistId',
                    reported: { $sum: 1 },
                    active: { $sum: 0 },
                    pending: { $sum: 0 },
                },
            },
        ])
            .exec();
        const reportedMap = new Map(reportedAgg
            .filter((item) => item._id)
            .map((item) => [item._id?.toString() ?? '', item.reported]));
        const activeMap = new Map(aggregate
            .filter((item) => item._id)
            .map((item) => [
            item._id?.toString() ?? '',
            { active: item.active, pending: item.pending },
        ]));
        return pathologists.map((user) => {
            const counts = activeMap.get(user._id.toString()) ?? { active: 0, pending: 0 };
            return {
                pathologistId: user._id.toString(),
                name: user.name,
                activeCases: counts.active,
                pendingReview: counts.pending,
                reportedInRange: reportedMap.get(user._id.toString()) ?? 0,
            };
        });
    }
    async buildAlerts(cases, now) {
        if (cases.length === 0)
            return [];
        const patients = await this.patientModel
            .find({ _id: { $in: cases.map((item) => item.patientId) } })
            .exec();
        const patientMap = new Map(patients.map((patient) => [patient._id.toString(), patient]));
        return cases.map((caseDoc) => {
            const patient = patientMap.get(caseDoc.patientId.toString());
            return {
                caseId: caseDoc._id.toString(),
                accessionNumber: caseDoc.accessionNumber,
                patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown patient',
                priority: caseDoc.priority,
                tatDeadline: caseDoc.tatDeadline.toISOString(),
                hoursOverdue: Math.round(((now.getTime() - caseDoc.tatDeadline.getTime()) / 3_600_000) * 10) / 10,
            };
        });
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(1, (0, mongoose_1.InjectModel)(patient_schema_1.PatientModelName)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.UserModelName)),
    __param(3, (0, mongoose_1.InjectModel)(custody_event_schema_1.CustodyEventModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        cases_service_1.CasesService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map