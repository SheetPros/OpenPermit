const path = require('path');
const { OpenPermit } = require('../../src/api/index.js');
const CompatWorker = require('../../helpers/compat-worker');

global.Worker = CompatWorker;

describe('OpenPermit with worker', () => {
  test('create and validate node', async () => {
    const client = new OpenPermit({ workerPath: path.join(__dirname, '../../helpers/worker.js') });
    const node = await client.createNode({ id: 'n1', type: 'RequirementNode', attributes: { foo: 'bar' } });
    expect(node['@id']).toBe('n1');
    expect(node.attributes.foo).toBe('bar');

    const results = await client.validateNode(node);
    expect(results.valid).toBe(true);
    await client.worker.terminate();
  });
});
