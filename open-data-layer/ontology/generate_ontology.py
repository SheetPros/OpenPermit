"""Generate a small example ontology.

The ontology is defined using simple Python data structures.  By default the
output is Turtle, but a JSON-LD representation can also be produced.
Running this script will create ``open_data_ontology.owl`` in the same
directory unless an alternate output path is supplied.
"""

from pathlib import Path
import json

# Basic class and property definitions used to build the ontology
CLASSES = {
    "Permit": "A permit record.",
    "Applicant": "An applicant for a permit.",
}

PROPERTIES = [
    {
        "name": "hasApplicant",
        "domain": "Permit",
        "range": "Applicant",
        "comment": "Links a permit to its applicant.",
    }
]

PREFIXES = """@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix : <http://open-permit.org/ontology/> .
"""


def build_ontology() -> str:
    """Return the ontology as a Turtle string."""
    lines = [PREFIXES]
    for name, comment in CLASSES.items():
        lines.extend([
            f":{name} a owl:Class ;",
            f"    rdfs:label \"{name}\" ;",
            f"    rdfs:comment \"{comment}\" .",
            "",
        ])
    for prop in PROPERTIES:
        lines.extend([
            f":{prop['name']} a owl:ObjectProperty ;",
            f"    rdfs:domain :{prop['domain']} ;",
            f"    rdfs:range :{prop['range']} ;",
            f"    rdfs:label \"{prop['name'].replace('_', ' ')}\" ;",
            f"    rdfs:comment \"{prop['comment']}\" .",
            "",
        ])
    return "\n".join(lines)


def build_ontology_jsonld() -> str:
    """Return the ontology as a JSON-LD string."""
    graph = []
    for name, comment in CLASSES.items():
        graph.append({
            "@id": name,
            "@type": "owl:Class",
            "rdfs:label": name,
            "rdfs:comment": comment,
        })
    for prop in PROPERTIES:
        graph.append({
            "@id": prop["name"],
            "@type": "owl:ObjectProperty",
            "rdfs:domain": {"@id": prop["domain"]},
            "rdfs:range": {"@id": prop["range"]},
            "rdfs:label": prop["name"].replace("_", " "),
            "rdfs:comment": prop["comment"],
        })
    data = {
        "@context": {
            "@vocab": "http://open-permit.org/ontology/",
            "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
            "owl": "http://www.w3.org/2002/07/owl#",
        },
        "@graph": graph,
    }
    return json.dumps(data, indent=2)


def main(output: str = "open_data_ontology.owl", fmt: str = "turtle") -> None:
    """Write the ontology to ``output`` in the requested format."""
    if fmt == "jsonld":
        text = build_ontology_jsonld()
    else:
        text = build_ontology()
    Path(output).write_text(text, encoding="utf-8")
    print(f"Wrote {fmt} ontology to {output}")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Generate the Open Permit ontology")
    parser.add_argument(
        "output",
        nargs="?",
        default="open_data_ontology.owl",
        help="Path to the output file",
    )
    parser.add_argument(
        "--format",
        choices=["turtle", "jsonld"],
        default="turtle",
        help="Output format",
    )
    args = parser.parse_args()
    main(args.output, args.format)
