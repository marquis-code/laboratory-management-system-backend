"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportDataSchema = void 0;
const zod_1 = require("zod");
exports.reportDataSchema = zod_1.z.record(zod_1.z.union([
    zod_1.z.string().max(20_000),
    zod_1.z.number(),
    zod_1.z.boolean(),
    zod_1.z.array(zod_1.z.string().max(2_000)).max(100),
    zod_1.z.null(),
]));
//# sourceMappingURL=report-data.js.map