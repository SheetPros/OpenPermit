const { test } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const { execFileSync } = require('node:child_process');

// Run the Python script to generate a temporary ontology file
function generateOntology() {
  const script = path.join(__dirname, '../open-data-layer/ontology/generate_ontology.py');
  const tmpFile = path.join(os.tmpdir(), `ontology_${Date.now()}.owl`);
  execFileSync('python3', [script, tmpFile]);
  return fs.readFileSync(tmpFile, 'utf8');
}

test('generate_ontology script outputs expected ontology', () => {
  const text = generateOntology();
  assert.ok(text.includes(':Permit a owl:Class ;'));
  assert.ok(text.includes(':Applicant a owl:Class ;'));
  assert.ok(text.includes(':hasApplicant a owl:ObjectProperty ;'));
});
