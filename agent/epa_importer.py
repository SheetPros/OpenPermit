"""Importer for EPA XML files.

This script parses an EPA permit XML document and converts it to
OpenPermit Node Framework (NFL) dictionaries compatible with the
schemas in ``openpermit/standards/epa-permitting/schema``.

The original version only extracted the permit identifier and name.
This implementation expands the mapping to additional fields and adds
basic validation and error handling.
"""

import json
import sys
import xml.etree.ElementTree as ET


class ParseError(Exception):
    """Raised when the XML document is missing required fields."""


def _require_text(element, tag):
    """Return the text of ``tag`` under ``element`` or raise ``ParseError``."""

    text = element.findtext(tag)
    if text is None:
        raise ParseError(f"Missing required element '{tag}'")
    return text.strip()


def parse_xml(path):
    """Parse an EPA permit XML file into a Python dict."""

    try:
        tree = ET.parse(path)
    except (ET.ParseError, FileNotFoundError) as exc:
        raise ParseError(f"Unable to parse XML: {exc}") from exc

    root = tree.getroot()

    ident_elem = root
    if root.tag != "PermitIdentification":
        ident_elem = root.find("PermitIdentification")
    if ident_elem is None:
        raise ParseError("Missing PermitIdentification element")

    permit_id = _require_text(ident_elem, "PermitIdentifier")
    permit_name = _require_text(ident_elem, "PermitName")

    data = {
        "identifier": permit_id,
        "name": permit_name,
        "program": ident_elem.findtext("PermitProgram"),
        "type": ident_elem.findtext("PermitType"),
        "epaTag": "PermitIdentification",
    }

    admin_elem = root.find("PermitAdministration")
    if admin_elem is not None:
        admin_data = {
            "applicationCompleteDate": admin_elem.findtext(
                "ApplicationCompleteDate"
            ),
            "issueDate": admin_elem.findtext("IssueDate"),
            "effectiveDate": admin_elem.findtext("EffectiveDate"),
            "status": admin_elem.findtext("Status"),
            "epaTag": "PermitAdministration",
        }
        if any(v is not None for k, v in admin_data.items() if k != "epaTag"):
            data["admin"] = admin_data

    return data

def convert_to_nfl(data):
    """Convert parsed data into a minimal NFL JSON-LD structure."""

    permit_node = {
        "type": "permit.core",
        "data": {
            "identifier": data.get("identifier"),
            "name": data.get("name"),
            "program": data.get("program"),
            "type": data.get("type"),
            "epaTag": "PermitIdentification",
        },
    }

    identifier = data.get("identifier")
    if identifier:
        permit_node["@id"] = f"urn:openpermit:permit:{identifier}"

    nodes = [permit_node]

    admin = data.get("admin")
    if admin:
        admin_node = {"type": "permit.admin", "data": admin}
        if identifier:
            admin_node["@id"] = f"urn:openpermit:permit:{identifier}#administration"
        nodes.append(admin_node)

    return {
        "@context": "https://openpermit.org/schemas/nfl/v1",
        "nodes": nodes,
    }

def main():
    if len(sys.argv) != 2:
        print("Usage: epa_importer.py <permit.xml>", file=sys.stderr)
        sys.exit(1)
    try:
        permit = parse_xml(sys.argv[1])
        nfl_doc = convert_to_nfl(permit)
    except ParseError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)
    json.dump(nfl_doc, sys.stdout, indent=2)

if __name__ == "__main__":
    main()
