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
exports.ResultsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transaction_1 = require("../../common/utils/transaction");
const entities_1 = require("../../common/serializers/entities");
const audit_service_1 = require("../audit/audit.service");
const catalog_service_1 = require("../catalog/catalog.service");
const case_schema_1 = require("../cases/case.schema");
const patient_schema_1 = require("../patients/patient.schema");
const rules_service_1 = require("../rules/rules.service");
const notification_service_1 = require("../notifications/notification.service");
const test_requests_service_1 = require("../test-requests/test-requests.service");
const test_request_schema_1 = require("../test-requests/test-request.schema");
const user_schema_1 = require("../users/user.schema");
const result_schema_1 = require("./result.schema");
const result_calculator_1 = require("./result-calculator");
const RESULT_STATUS_TO_REQUEST = {
    DRAFT: 'IN_PROGRESS',
    RESULTED: 'RESULTED',
    VERIFIED: 'VERIFIED',
    RELEASED: 'RELEASED',
    CANCELLED: 'CANCELLED',
};
let ResultsService = class ResultsService {
    connection;
    resultModel;
    versionModel;
    requestModel;
    caseModel;
    patientModel;
    userModel;
    catalog;
    rules;
    testRequests;
    audit;
    notifications;
    constructor(connection, resultModel, versionModel, requestModel, caseModel, patientModel, userModel, catalog, rules, testRequests, audit, notifications) {
        this.connection = connection;
        this.resultModel = resultModel;
        this.versionModel = versionModel;
        this.requestModel = requestModel;
        this.caseModel = caseModel;
        this.patientModel = patientModel;
        this.userModel = userModel;
        this.catalog = catalog;
        this.rules = rules;
        this.testRequests = testRequests;
        this.audit = audit;
        this.notifications = notifications;
    }
    async worklist(discipline, user) {
        const allowed = this.clinicalDisciplines(user);
        if (allowed.length > 0 && !allowed.includes(discipline))
            return [];
        const requests = await this.requestModel
            .find({
            discipline,
            status: {
                $in: ['RECEIVED', 'COLLECTED', 'IN_PROGRESS', 'PENDING_REVIEW', 'RESULTED', 'VERIFIED'],
            },
        })
            .sort({ priority: 1, requestedAt: 1 })
            .limit(100)
            .exec();
        const results = await this.resultModel
            .find({ testRequestId: { $in: requests.map((request) => request._id) } })
            .exec();
        const resultMap = new Map(results.map((result) => [result.testRequestId.toString(), result]));
        const definitions = await Promise.all(requests.map((request) => this.catalog.findTest(request.discipline, request.code)));
        return Promise.all(requests.map(async (request, index) => ({
            testRequest: (0, entities_1.toTestRequest)(request),
            result: resultMap.get(request._id.toString())
                ? await this.toResult(resultMap.get(request._id.toString()))
                : null,
            testDefinition: definitions[index] ?? null,
        })));
    }
    async getById(id) {
        const result = await this.resultModel.findById(id).exec();
        if (!result)
            throw new common_1.NotFoundException('Result not found.');
        return this.toResult(result);
    }
    async create(testRequestId, actor) {
        const resultId = await (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const request = await this.requestModel.findById(testRequestId).session(session).exec();
            if (!request)
                throw new common_1.NotFoundException('Test request not found.');
            this.assertAccess(actor, request.discipline);
            if (request.status === 'RELEASED' || request.status === 'CANCELLED') {
                throw new common_1.ConflictException('This test request is closed.');
            }
            const existing = await this.resultModel
                .findOne({ testRequestId: request._id })
                .session(session)
                .exec();
            if (existing)
                throw new common_1.ConflictException('A result already exists for this test request.');
            const caseDoc = await this.caseModel.findById(request.caseId).session(session).exec();
            if (!caseDoc)
                throw new common_1.NotFoundException('Case not found.');
            const definition = await this.catalog.findTest(request.discipline, request.code);
            if (!definition)
                throw new common_1.BadRequestException(`No active catalogue definition for ${request.code}.`);
            const values = this.blankValues(definition);
            const result = new this.resultModel({
                caseId: caseDoc._id,
                patientId: caseDoc.patientId,
                testRequestId: request._id,
                discipline: request.discipline,
                testCode: request.code,
                testName: definition.name,
                status: 'DRAFT',
                currentVersion: 1,
                values,
                enteredBy: new mongoose_2.Types.ObjectId(actor.id),
            });
            await result.save({ session });
            await this.appendVersion(result, 'DRAFT_SAVE', values, null, actor, session);
            await this.testRequests.setStatus(request._id, 'IN_PROGRESS', session);
            await this.audit.record({
                action: 'CREATE',
                entityType: 'ResultSet',
                entityId: result._id.toString(),
                caseId: caseDoc._id.toString(),
                after: { testCode: result.testCode, status: result.status },
            }, session);
            return result._id.toString();
        });
        return this.getById(resultId);
    }
    async update(id, input, actor) {
        await (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const result = await this.resultModel.findById(id).session(session).exec();
            if (!result)
                throw new common_1.NotFoundException('Result not found.');
            this.assertAccess(actor, result.discipline);
            if (result.status === 'VERIFIED' || result.status === 'RELEASED') {
                throw new common_1.ConflictException('Verified results are locked.');
            }
            const request = await this.requestModel
                .findById(result.testRequestId)
                .session(session)
                .exec();
            if (!request)
                throw new common_1.NotFoundException('Test request not found.');
            const caseDoc = await this.caseModel.findById(result.caseId).session(session).exec();
            const patient = await this.patientModel.findById(result.patientId).session(session).exec();
            const definition = await this.catalog.findTest(result.discipline, result.testCode);
            if (!caseDoc || !patient || !definition)
                throw new common_1.NotFoundException('Result context is missing.');
            const values = this.computeValues(definition, input.values, patient);
            const previous = await this.previousResult(patient._id, result.testCode, result._id, session);
            const previousValues = previous ? this.valueMap(previous.values) : {};
            const delta = this.deltaMap(values, previous?.values ?? []);
            result.values = values;
            result.comment = input.comment ?? null;
            result.critical = values.some((value) => value.critical);
            result.currentVersion += 1;
            result.status = this.complete(definition, values) ? 'RESULTED' : 'DRAFT';
            await result.save({ session });
            const matches = await this.rules.evaluate('RESULT_SAVE', {
                discipline: result.discipline,
                testCode: result.testCode,
                values: this.valueMap(values),
                patient: { age: patient.age, sex: patient.sex },
                previous: previousValues,
                delta,
                comment: result.comment,
            }, result._id, caseDoc._id, session);
            for (const match of matches) {
                for (const action of match.actions) {
                    if (action.type === 'AUTO_VERIFY' &&
                        this.complete(definition, values) &&
                        !result.critical) {
                        result.status = 'VERIFIED';
                        result.autoVerified = true;
                        result.verifiedAt = new Date();
                        result.verifiedBy = request.requestedBy ?? null;
                    }
                    if (action.type === 'REFLEX_TEST' && action.testCode) {
                        await this.addReflexRequest(caseDoc, result.discipline, action.testCode, actor, session);
                    }
                }
            }
            await result.save({ session });
            await this.appendVersion(result, result.status === 'VERIFIED'
                ? 'VERIFY'
                : result.status === 'RESULTED'
                    ? 'RESULTED'
                    : 'DRAFT_SAVE', values, result.comment, actor, session);
            await this.testRequests.setStatus(request._id, RESULT_STATUS_TO_REQUEST[result.status], session);
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'ResultSet',
                entityId: result._id.toString(),
                caseId: result.caseId.toString(),
                after: {
                    status: result.status,
                    version: result.currentVersion,
                    flags: values.map((value) => value.flag),
                },
                metadata: { rules: matches.map((match) => match.rule.code) },
            }, session);
        });
        return this.getById(id);
    }
    async verify(id, actor) {
        await (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const result = await this.resultModel.findById(id).session(session).exec();
            if (!result)
                throw new common_1.NotFoundException('Result not found.');
            this.assertAccess(actor, result.discipline);
            if (result.status !== 'RESULTED' && result.status !== 'DRAFT') {
                throw new common_1.ConflictException('Only a resulted draft can be verified.');
            }
            if (result.critical && !result.criticalAcknowledgedAt) {
                throw new common_1.ConflictException('Acknowledge the critical value before verification.');
            }
            const request = await this.requestModel
                .findById(result.testRequestId)
                .session(session)
                .exec();
            if (!request)
                throw new common_1.NotFoundException('Test request not found.');
            result.status = 'VERIFIED';
            result.verifiedBy = new mongoose_2.Types.ObjectId(actor.id);
            result.verifiedAt = new Date();
            await result.save({ session });
            await this.appendVersion(result, 'VERIFY', result.values, result.comment, actor, session);
            await this.testRequests.setStatus(request._id, 'VERIFIED', session);
            await this.audit.record({
                action: 'UPDATE',
                entityType: 'ResultSet',
                entityId: result._id.toString(),
                caseId: result.caseId.toString(),
                after: { status: 'VERIFIED' },
                metadata: { verifiedBy: actor.email },
            }, session);
        });
        return this.getById(id);
    }
    async release(id, actor) {
        await (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const result = await this.resultModel.findById(id).session(session).exec();
            if (!result)
                throw new common_1.NotFoundException('Result not found.');
            this.assertAccess(actor, result.discipline);
            if (result.status !== 'VERIFIED')
                throw new common_1.ConflictException('Verify the result before release.');
            result.status = 'RELEASED';
            result.releasedAt = new Date();
            await result.save({ session });
            await this.appendVersion(result, 'RELEASE', result.values, result.comment, actor, session);
            const request = await this.requestModel
                .findById(result.testRequestId)
                .session(session)
                .exec();
            if (request)
                await this.testRequests.setStatus(request._id, 'RELEASED', session);
            await this.audit.record({
                action: 'RELEASE',
                entityType: 'ResultSet',
                entityId: result._id.toString(),
                caseId: result.caseId.toString(),
                after: { status: 'RELEASED' },
            }, session);
        });
        const released = await this.getById(id);
        await this.notifyRelease(released).catch(() => undefined);
        return released;
    }
    async acknowledgeCritical(id, note, actor) {
        const result = await this.resultModel.findById(id).exec();
        if (!result)
            throw new common_1.NotFoundException('Result not found.');
        if (!result.critical)
            throw new common_1.BadRequestException('This result has no critical value.');
        result.criticalAcknowledgedAt = new Date();
        result.criticalAcknowledgedBy = new mongoose_2.Types.ObjectId(actor.id);
        result.criticalAckNote = note;
        await result.save();
        return this.getById(id);
    }
    async versions(id) {
        const versions = await this.versionModel
            .find({ resultSetId: new mongoose_2.Types.ObjectId(id) })
            .sort({ version: -1 })
            .exec();
        return Promise.all(versions.map((version) => this.toVersion(version)));
    }
    async executions(id) {
        return this.rules.executions(id);
    }
    async cumulative(patientId, from, to, disciplines) {
        const patient = await this.patientModel.findById(patientId).exec();
        if (!patient)
            throw new common_1.NotFoundException('Patient not found.');
        const filter = {
            patientId: patient._id,
            status: { $in: ['VERIFIED', 'RELEASED'] },
        };
        if (disciplines && disciplines.length > 0)
            filter.discipline = { $in: disciplines };
        if (from || to) {
            const range = {};
            if (from)
                range.$gte = new Date(from);
            if (to)
                range.$lte = new Date(to);
            filter.createdAt = range;
        }
        const results = await this.resultModel.find(filter).sort({ createdAt: -1 }).exec();
        const grouped = new Map();
        for (const result of results) {
            const key = `${result.discipline}:${result.testCode}`;
            grouped.set(key, [...(grouped.get(key) ?? []), result]);
        }
        const cumulative = await Promise.all(Array.from(grouped.values()).map(async (group) => ({
            testCode: group[0].testCode,
            testName: group[0].testName,
            discipline: group[0].discipline,
            latest: await this.toResult(group[0]),
            history: await Promise.all(group.map((item) => this.toResult(item))),
        })));
        return {
            patient: (0, entities_1.toPatient)(patient),
            from: from ?? new Date(0).toISOString(),
            to: to ?? new Date().toISOString(),
            disciplines: Array.from(new Set(results.map((result) => result.discipline))),
            results: cumulative,
        };
    }
    blankValues(definition) {
        return definition.analytes.map((analyte) => ({
            analyteKey: analyte.key,
            analyteName: analyte.name,
            value: null,
            unit: analyte.unit ?? null,
            flag: 'NORMAL',
            critical: false,
            referenceText: this.referenceText(analyte, null),
        }));
    }
    computeValues(definition, inputs, patient) {
        const map = new Map(inputs.map((input) => [input.analyteKey, input.value]));
        const values = definition.analytes.map((analyte) => {
            const raw = map.get(analyte.key) ?? null;
            const value = this.normalizeValue(analyte, raw);
            const computed = this.flagFor(analyte, value, patient);
            return {
                analyteKey: analyte.key,
                analyteName: analyte.name,
                value,
                unit: analyte.unit ?? null,
                flag: computed.flag,
                critical: computed.critical,
                referenceText: this.referenceText(analyte, patient),
            };
        });
        return (0, result_calculator_1.calculateAnalytes)(definition.analytes, values).map((value) => {
            const analyte = definition.analytes.find((item) => item.key === value.analyteKey);
            if (!analyte)
                return value;
            const computed = this.flagFor(analyte, value.value, patient);
            return {
                ...value,
                flag: computed.flag,
                critical: computed.critical,
                referenceText: this.referenceText(analyte, patient),
            };
        });
    }
    normalizeValue(analyte, raw) {
        if (raw === null || raw === '')
            return null;
        if (analyte.resultType === 'NUMERIC' || analyte.resultType === 'CALCULATED') {
            const value = typeof raw === 'number' ? raw : Number(raw);
            return Number.isFinite(value) ? value : null;
        }
        return String(raw);
    }
    flagFor(analyte, value, patient) {
        if (typeof value !== 'number') {
            return { flag: value === null ? 'NORMAL' : 'NORMAL', critical: false };
        }
        const range = this.pickRange(analyte.referenceRanges, patient);
        if (analyte.criticalLow !== null &&
            analyte.criticalLow !== undefined &&
            value < analyte.criticalLow) {
            return { flag: 'CRITICAL_LOW', critical: true };
        }
        if (analyte.criticalHigh !== null &&
            analyte.criticalHigh !== undefined &&
            value > analyte.criticalHigh) {
            return { flag: 'CRITICAL_HIGH', critical: true };
        }
        if (!range)
            return { flag: 'NORMAL', critical: false };
        if (range.low !== null && range.low !== undefined && value < range.low) {
            return { flag: 'LOW', critical: false };
        }
        if (range.high !== null && range.high !== undefined && value > range.high) {
            return { flag: 'HIGH', critical: false };
        }
        return { flag: 'NORMAL', critical: false };
    }
    pickRange(ranges, patient) {
        return (ranges.find((range) => {
            if (range.sex && range.sex !== patient.sex)
                return false;
            if (range.minAge !== null &&
                range.minAge !== undefined &&
                (patient.age ?? 0) < range.minAge)
                return false;
            if (range.maxAge !== null &&
                range.maxAge !== undefined &&
                (patient.age ?? 0) > range.maxAge)
                return false;
            return true;
        }) ?? null);
    }
    referenceText(analyte, patient) {
        if (analyte.resultType !== 'NUMERIC' && analyte.resultType !== 'CALCULATED')
            return null;
        const range = patient
            ? this.pickRange(analyte.referenceRanges, patient)
            : (analyte.referenceRanges[0] ?? null);
        if (!range || (range.low === null && range.high === null))
            return null;
        return `${range.low ?? '—'}–${range.high ?? '—'}${analyte.unit ? ` ${analyte.unit}` : ''}`;
    }
    complete(definition, values) {
        return definition.analytes.every((analyte) => {
            if (!analyte.required)
                return true;
            const value = values.find((item) => item.analyteKey === analyte.key);
            return value !== undefined && value.value !== null && value.value !== '';
        });
    }
    deltaMap(current, previous) {
        const map = {};
        for (const value of current) {
            if (typeof value.value !== 'number')
                continue;
            const prior = previous.find((item) => item.analyteKey === value.analyteKey);
            if (prior && typeof prior.value === 'number') {
                map[value.analyteKey] = Math.abs(value.value - prior.value);
            }
        }
        return map;
    }
    valueMap(values) {
        return Object.fromEntries(values.map((value) => [
            value.analyteKey,
            { value: value.value, flag: value.flag, critical: value.critical },
        ]));
    }
    async previousResult(patientId, testCode, currentId, session) {
        return this.resultModel
            .findOne({
            patientId,
            testCode,
            _id: { $ne: currentId },
            status: { $in: ['VERIFIED', 'RELEASED'] },
        })
            .sort({ createdAt: -1 })
            .session(session)
            .exec();
    }
    async addReflexRequest(caseDoc, discipline, testCode, actor, session) {
        const exists = await this.requestModel
            .findOne({ caseId: caseDoc._id, discipline, code: testCode.toUpperCase() })
            .session(session)
            .exec();
        if (exists)
            return;
        await this.requestModel.create([
            {
                caseId: caseDoc._id,
                accessionNumber: caseDoc.accessionNumber,
                discipline,
                code: testCode.toUpperCase(),
                name: `${testCode.toUpperCase()} reflex test`,
                status: 'RECEIVED',
                priority: caseDoc.priority,
                requestedBy: new mongoose_2.Types.ObjectId(actor.id),
                requestedAt: new Date(),
            },
        ], { session });
    }
    async appendVersion(result, action, values, comment, actor, session) {
        await new this.versionModel({
            resultSetId: result._id,
            caseId: result.caseId,
            version: result.currentVersion,
            action,
            values,
            comment,
            createdBy: new mongoose_2.Types.ObjectId(actor.id),
        }).save({ session });
    }
    async toResult(result) {
        const [caseDoc, patient, enteredBy, verifiedBy] = await Promise.all([
            this.caseModel.findById(result.caseId).exec(),
            this.patientModel.findById(result.patientId).exec(),
            result.enteredBy ? this.userModel.findById(result.enteredBy).exec() : null,
            result.verifiedBy ? this.userModel.findById(result.verifiedBy).exec() : null,
        ]);
        return {
            id: result._id.toString(),
            caseId: result.caseId.toString(),
            accessionNumber: caseDoc?.accessionNumber ?? '—',
            patientId: result.patientId.toString(),
            patientName: patient ? `${patient.firstName} ${patient.lastName}` : '—',
            testRequestId: result.testRequestId.toString(),
            discipline: result.discipline,
            testCode: result.testCode,
            testName: result.testName,
            status: result.status,
            currentVersion: result.currentVersion,
            values: result.values,
            comment: result.comment,
            critical: result.critical,
            criticalAcknowledgedAt: result.criticalAcknowledgedAt?.toISOString() ?? null,
            criticalAcknowledgedBy: result.criticalAcknowledgedBy?.toString() ?? null,
            enteredBy: enteredBy ? (0, entities_1.toUserSummary)(enteredBy) : null,
            verifiedBy: verifiedBy ? (0, entities_1.toUserSummary)(verifiedBy) : null,
            verifiedAt: result.verifiedAt?.toISOString() ?? null,
            releasedAt: result.releasedAt?.toISOString() ?? null,
            createdAt: result.createdAt.toISOString(),
            updatedAt: result.updatedAt.toISOString(),
        };
    }
    async notifyRelease(result) {
        const caseDoc = await this.caseModel.findById(result.caseId).exec();
        if (!caseDoc)
            return;
        const email = caseDoc.referringClinician.email;
        const phone = caseDoc.referringClinician.phone;
        await this.notifications.send({
            labId: caseDoc.labId.toString(),
            type: 'RESULT_RELEASED',
            title: `Result released — ${result.accessionNumber}`,
            body: `${result.testName} for ${result.patientName} (${result.accessionNumber}) has been verified and released.`,
            caseId: result.caseId,
            entityType: 'ResultSet',
            entityId: result.id,
            userId: caseDoc.referringClinician.referrerUserId?.toString() ?? null,
            channels: [
                ...(caseDoc.referringClinician.referrerUserId ? ['IN_APP'] : []),
                ...(email ? ['EMAIL'] : []),
                ...(phone ? ['WHATSAPP'] : []),
            ],
            recipient: {
                email: email ?? undefined,
                phone: phone ?? undefined,
                name: caseDoc.referringClinician.name,
            },
            metadata: { testCode: result.testCode, discipline: result.discipline },
        });
    }
    async toVersion(version) {
        const createdBy = version.createdBy
            ? await this.userModel.findById(version.createdBy).exec()
            : null;
        return {
            id: version._id.toString(),
            resultSetId: version.resultSetId.toString(),
            version: version.version,
            action: version.action,
            values: version.values,
            comment: version.comment,
            createdBy: createdBy ? (0, entities_1.toUserSummary)(createdBy) : null,
            createdAt: version.createdAt.toISOString(),
        };
    }
    assertAccess(user, discipline) {
        if (user.role === 'SUPER_ADMIN' || user.role === 'LAB_ADMIN')
            return;
        const assigned = this.clinicalDisciplines(user);
        if (assigned.length > 0 && !assigned.includes(discipline)) {
            throw new common_1.ForbiddenException('You are not assigned to this discipline.');
        }
    }
    clinicalDisciplines(user) {
        if (user.role === 'SUPER_ADMIN' || user.role === 'LAB_ADMIN')
            return [];
        if (user.role === 'PATHOLOGIST' || user.role === 'SCIENTIST' || user.role === 'TECHNOLOGIST') {
            return user.disciplines.length > 0 ? user.disciplines : ['HISTOPATHOLOGY'];
        }
        return [];
    }
};
exports.ResultsService = ResultsService;
exports.ResultsService = ResultsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(1, (0, mongoose_1.InjectModel)(result_schema_1.ResultSetModelName)),
    __param(2, (0, mongoose_1.InjectModel)(result_schema_1.ResultVersionModelName)),
    __param(3, (0, mongoose_1.InjectModel)(test_request_schema_1.TestRequestModelName)),
    __param(4, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(5, (0, mongoose_1.InjectModel)(patient_schema_1.PatientModelName)),
    __param(6, (0, mongoose_1.InjectModel)(user_schema_1.UserModelName)),
    __metadata("design:paramtypes", [Function, mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        catalog_service_1.CatalogService,
        rules_service_1.RulesService,
        test_requests_service_1.TestRequestsService,
        audit_service_1.AuditService,
        notification_service_1.NotificationService])
], ResultsService);
//# sourceMappingURL=results.service.js.map