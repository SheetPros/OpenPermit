const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { OpenPermit } = require('../src/api/index.js');
const CompatWorker = require('../helpers/compat-worker');

global.Worker = CompatWorker;

test('create and validate node via worker', async () => {
  const client = new OpenPermit({
    workerPath: path.join(__dirname, '../helpers/worker.js')
  });
  const node = await client.createNode({ id: 'n1', type: 'RequirementNode' });
  assert.strictEqual(node['@id'], 'n1');
  const results = await client.validateNode(node);
  assert.strictEqual(results.valid, true);
  await client.worker.terminate();
});
