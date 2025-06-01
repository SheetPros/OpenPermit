# Open Data Layer

This directory contains reference materials and sample files for the OpenPermit data layer.
It mirrors the structure described in the project documentation.  Each subfolder
contains placeholder content that can be replaced with real implementations.
The sample `.jsonld` files include a top-level `@context` referencing common
vocabularies.

```
├── schema/
│   ├── blds.jsonld
│   ├── ifc.jsonld
│   ├── iso20022.jsonld
│   ├── geojson.json
│   ├── validation.shacl
│   └── validate_schema.py
├── ontology/
│   ├── open_data_ontology.owl
│   ├── queries.sparql
│   └── generate_ontology.py
├── docs/
│   ├── README.md
│   ├── standards.md
│   └── odata_edm.xml
├── .gitignore
├── LICENSE
└── README.md
```

### Schema Validation

Use `validate_schema.py` to check the example JSON files. The script falls back
to a minimal validator if the [`jsonschema`](https://pypi.org/project/jsonschema/)
package is missing, but installing the real library provides much more complete
coverage. Install the Python dependencies from the project root:

```
pip install -r ../../requirements.txt
```

### Testing

Run the JavaScript unit tests with `npm`:

```bash
npm test
```
