"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentMessageSchema = exports.InstrumentMessageModelName = void 0;
const mongoose_1 = require("mongoose");
const shared_1 = require("@lims/shared");
const schema_options_1 = require("../../common/database/schema-options");
const tenant_plugin_1 = require("../../common/database/tenant.plugin");
exports.InstrumentMessageModelName = 'InstrumentMessage';
exports.InstrumentMessageSchema = new mongoose_1.Schema({
    protocol: { type: String, enum: shared_1.INSTRUMENT_PROTOCOLS, required: true },
    labCode: { type: String, default: null },
    accessionNumber: { type: String, default: null },
    testCode: { type: String, default: null },
    patientName: { type: String, default: null },
    values: { type: [{ code: String, value: String, unit: String }], default: [] },
    status: { type: String, enum: shared_1.INSTRUMENT_MESSAGE_STATUSES, default: 'RECEIVED' },
    error: { type: String, default: null },
    rawMessage: { type: String, required: true },
}, (0, schema_options_1.baseSchemaOptions)('instrument_messages'));
exports.InstrumentMessageSchema.plugin(tenant_plugin_1.tenantPlugin);
exports.InstrumentMessageSchema.index({ labId: 1, createdAt: -1 });
exports.InstrumentMessageSchema.index({ labId: 1, accessionNumber: 1 });
//# sourceMappingURL=instrument.schema.js.map