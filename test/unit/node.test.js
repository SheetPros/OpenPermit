const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const { Node } = require('../../src/core/node.js');

describe('Node attributes and relationships', () => {
  test('addAttribute sets value and updates modified timestamp', async () => {
    const node = new Node('n1', 'Test');
    const originalModified = node.metadata.modified;
    // Ensure timestamp difference
    await new Promise((r) => setTimeout(r, 1));
    node.addAttribute('foo', 'bar');
    assert.strictEqual(node.attributes.foo, 'bar');
    assert.notStrictEqual(node.metadata.modified, originalModified);
  });

  test('addRelationship validates input and prevents duplicates', () => {
    const node = new Node('n1', 'Test');
    assert.throws(() => node.addRelationship('', 't1'));
    assert.throws(() => node.addRelationship('child', ''));
    node.addRelationship('child', 't1');
    assert.strictEqual(node.relationships.length, 1);
    // duplicate should be ignored
    node.addRelationship('child', 't1');
    assert.strictEqual(node.relationships.length, 1);
  });

  test('fromJSON restores attributes and relationships', () => {
    const orig = new Node('n1', 'Test');
    orig.addAttribute('a', 1);
    orig.addRelationship('rel', 'n2', { extra: true });
    const json = orig.toJSON();
    const restored = Node.fromJSON(json);
    assert.strictEqual(restored.attributes.a, 1);
    assert.strictEqual(restored.relationships.length, 1);
    assert.strictEqual(restored.relationships[0].type, 'rel');
    assert.strictEqual(restored.relationships[0].target, 'n2');
  });
});
