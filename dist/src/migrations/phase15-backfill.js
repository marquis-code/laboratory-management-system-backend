"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Phase 1.5 backfill — idempotent.
 *
 * - ensures every existing laboratory has enabledDisciplines/accessionPrefixes
 * - assigns HISTOPATHOLOGY to existing clinical users with no disciplines
 * - creates a HISTOPATHOLOGY test request for every case that predates TestRequest
 *
 * It never renames existing collections, accession numbers or endpoint payloads.
 */
const mongoose_1 = __importDefault(require("mongoose"));
const STATUS_MAP = {
    RECEIVED: 'RECEIVED',
    IN_PROGRESS: 'IN_PROGRESS',
    PENDING_REVIEW: 'PENDING_REVIEW',
    REPORTED: 'VERIFIED',
    AMENDED: 'RELEASED',
};
async function main() {
    const uri = process.env.MONGODB_URI ??
        'mongodb://localhost:27017/histo_lims?replicaSet=rs0&directConnection=true';
    await mongoose_1.default.connect(uri, { serverSelectionTimeoutMS: 20_000 });
    const db = mongoose_1.default.connection.db;
    if (!db)
        throw new Error('MongoDB connection is not ready.');
    const labs = db.collection('labs');
    const users = db.collection('users');
    const cases = db.collection('cases');
    const testRequests = db.collection('test_requests');
    const labResult = await labs.updateMany({ enabledDisciplines: { $exists: false } }, { $set: { enabledDisciplines: ['HISTOPATHOLOGY'], accessionPrefixes: {} } });
    const labPrefixResult = await labs.updateMany({ accessionPrefixes: { $exists: false } }, { $set: { accessionPrefixes: {} } });
    const userResult = await users.updateMany({
        role: { $in: ['GROSSER', 'TECHNOLOGIST', 'SCIENTIST', 'PATHOLOGIST'] },
        $or: [{ disciplines: { $exists: false } }, { disciplines: { $size: 0 } }],
    }, { $set: { disciplines: ['HISTOPATHOLOGY'] } });
    let created = 0;
    let examined = 0;
    const cursor = cases.find({});
    for await (const caseDoc of cursor) {
        examined += 1;
        const existing = await testRequests.findOne({
            caseId: caseDoc._id,
            discipline: 'HISTOPATHOLOGY',
        });
        if (existing)
            continue;
        const now = new Date();
        await testRequests.updateOne({ caseId: caseDoc._id, discipline: 'HISTOPATHOLOGY', code: 'HISTO' }, {
            $setOnInsert: {
                labId: caseDoc.labId,
                caseId: caseDoc._id,
                accessionNumber: caseDoc.accessionNumber,
                discipline: 'HISTOPATHOLOGY',
                code: 'HISTO',
                name: 'Histopathology examination',
                status: STATUS_MAP[caseDoc.status] ?? 'RECEIVED',
                priority: caseDoc.priority,
                requestedBy: caseDoc.createdBy ?? null,
                requestedAt: caseDoc.receivedAt,
                createdAt: now,
                updatedAt: now,
            },
        }, { upsert: true });
        created += 1;
    }
    console.log(`Phase 1.5 backfill complete: labs updated=${labResult.modifiedCount + labPrefixResult.modifiedCount}, clinical users updated=${userResult.modifiedCount}, cases examined=${examined}, test requests created=${created}.`);
    await mongoose_1.default.disconnect();
}
main().catch(async (error) => {
    console.error(error);
    await mongoose_1.default.disconnect().catch(() => undefined);
    process.exit(1);
});
//# sourceMappingURL=phase15-backfill.js.map