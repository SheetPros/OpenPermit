# EPA Permitting Standard Mapping

This folder contains draft JSON-Schema definitions that map the EPA Permitting Information Data Standard to the OpenPermit Node Framework (NFL).

Each schema preserves the original EPA field names via the `epaTag` property to allow round‑tripping from XML.  These schemas are placeholders and will be expanded as the full data model is implemented.

## Schemas

- `permit.core.schema.json`
- `feature.core.schema.json`
- `permit.admin.schema.json`
- `feature.metric.schema.json`
- `methodology.core.schema.json`
- `condition.core.schema.json`
- `reporting.rule.schema.json`
- `monitoring.rule.schema.json`

## Conversion Example

The example below illustrates a very simple transformation from EPA XML to NFL JSON-LD using the importer script in `agent/epa_importer.py`.

Run the command below from the repository root to transform the included sample
permit:

```bash
python agent/epa_importer.py openpermit/standards/epa-permitting/examples/sample_permit.xml > permit.json
```

The resulting JSON-LD document includes an `@context` referencing
`https://openpermit.org/schemas/nfl/v1` and `@id` fields when identifiers
are present. It conforms to the schemas in this directory.
