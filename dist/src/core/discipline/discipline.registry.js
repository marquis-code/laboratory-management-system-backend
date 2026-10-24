"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DisciplineRegistry_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisciplineRegistry = void 0;
const common_1 = require("@nestjs/common");
let DisciplineRegistry = DisciplineRegistry_1 = class DisciplineRegistry {
    logger = new common_1.Logger(DisciplineRegistry_1.name);
    definitions = new Map();
    register(definition) {
        if (this.definitions.has(definition.id)) {
            this.logger.warn(`Discipline ${definition.id} is already registered; replacing.`);
        }
        this.definitions.set(definition.id, definition);
        this.logger.log(`Discipline registered: ${definition.id}`);
    }
    get(id) {
        return this.definitions.get(id) ?? null;
    }
    require(id) {
        const definition = this.get(id);
        if (!definition)
            throw new Error(`Discipline ${id} is not registered.`);
        return definition;
    }
    all() {
        return Array.from(this.definitions.values());
    }
    enabled(enabledDisciplines) {
        return enabledDisciplines
            .map((id) => this.get(id))
            .filter((definition) => Boolean(definition));
    }
};
exports.DisciplineRegistry = DisciplineRegistry;
exports.DisciplineRegistry = DisciplineRegistry = DisciplineRegistry_1 = __decorate([
    (0, common_1.Injectable)()
], DisciplineRegistry);
//# sourceMappingURL=discipline.registry.js.map