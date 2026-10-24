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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisciplinesModule = void 0;
const common_1 = require("@nestjs/common");
const discipline_registry_1 = require("../core/discipline/discipline.registry");
const discipline_1 = require("./chemistry/discipline");
const discipline_2 = require("./haematology/discipline");
const discipline_3 = require("./histopathology/discipline");
const discipline_4 = require("./microbiology/discipline");
let DisciplinesModule = class DisciplinesModule {
    registry;
    constructor(registry) {
        this.registry = registry;
    }
    onModuleInit() {
        this.registry.register((0, discipline_3.histopathologyDefinition)());
        this.registry.register((0, discipline_2.haematologyDefinition)());
        this.registry.register((0, discipline_1.chemistryDefinition)());
        this.registry.register((0, discipline_4.microbiologyDefinition)());
    }
};
exports.DisciplinesModule = DisciplinesModule;
exports.DisciplinesModule = DisciplinesModule = __decorate([
    (0, common_1.Module)({}),
    __metadata("design:paramtypes", [discipline_registry_1.DisciplineRegistry])
], DisciplinesModule);
//# sourceMappingURL=disciplines.module.js.map