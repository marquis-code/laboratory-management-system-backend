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
exports.QcService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_1 = require("@lims/shared");
const format_1 = require("../../common/utils/format");
const entities_1 = require("../../common/serializers/entities");
const user_schema_1 = require("../users/user.schema");
const qc_schema_1 = require("./qc.schema");
const westgard_1 = require("./westgard");
let QcService = class QcService {
    materialModel;
    runModel;
    userModel;
    constructor(materialModel, runModel, userModel) {
        this.materialModel = materialModel;
        this.runModel = runModel;
        this.userModel = userModel;
    }
    async listMaterials(discipline) {
        const materials = await this.materialModel
            .find(discipline ? { discipline } : {})
            .sort({ testCode: 1, level: 1 })
            .exec();
        return materials.map((material) => this.toMaterial(material));
    }
    async createMaterial(body, actor) {
        const parsed = shared_1.qcMaterialSchema.safeParse(body);
        if (!parsed.success) {
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        }
        const material = await this.materialModel.create({
            ...parsed.data,
            testCode: parsed.data.testCode.toUpperCase(),
            unit: parsed.data.unit ?? null,
            active: parsed.data.active ?? true,
        });
        void actor;
        return this.toMaterial(material);
    }
    async listRuns(query) {
        const filter = {};
        if (query.materialId)
            filter.materialId = new mongoose_2.Types.ObjectId(query.materialId);
        if (query.discipline) {
            const materials = await this.materialModel
                .find({ discipline: query.discipline })
                .select('_id')
                .exec();
            filter.materialId = { $in: materials.map((material) => material._id) };
        }
        const [runs, total] = await Promise.all([
            this.runModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip((query.page - 1) * query.limit)
                .limit(query.limit)
                .exec(),
            this.runModel.countDocuments(filter).exec(),
        ]);
        return (0, format_1.buildPaginated)(await Promise.all(runs.map((run) => this.toRun(run))), total, query.page, query.limit);
    }
    async run(body, actor) {
        const parsed = shared_1.qcRunSchema.safeParse(body);
        if (!parsed.success) {
            throw new common_1.BadRequestException(parsed.error.issues.map((issue) => issue.message).join(' '));
        }
        const material = await this.materialModel.findById(parsed.data.materialId).exec();
        if (!material)
            throw new common_1.NotFoundException('QC material not found.');
        const evaluation = (0, westgard_1.evaluateWestgard)(parsed.data.values, material.targetMean, material.targetSd);
        const run = await this.runModel.create({
            materialId: material._id,
            testCode: material.testCode,
            analyteKey: material.analyteKey,
            mean: material.targetMean,
            sd: material.targetSd,
            values: parsed.data.values,
            points: evaluation.points,
            status: evaluation.status,
            violations: evaluation.violations,
            comment: parsed.data.comment ?? null,
            performedBy: actor.userId ? new mongoose_2.Types.ObjectId(actor.userId) : null,
        });
        return this.toRun(run);
    }
    toMaterial(material) {
        return {
            id: material._id.toString(),
            discipline: material.discipline,
            name: material.name,
            lotNumber: material.lotNumber,
            level: material.level,
            testCode: material.testCode,
            analyteKey: material.analyteKey,
            targetMean: material.targetMean,
            targetSd: material.targetSd,
            unit: material.unit,
            active: material.active,
        };
    }
    async toRun(run) {
        const [material, performer] = await Promise.all([
            this.materialModel.findById(run.materialId).exec(),
            run.performedBy ? this.userModel.findById(run.performedBy).exec() : null,
        ]);
        return {
            id: run._id.toString(),
            materialId: run.materialId.toString(),
            materialName: material?.name ?? 'QC material',
            testCode: run.testCode,
            analyteKey: run.analyteKey,
            mean: run.mean,
            sd: run.sd,
            values: run.values,
            points: run.points,
            status: run.status,
            violations: run.violations,
            performedBy: performer ? (0, entities_1.toUserSummary)(performer) : null,
            createdAt: run.createdAt.toISOString(),
        };
    }
};
exports.QcService = QcService;
exports.QcService = QcService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(qc_schema_1.QcMaterialModelName)),
    __param(1, (0, mongoose_1.InjectModel)(qc_schema_1.QcRunModelName)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.UserModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], QcService);
//# sourceMappingURL=qc.service.js.map