"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const seed_1 = require("./seed");
function loadEnvironment() {
    for (const file of ['.env', '../../.env', node_path_1.default.resolve(process.cwd(), '.env')]) {
        try {
            process.loadEnvFile(file);
            return;
        }
        catch {
            // Try the next location.
        }
    }
}
async function main() {
    loadEnvironment();
    await (0, seed_1.seedDatabase)();
}
main().catch((error) => {
    console.error('Seed failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
//# sourceMappingURL=run-seed.js.map