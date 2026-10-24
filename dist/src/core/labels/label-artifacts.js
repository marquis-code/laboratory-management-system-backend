"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelArtifactRegistry = void 0;
const common_1 = require("@nestjs/common");
let LabelArtifactRegistry = class LabelArtifactRegistry {
    providers = new Map();
    register(provider) {
        this.providers.set(provider.discipline, provider);
    }
    get(discipline = 'HISTOPATHOLOGY') {
        return this.providers.get(discipline) ?? null;
    }
    async forCase(caseId, discipline = 'HISTOPATHOLOGY') {
        return (await this.get(discipline)?.forCase(caseId)) ?? [];
    }
};
exports.LabelArtifactRegistry = LabelArtifactRegistry;
exports.LabelArtifactRegistry = LabelArtifactRegistry = __decorate([
    (0, common_1.Injectable)()
], LabelArtifactRegistry);
//# sourceMappingURL=label-artifacts.js.map