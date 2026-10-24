"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRequestQuerySchema = exports.testRequestSchema = exports.disciplineSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
const common_1 = require("./common");
exports.disciplineSchema = zod_1.z.enum(constants_1.DISCIPLINES);
exports.testRequestSchema = zod_1.z.object({
    discipline: exports.disciplineSchema.default('HISTOPATHOLOGY'),
    code: zod_1.z.string().trim().min(1).max(80).default('HISTO'),
    name: zod_1.z.string().trim().min(1).max(160).default('Histopathology examination'),
});
exports.testRequestQuerySchema = zod_1.z.object({
    caseId: common_1.objectIdSchema.optional(),
    discipline: exports.disciplineSchema.optional(),
    status: zod_1.z.enum(constants_1.TEST_REQUEST_STATUSES).optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
//# sourceMappingURL=discipline.js.map