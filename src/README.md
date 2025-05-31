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

Load `src/api/index.js` in your page and use the client API:

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

```
src/
  core/
    constants.js  - Constant definitions
    node.js       - Node class implementation
    worker.js     - Web Worker logic
  api/
    index.js      - Client API
example/
  index.html      - Demo page
```

### Building for Production

```bash
# Build the library
npm run build
```

### Running Tests

Execute the JavaScript unit tests with:

```bash
npm test
```

### Development Scripts

Common helper commands are defined in `package.json`:

```bash
npm run build   # build the library
npm run lint    # lint source code
npm run serve   # start the demo server
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the [MIT License](LICENSE).
