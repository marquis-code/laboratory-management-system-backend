import mongoose from 'mongoose';

function textAnalyte(key: string, name: string): Record<string, unknown> {
  return { key, name, unit: null, resultType: 'TEXT', decimals: null, required: false, referenceRanges: [], formula: null };
}
function numericAnalyte(key: string, name: string, unit: string | null, low: number | null, high: number | null): Record<string, unknown> {
  return { key, name, unit, resultType: 'NUMERIC', decimals: 1, required: false, referenceRanges: [{ low, high, sex: null, ageMin: null, ageMax: null }], formula: null };
}

const definitions = [
  { discipline: 'HISTOPATHOLOGY', code: 'HPE', name: 'Histopathology examination', specimenType: 'Tissue in formalin', method: 'Gross examination and microscopy', analytes: [textAnalyte('diagnosis', 'Diagnosis'), textAnalyte('tumourType', 'Tumour type'), textAnalyte('grade', 'Grade'), textAnalyte('margins', 'Margin status')] },
  { discipline: 'HISTOPATHOLOGY', code: 'CYTO', name: 'Cytology examination', specimenType: 'Cytology specimen', method: 'Microscopy', analytes: [textAnalyte('specimenAdequacy', 'Specimen adequacy'), textAnalyte('interpretation', 'Interpretation')] },
  { discipline: 'MICROBIOLOGY', code: 'MICRO', name: 'Urine culture and susceptibility', specimenType: 'Midstream urine', method: 'Culture and AST', analytes: [textAnalyte('organism', 'Organism isolated'), numericAnalyte('colonyCount', 'Colony count', 'CFU/mL', null, null), textAnalyte('susceptibility', 'Susceptibility profile')] },
  { discipline: 'MICROBIOLOGY', code: 'BLOOD-CULTURE', name: 'Blood culture', specimenType: 'Blood culture bottles', method: 'Automated culture', analytes: [textAnalyte('organism', 'Organism isolated'), textAnalyte('susceptibility', 'Susceptibility profile')] },
  { discipline: 'MICROBIOLOGY', code: 'STOOL-CULTURE', name: 'Stool culture', specimenType: 'Stool', method: 'Culture', analytes: [textAnalyte('organism', 'Organism isolated'), textAnalyte('susceptibility', 'Susceptibility profile')] },
  { discipline: 'HAEMATOLOGY', code: 'ESR', name: 'Erythrocyte sedimentation rate', specimenType: 'EDTA blood', method: 'Westergren', analytes: [numericAnalyte('esr', 'ESR', 'mm/hr', 0, 20)] },
  { discipline: 'HAEMATOLOGY', code: 'BG', name: 'Blood group and rhesus', specimenType: 'EDTA blood', method: 'Haemagglutination', analytes: [textAnalyte('abo', 'ABO group'), textAnalyte('rhesus', 'Rhesus factor')] },
  { discipline: 'CHEMICAL_PATHOLOGY', code: 'HBA1C', name: 'Glycated haemoglobin', specimenType: 'EDTA blood', method: 'HPLC', analytes: [numericAnalyte('hba1c', 'HbA1c', '%', 4, 5.6)] },
  { discipline: 'CHEMICAL_PATHOLOGY', code: 'LIPID', name: 'Lipid profile', specimenType: 'Serum', method: 'Enzymatic', analytes: [numericAnalyte('chol', 'Total cholesterol', 'mmol/L', 0, 5.2), numericAnalyte('trig', 'Triglycerides', 'mmol/L', 0, 1.7), numericAnalyte('hdl', 'HDL cholesterol', 'mmol/L', 1, null)] },
];

async function main(): Promise<void> {
  for (const file of ['.env', '../.env']) {
    try { process.loadEnvFile(file); break; } catch { /* injected env */ }
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required.');
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  if (!db) throw new Error('Database unavailable.');
  const lab = await db.collection('labs').findOne({ code: process.env.DEMO_LAB_CODE ?? 'LAGOS' });
  if (!lab) throw new Error('Demo laboratory not found.');
  for (const definition of definitions) {
    await db.collection('test_definitions').updateOne(
      { labId: lab._id, discipline: definition.discipline, code: definition.code },
      { $set: { ...definition, labId: lab._id, active: true, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    );
  }
  const total = await db.collection('test_definitions').countDocuments({ labId: lab._id, active: true });
  console.log(`Demo catalogue ready: ${definitions.length} upserted, ${total} active tests in ${lab.code}.`);
  await mongoose.disconnect();
}
main().catch(async (error: unknown) => {
  console.error('Catalogue seed failed:', error instanceof Error ? error.message : error);
  await mongoose.disconnect().catch(() => undefined);
  process.exitCode = 1;
});
