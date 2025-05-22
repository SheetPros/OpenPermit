const { Node } = require('../../src/core/node.js');

describe('Node attributes and relationships', () => {
  test('addAttribute sets value and updates modified timestamp', () => {
    const node = new Node('n1', 'Test');
    const originalModified = node.metadata.modified;
    node.addAttribute('foo', 'bar');
    expect(node.attributes.foo).toBe('bar');
    expect(node.metadata.modified).not.toBe(originalModified);
  });

  test('addRelationship validates input and prevents duplicates', () => {
    const node = new Node('n1', 'Test');
    expect(() => node.addRelationship('', 't1')).toThrow();
    expect(() => node.addRelationship('child', '')).toThrow();
    node.addRelationship('child', 't1');
    expect(node.relationships.length).toBe(1);
    // duplicate should be ignored
    node.addRelationship('child', 't1');
    expect(node.relationships.length).toBe(1);
  });

  test('fromJSON restores attributes and relationships', () => {
    const orig = new Node('n1', 'Test');
    orig.addAttribute('a', 1);
    orig.addRelationship('rel', 'n2', { extra: true });
    const json = orig.toJSON();
    const restored = Node.fromJSON(json);
    expect(restored.attributes.a).toBe(1);
    expect(restored.relationships.length).toBe(1);
    expect(restored.relationships[0].type).toBe('rel');
    expect(restored.relationships[0].target).toBe('n2');
  });
});
