import mongoose from 'mongoose';
import { hashPassword } from '../common/utils/crypto';
import { LabModelName, LabSchema, type LabEntity } from '../core/labs/lab.schema';

const demoUsers = [
  {
    name: 'Dr. Kunle Adeyemi',
    email: 'chemistry@histo.ng',
    password: 'Chemistry#2026',
    role: 'SCIENTIST' as const,
    disciplines: ['CHEMICAL_PATHOLOGY'] as const,
  },
  {
    name: 'Dr. Ngozi Eze',
    email: 'haematology@histo.ng',
    password: 'Haematology#2026',
    role: 'SCIENTIST' as const,
    disciplines: ['HAEMATOLOGY'] as const,
  },
  {
    name: 'Dr. Ada Nwosu',
    email: 'microbiology@histo.ng',
    password: 'Microbiology#2026',
    role: 'SCIENTIST' as const,
    disciplines: ['MICROBIOLOGY'] as const,
  },
];

async function main(): Promise<void> {
  for (const file of ['.env', '../.env']) {
    try {
      process.loadEnvFile(file);
      break;
    } catch {
      /* platform env */
    }
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required.');
  await mongoose.connect(uri);
  const LabModel = mongoose.model<LabEntity>(LabModelName, LabSchema);
  const lab = await LabModel.findOne({
    code: (process.env.DEMO_LAB_CODE ?? 'HISTO').toUpperCase(),
  }).exec();
  if (!lab)
    throw new Error('Demo laboratory not found. Run the main seed first or set DEMO_LAB_CODE.');
  const users = mongoose.connection.collection('users');
  for (const definition of demoUsers) {
    const passwordHash = await hashPassword(definition.password);
    const existing = await users.findOne({ email: definition.email });
    const fields = {
      labId: lab._id,
      name: definition.name,
      role: definition.role,
      passwordHash,
      disciplines: definition.disciplines,
      active: true,
      mustChangePassword: false,
      updatedAt: new Date(),
    };
    if (existing) {
      await users.updateOne({ _id: existing._id }, { $set: fields });
    } else {
      await users.insertOne({ ...fields, createdAt: new Date() });
    }
    console.log(`Demo account ready: ${definition.email}`);
  }
  await mongoose.disconnect();
}

main().catch(async (error: unknown) => {
  console.error('Demo-user seed failed:', error instanceof Error ? error.message : error);
  await mongoose.disconnect().catch(() => undefined);
  process.exitCode = 1;
});
