"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discipline = exports.DISCIPLINE_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.DISCIPLINE_KEY = 'lims:disciplines';
const Discipline = (...disciplines) => (0, common_1.SetMetadata)(exports.DISCIPLINE_KEY, disciplines);
exports.Discipline = Discipline;
//# sourceMappingURL=discipline.decorator.js.map