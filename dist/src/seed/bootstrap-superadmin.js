"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = require("../common/utils/crypto");
const tenant_context_1 = require("../common/context/tenant-context");
const lab_schema_1 = require("../core/labs/lab.schema");
const user_schema_1 = require("../core/users/user.schema");
function required(name) {
    const value = process.env[name]?.trim();
    if (!value)
        throw new Error(`${name} is required for production bootstrap.`);
    return value;
}
function loadEnvironment() {
    for (const file of ['.env', '../../.env']) {
        try {
            process.loadEnvFile(file);
            return;
        }
        catch {
            // Environment variables may be injected by the platform.
        }
    }
}
async function main() {
    loadEnvironment();
    const uri = required('MONGODB_URI');
    const labCode = required('BOOTSTRAP_LAB_CODE').toUpperCase();
    const labName = process.env.BOOTSTRAP_LAB_NAME?.trim() || 'Platform Administration';
    const adminName = process.env.BOOTSTRAP_ADMIN_NAME?.trim() || 'System Administrator';
    const adminEmail = required('BOOTSTRAP_ADMIN_EMAIL').toLowerCase();
    const password = required('BOOTSTRAP_ADMIN_PASSWORD');
    if (password.length < 12)
        throw new Error('BOOTSTRAP_ADMIN_PASSWORD must be at least 12 characters.');
    await mongoose_1.default.connect(uri);
    const LabModel = mongoose_1.default.model(lab_schema_1.LabModelName, lab_schema_1.LabSchema);
    const UserModel = mongoose_1.default.model(user_schema_1.UserModelName, user_schema_1.UserSchema);
    const existingLab = await LabModel.findOne({ code: labCode }).exec();
    if (existingLab)
        throw new Error(`Laboratory ${labCode} already exists. Bootstrap is only for first deployment.`);
    const lab = await LabModel.create({
        code: labCode,
        name: labName,
        enabledDisciplines: ['HISTOPATHOLOGY', 'HAEMATOLOGY', 'CHEMICAL_PATHOLOGY', 'MICROBIOLOGY'],
        active: true,
        letterhead: { email: adminEmail },
    });
    await (0, tenant_context_1.runWithSystemTenant)('bootstrap-superadmin', lab._id.toString(), async () => {
        const existing = await UserModel.findOne({ email: adminEmail }).exec();
        if (existing)
            throw new Error('An account with BOOTSTRAP_ADMIN_EMAIL already exists.');
        await UserModel.create({
            labId: lab._id,
            name: adminName,
            email: adminEmail,
            role: 'SUPER_ADMIN',
            passwordHash: await (0, crypto_1.hashPassword)(password),
            mustChangePassword: true,
            disciplines: [],
            active: true,
        });
    });
    console.log(`Super administrator created for ${adminEmail} at laboratory ${labCode}.`);
    await mongoose_1.default.disconnect();
}
main().catch(async (error) => {
    console.error('Bootstrap failed:', error instanceof Error ? error.message : error);
    await mongoose_1.default.disconnect().catch(() => undefined);
    process.exitCode = 1;
});
//# sourceMappingURL=bootstrap-superadmin.js.map