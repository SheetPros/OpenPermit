const { describe, test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { OpenPermit } = require('../../src/api/index.js');
const CompatWorker = require('../../helpers/compat-worker');

global.Worker = CompatWorker;

describe('OpenPermit with worker', () => {
  let client;

  beforeEach(() => {
    client = new OpenPermit({
      workerPath: path.join(__dirname, '../../helpers/worker.js')
    });
  });

  afterEach(async () => {
    if (client && client.worker) {
      await client.worker.terminate();
    }
  });

  test('create and validate node', async () => {
    const node = await client.createNode({
      id: 'n1',
      type: 'RequirementNode',
      attributes: { foo: 'bar' }
    });
    assert.strictEqual(node['@id'], 'n1');
    assert.strictEqual(node.attributes.foo, 'bar');

    const results = await client.validateNode(node);
    assert.strictEqual(results.valid, true);
  });
});
