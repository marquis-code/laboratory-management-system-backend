import mongoose from 'mongoose';

async function main(): Promise<void> {
  for (const file of ['.env', '../.env']) {
    try { process.loadEnvFile(file); break; } catch { /* injected env */ }
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required.');
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  if (!db) throw new Error('Database connection unavailable.');
  const labs = db.collection('labs');
  const lab = await labs.findOne({ code: { $in: ['HISTO', 'LAGOS'] } });
  if (!lab) throw new Error('Demo laboratory not found (HISTO/LAGOS).');
  await labs.updateOne(
    { _id: lab._id },
    {
      $set: {
        code: 'LAGOS',
        name: 'Lagos Central Medical Laboratory',
        email: 'reports@lagoslab.ng',
        'letterhead.email': 'reports@lagoslab.ng',
        'letterhead.footerNote': 'Lagos Central Medical Laboratory · Confidential clinical record · Verify this report with the QR code.',
        updatedAt: new Date(),
      },
    },
  );
  const users = db.collection('users');
  const affected = await users.find({ email: /@histo\.ng$/ }).toArray();
  for (const user of affected) {
    await users.updateOne(
      { _id: user._id },
      { $set: { email: String(user.email).replace(/@histo\.ng$/, '@lagoslab.ng'), updatedAt: new Date() } },
    );
    console.log(`${user.email} -> ${String(user.email).replace(/@histo\.ng$/, '@lagoslab.ng')}`);
  }
  console.log(`Demo laboratory renamed to LAGOS; ${affected.length} staff emails updated.`);
  await mongoose.disconnect();
}

main().catch(async (error: unknown) => {
  console.error('Demo tenant migration failed:', error instanceof Error ? error.message : error);
  await mongoose.disconnect().catch(() => undefined);
  process.exitCode = 1;
});
