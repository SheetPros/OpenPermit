// src/core/node.js
/**
 * OpenPermit Node - Core implementation of self-defining node structure
 * @module core/node
 */

/**
 * Node class representing a self-defining node in the ontology
 */
class Node {
  /**
   * Create a new node
   * @param {string} id - Unique node identifier (URI)
   * @param {string} type - Node type identifier
   * @param {Object} metadata - Node metadata
   */
  constructor(id, type, metadata = {}) {
    this.id = id;
    this.type = type;
    this.metadata = {
      name: '',
      description: '',
      version: '1.0.0',
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      ...metadata
    };
    this.attributes = {};
    this.relationships = [];
    this.validationRules = [];
    this.aiInterface = {
      capabilities: [],
      parameters: {}
    };
    this.extensions = {};
  }

  /**
   * Add an attribute to the node
   * @param {string} key - Attribute key
   * @param {any} value - Attribute value
   * @returns {Node} - The node instance for chaining
   */
  addAttribute(key, value) {
    this.attributes[key] = value;
    this.metadata.modified = new Date().toISOString();
    return this;
  }

  /**
   * Add a relationship to the node
   * @param {string} type - Relationship type
   * @param {string} target - Target node URI
   * @param {Object} metadata - Relationship metadata
   * @returns {Node} - The node instance for chaining
   */
  addRelationship(type, target, metadata = {}) {
    this.relationships.push({
      type,
      target,
      metadata
    });
    this.metadata.modified = new Date().toISOString();
    return this;
  }

  /**
   * Add a validation rule to the node
   * @param {string} ruleType - Type of validation rule
   * @param {string} expression - Rule expression
   * @param {string} severity - Severity level
   * @param {string} message - Human-readable message
   * @returns {Node} - The node instance for chaining
   */
  addValidationRule(ruleType, expression, severity = 'error', message = '') {
    this.validationRules.push({
      ruleType,
      expression,
      severity,
      message
    });
    this.metadata.modified = new Date().toISOString();
    return this;
  }

  /**
   * Add AI capability to the node
   * @param {string} capability - AI capability identifier
   * @param {Object} parameters - AI parameters
   * @returns {Node} - The node instance for chaining
   */
  addAICapability(capability, parameters = {}) {
    if (!this.aiInterface.capabilities.includes(capability)) {
      this.aiInterface.capabilities.push(capability);
    }
    
    this.aiInterface.parameters = {
      ...this.aiInterface.parameters,
      ...parameters
    };
    
    this.metadata.modified = new Date().toISOString();
    return this;
  }

  /**
   * Add extension data to the node
   * @param {string} namespace - Extension namespace
   * @param {Object} data - Extension data
   * @returns {Node} - The node instance for chaining
   */
  addExtension(namespace, data) {
    this.extensions[namespace] = data;
    this.metadata.modified = new Date().toISOString();
    return this;
  }

  /**
   * Convert node to JSON representation
   * @returns {Object} - JSON representation of the node
   */
  toJSON() {
    return {
      "@context": "https://openpermit.org/schemas/node/v1",
      "@id": this.id,
      "@type": this.type,
      "metadata": this.metadata,
      "attributes": this.attributes,
      "relationships": this.relationships,
      "validationRules": this.validationRules,
      "aiInterface": this.aiInterface,
      "extensions": this.extensions
    };
  }

  /**
   * Create a node from JSON representation
   * @param {Object} json - JSON representation of the node
   * @returns {Node} - New node instance
   */
  static fromJSON(json) {
    const node = new Node(
      json["@id"] || json.id,
      json["@type"] || json.type,
      json.metadata || {}
    );
    
    // Restore attributes
    if (json.attributes) {
      Object.entries(json.attributes).forEach(([key, value]) => {
        node.addAttribute(key, value);
      });
    }
    
    // Restore relationships
    if (json.relationships) {
      json.relationships.forEach(rel => {
        node.addRelationship(rel.type, rel.target, rel.metadata || {});
      });
    }
    
    // Restore validation rules
    if (json.validationRules) {
      json.validationRules.forEach(rule => {
        node.addValidationRule(
          rule.ruleType,
          rule.expression,
          rule.severity,
          rule.message
        );
      });
    }
    
    // Restore AI interface
    if (json.aiInterface) {
      if (json.aiInterface.capabilities) {
        json.aiInterface.capabilities.forEach(capability => {
          node.addAICapability(capability);
        });
      }
      
      if (json.aiInterface.parameters) {
        Object.entries(json.aiInterface.parameters).forEach(([key, value]) => {
          node.aiInterface.parameters[key] = value;
        });
      }
    }
    
    // Restore extensions
    if (json.extensions) {
      Object.entries(json.extensions).forEach(([namespace, data]) => {
        node.addExtension(namespace, data);
      });
    }
    
    return node;
  }
}

// src/core/constants.js
/**
 * OpenPermit Constants
 * @module core/constants
 */

/**
 * Node types
 * @enum {string}
 */
const NODE_TYPES = {
  STANDARD: 'StandardNode',
  COMPONENT: 'ComponentNode',
  REQUIREMENT: 'RequirementNode',
  PROPERTY: 'PropertyNode',
  PROCESS: 'ProcessNode',
  ACTOR: 'ActorNode',
  DOCUMENT: 'DocumentNode',
  VALIDATION: 'ValidationNode'
};

/**
 * Relationship types
 * @enum {string}
 */
const RELATIONSHIP_TYPES = {
  IMPLEMENTS: 'implements',
  REFERENCES: 'references',
  CONTAINS: 'contains',
  VALIDATES: 'validates',
  REQUIRES: 'requires',
  EQUIVALENT: 'equivalent',
  DERIVES: 'derives',
  CONNECTS: 'connects'
};

/**
 * Validation rule types
 * @enum {string}
 */
const VALIDATION_RULE_TYPES = {
  REQUIREMENT: 'requirement',
  CONSTRAINT: 'constraint',
  CONSISTENCY: 'consistency',
  FORMAT: 'format',
  REFERENCE: 'reference'
};

/**
 * Severity levels
 * @enum {string}
 */
const SEVERITY_LEVELS = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  HINT: 'hint'
};

/**
 * AI capabilities
 * @enum {string}
 */
const AI_CAPABILITIES = {
  VALIDATION: 'validation',
  RECOMMENDATION: 'recommendation',
  EXPLANATION: 'explanation',
  INFERENCE: 'inference',
  CONFLICT_RESOLUTION: 'conflictResolution',
  UNCERTAINTY: 'uncertaintyManagement',
  LEARNING: 'continuousLearning'
};

// src/core/worker.js
/**
 * OpenPermit Worker - Web Worker implementation for node processing
 * @module core/worker
 */

// Import core functionality
importScripts('./node.js', './constants.js');

/**
 * Validate a node against rules
 * @param {Object} node - Node to validate
 * @returns {Promise<Object>} - Validation results
 */
async function validateNode(node) {
  // Convert to Node instance if plain object
  const nodeInstance = node instanceof Node ? node : Node.fromJSON(node);
  
  // Basic validation results structure
  const results = {
    valid: true,
    errors: [],
    warnings: [],
    info: []
  };
  
  // Validate required fields
  if (!nodeInstance.id) {
    results.valid = false;
    results.errors.push({
      code: 'MISSING_ID',
      message: 'Node ID is required'
    });
  }
  
  if (!nodeInstance.type) {
    results.valid = false;
    results.errors.push({
      code: 'MISSING_TYPE',
      message: 'Node type is required'
    });
  }
  
  // Simulate async operation for complex validation
  await new Promise(resolve => setTimeout(resolve, 10));
  
  // In a real implementation, we would run through all validation rules
  // and check for rule satisfaction
  
  return results;
}

/**
 * Create a crosswalk between source and target nodes
 * @param {Object} source - Source node
 * @param {Object} target - Target node
 * @returns {Promise<Object>} - Created crosswalk
 */
async function createCrosswalk(source, target) {
  // Basic crosswalk structure
  const crosswalk = {
    id: `crosswalk-${Date.now()}`,
    source: {
      nodeType: source.type,
      identifier: source.id
    },
    target: {
      nodeType: target.type,
      identifier: target.id
    },
    type: 'Standard-to-Standard', // Default type
    mappings: [],
    metadata: {
      creator: 'system',
      created: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: 'draft',
      version: '1.0.0'
    },
    validationMethods: []
  };
  
  // In a real implementation, we would analyze the source and target
  // to automatically suggest mappings based on similarities
  
  return crosswalk;
}

// Set up message handler for the worker
self.addEventListener('message', async event => {
  const { action, payload } = event.data;
  
  try {
    switch (action) {
      case 'CREATE_NODE': {
        const node = new Node(
          payload.id, 
          payload.type, 
          payload.metadata
        );
        
        if (payload.attributes) {
          Object.entries(payload.attributes).forEach(([key, value]) => {
            node.addAttribute(key, value);
          });
        }
        
        self.postMessage({ 
          success: true, 
          node: node.toJSON() 
        });
        break;
      }
      
      case 'VALIDATE_NODE': {
        const results = await validateNode(payload.node);
        self.postMessage({ 
          success: true, 
          results 
        });
        break;
      }
      
      case 'CREATE_CROSSWALK': {
        const crosswalk = await createCrosswalk(
          payload.source, 
          payload.target
        );
        self.postMessage({ 
          success: true, 
          crosswalk 
        });
        break;
      }
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    self.postMessage({ 
      success: false, 
      error: error.message 
    });
  }
});

// src/api/index.js
/**
 * OpenPermit API - Client interface for the OpenPermit framework
 * @module api
 */

/**
 * OpenPermit API client
 */
class OpenPermit {
  /**
   * Create a new OpenPermit client
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      workerPath: './core/worker.js',
      ...options
    };
    
    this.worker = null;
    this.callbacks = new Map();
    this.callbackId = 0;
  }
  
  /**
   * Initialize the client
   * @returns {Promise<void>}
   */
  async init() {
    if (this.worker) return;
    
    // Create worker
    this.worker = new Worker(this.options.workerPath);
    
    // Set up message handler
    this.worker.addEventListener('message', event => {
      const { callbackId, ...data } = event.data;
      
      if (callbackId && this.callbacks.has(callbackId)) {
        const { resolve, reject } = this.callbacks.get(callbackId);
        
        if (data.success) {
          resolve(data);
        } else {
          reject(new Error(data.error || 'Unknown error'));
        }
        
        this.callbacks.delete(callbackId);
      }
    });
    
    // Wait for worker to be ready
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  /**
   * Send a message to the worker
   * @param {string} action - Action to perform
   * @param {Object} payload - Action payload
   * @returns {Promise<Object>} - Response from worker
   */
  async sendMessage(action, payload = {}) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const callbackId = ++this.callbackId;
      
      this.callbacks.set(callbackId, { resolve, reject });
      
      this.worker.postMessage({
        callbackId,
        action,
        payload
      });
    });
  }
  
  /**
   * Create a new node
   * @param {Object} options - Node options
   * @returns {Promise<Object>} - Created node
   */
  async createNode(options) {
    const response = await this.sendMessage('CREATE_NODE', options);
    return response.node;
  }
  
  /**
   * Validate a node
   * @param {Object} node - Node to validate
   * @returns {Promise<Object>} - Validation results
   */
  async validateNode(node) {
    const response = await this.sendMessage('VALIDATE_NODE', { node });
    return response.results;
  }
  
  /**
   * Create a crosswalk between source and target nodes
   * @param {Object} source - Source node
   * @param {Object} target - Target node
   * @returns {Promise<Object>} - Created crosswalk
   */
  async createCrosswalk(source, target) {
    const response = await this.sendMessage('CREATE_CROSSWALK', { source, target });
    return response.crosswalk;
  }
}

// Export for browser and Node.js environments
if (typeof window !== 'undefined') {
  window.OpenPermit = OpenPermit;
} else if (typeof module !== 'undefined') {
  module.exports = { OpenPermit };
}

// example/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OpenPermit Node Framework Demo</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.5;
      margin: 0;
      padding: 20px;
      color: #333;
      max-width: 1000px;
      margin: 0 auto;
    }
    pre {
      background: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
      overflow: auto;
    }
    button {
      background: #0066cc;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 8px;
      margin-bottom: 8px;
    }
    button:hover {
      background: #0052a3;
    }
    .output {
      margin-top: 20px;
    }
    h1 {
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
    }
  </style>
</head>
<body>
  <h1>OpenPermit Node Framework Demo</h1>
  
  <div>
    <button id="createNodeBtn">Create Node</button>
    <button id="validateNodeBtn">Validate Node</button>
    <button id="createCrosswalkBtn">Create Crosswalk</button>
  </div>
  
  <div class="output">
    <h3>Output:</h3>
    <pre id="output"></pre>
  </div>
  
  <script src="../src/api/index.js"></script>
  <script>
    // Demo script
    document.addEventListener('DOMContentLoaded', async () => {
      const outputEl = document.getElementById('output');
      const client = new OpenPermit({
        workerPath: '../src/core/worker.js'
      });
      
      // Initialize client
      await client.init();
      
      // Set up button handlers
      document.getElementById('createNodeBtn').addEventListener('click', async () => {
        try {
          outputEl.textContent = 'Creating node...';
          
          const node = await client.createNode({
            id: `node-${Date.now()}`,
            type: 'RequirementNode',
            metadata: {
              name: 'Seismic Requirements for Fire Protection Systems',
              description: 'Requirements for seismic bracing of fire protection systems',
              version: '1.0.0',
              source: 'https://codes.iccsafe.org/content/IBC2021P2',
              domain: 'FireProtection'
            },
            attributes: {
              applicability: 'All Seismic Design Categories C through F',
              codeSection: 'Section 717',
              year: 2021
            }
          });
          
          outputEl.textContent = JSON.stringify(node, null, 2);
        } catch (error) {
          outputEl.textContent = `Error: ${error.message}`;
        }
      });
      
      document.getElementById('validateNodeBtn').addEventListener('click', async () => {
        try {
          outputEl.textContent = 'Validating node...';
          
          // Create a node to validate
          const node = await client.createNode({
            id: `node-${Date.now()}`,
            type: 'RequirementNode',
            metadata: {
              name: 'Seismic Requirements',
              description: 'Requirements for seismic design'
            }
          });
          
          // Validate the node
          const results = await client.validateNode(node);
          
          outputEl.textContent = JSON.stringify(results, null, 2);
        } catch (error) {
          outputEl.textContent = `Error: ${error.message}`;
        }
      });
      
      document.getElementById('createCrosswalkBtn').addEventListener('click', async () => {
        try {
          outputEl.textContent = 'Creating crosswalk...';
          
          // Create source node
          const source = await client.createNode({
            id: `source-${Date.now()}`,
            type: 'StandardNode',
            metadata: {
              name: 'IBC 2021',
              description: 'International Building Code 2021'
            }
          });
          
          // Create target node
          const target = await client.createNode({
            id: `target-${Date.now()}`,
            type: 'StandardNode',
            metadata: {
              name: 'NFPA 13',
              description: 'Standard for the Installation of Sprinkler Systems'
            }
          });
          
          // Create crosswalk
          const crosswalk = await client.createCrosswalk(source, target);
          
          outputEl.textContent = JSON.stringify(crosswalk, null, 2);
        } catch (error) {
          outputEl.textContent = `Error: ${error.message}`;
        }
      });
    });
  </script>
</body>
</html>

// README.md
# OpenPermit Node Framework

This repository contains the core implementation of the AI-Enabled Node Ontological Framework for OpenPermit. The framework provides self-defining nodes to crosswalk between digital and physical domains with truth-seeking AI validation at intersection points.

## Core Components

### Node Structure

The framework defines a self-contained node structure that includes:

- Core identity attributes
- Relationship definitions
- Validation rules
- AI interface specifications

### Crosswalk Mechanism

Crosswalks enable mapping between different domains:

- Standard-to-standard mappings
- Digital-to-digital connections
- Digital-to-physical pathways
- Physical-to-digital transformations

### AI Validation

The framework includes an AI validation interface for:

- Compliance verification
- Recommendation generation
- Explanation production
- Truth-seeking validation

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/sheetpros/openpermit.git
cd openpermit

# Install dependencies
npm install
```

### Basic Usage

```javascript
// Initialize the OpenPermit client
const client = new OpenPermit();
await client.init();

// Create a node
const node = await client.createNode({
  id: 'node-123',
  type: 'RequirementNode',
  metadata: {
    name: 'Seismic Requirements',
    description: 'Requirements for seismic design'
  }
});

// Validate a node
const results = await client.validateNode(node);

// Create a crosswalk
const crosswalk = await client.createCrosswalk(sourceNode, targetNode);
```

### Running the Demo

Open `example/index.html` in a web browser to see a basic demonstration of the framework.

## Development

### Project Structure

- `src/core/` - Core implementation of the node framework
- `src/api/` - Client API for interacting with the framework
- `example/` - Example usage and demos

### Building for Production

```bash
# Build the library
npm run build
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the [MIT License](LICENSE).
