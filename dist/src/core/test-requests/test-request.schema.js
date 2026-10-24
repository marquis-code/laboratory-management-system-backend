"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRequestSchema = exports.TestRequestModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.TestRequestModelName = 'TestRequest';
exports.TestRequestSchema = new mongoose_1.Schema({
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    accessionNumber: { type: String, required: true, trim: true, maxlength: 64 },
    discipline: { type: String, enum: shared_1.DISCIPLINES, required: true },
    code: { type: String, required: true, trim: true, maxlength: 80 },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    status: { type: String, enum: shared_1.TEST_REQUEST_STATUSES, required: true, default: 'RECEIVED' },
    priority: { type: String, enum: shared_1.PRIORITIES, required: true, default: 'ROUTINE' },
    requestedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    requestedAt: { type: Date, required: true, default: Date.now },
    collectionCentreId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'CollectionCentre', default: null },
    consignmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Consignment', default: null },
}, (0, schema_options_1.baseSchemaOptions)('test_requests'));
exports.TestRequestSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.TestRequestSchema.index({ labId: 1, caseId: 1, discipline: 1, code: 1 }, { unique: true });
exports.TestRequestSchema.index({ labId: 1, discipline: 1, status: 1, priority: 1 });
exports.TestRequestSchema.index({ labId: 1, accessionNumber: 1 });
//# sourceMappingURL=test-request.schema.js.map