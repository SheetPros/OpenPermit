const path = require('node:path');
const { OpenPermit } = require('../src/api/index.js');
const CompatWorker = require('../helpers/compat-worker');

global.Worker = CompatWorker;

test('create and validate node via worker', async () => {
  const client = new OpenPermit({ workerPath: path.join(__dirname, '../helpers/worker.js') });
  const node = await client.createNode({ id: 'n1', type: 'RequirementNode' });
  expect(node['@id']).toBe('n1');
  const results = await client.validateNode(node);
  expect(results.valid).toBe(true);
  await client.worker.terminate();
});
