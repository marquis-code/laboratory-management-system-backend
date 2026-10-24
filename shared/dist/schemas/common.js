"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationQuerySchema = exports.isoDateTimeSchema = exports.dateStringSchema = exports.DATE_REGEX = exports.objectIdSchema = exports.OBJECT_ID_REGEX = void 0;
const zod_1 = require("zod");
exports.OBJECT_ID_REGEX = /^[a-f0-9]{24}$/i;
exports.objectIdSchema = zod_1.z.string().regex(exports.OBJECT_ID_REGEX, 'Invalid identifier.');
exports.DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
exports.dateStringSchema = zod_1.z.string().regex(exports.DATE_REGEX, 'Use YYYY-MM-DD.');
exports.isoDateTimeSchema = zod_1.z.string().datetime({ offset: true });
exports.paginationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
//# sourceMappingURL=common.js.map