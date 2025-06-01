# Documentation

This folder contains documentation related to the data layer.

## Ontology usage

The ontology files live in `../ontology`.  Run the generator script to (re)build
`open_data_ontology.owl`:

```bash
python ../ontology/generate_ontology.py ../ontology/open_data_ontology.owl
```

The resulting Turtle file defines a small set of classes and properties that can
be queried using SPARQL.  Example queries are available in
`../ontology/queries.sparql`.

Any SPARQL engine capable of reading Turtle may be used to run the queries, for
example `rdfpipe` from rdflib:

```bash
rdfpipe --input-format turtle ../ontology/open_data_ontology.owl \
    --query ../ontology/queries.sparql
```

To generate the ontology in JSON-LD instead of Turtle, pass the `--format jsonld`
flag and specify a target filename:

```bash
python ../ontology/generate_ontology.py --format jsonld \
    ../ontology/open_data_ontology.jsonld
```
