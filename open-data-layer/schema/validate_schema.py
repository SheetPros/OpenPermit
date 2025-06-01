"""Validate sample JSON files against minimal JSON Schemas."""

import json
import os
import sys

try:
    from jsonschema import validate, ValidationError
except Exception:  # jsonschema not installed
    class ValidationError(Exception):
        pass

    def _validate_type(value, expected_type, key):
        if expected_type == "string" and not isinstance(value, str):
            raise ValidationError(f"Field '{key}' must be a string")
        if expected_type == "number" and not isinstance(value, (int, float)):
            raise ValidationError(f"Field '{key}' must be a number")
        if expected_type == "integer" and not isinstance(value, int):
            raise ValidationError(f"Field '{key}' must be an integer")
        if expected_type == "boolean" and not isinstance(value, bool):
            raise ValidationError(f"Field '{key}' must be a boolean")
        if expected_type == "array" and not isinstance(value, list):
            raise ValidationError(f"Field '{key}' must be an array")
        if expected_type == "object" and not isinstance(value, dict):
            raise ValidationError(f"Field '{key}' must be an object")

    def validate(instance, schema, *, _key="root"):
        """Very small subset of JSON Schema validation with recursion."""
        expected_type = schema.get("type")
        if expected_type:
            _validate_type(instance, expected_type, _key)

        if "enum" in schema and instance not in schema["enum"]:
            raise ValidationError(
                f"Field '{_key}' must be one of {schema['enum']}"
            )

        if expected_type == "object":
            for field in schema.get("required", []):
                if field not in instance:
                    raise ValidationError(
                        f"Missing required field '{field}' in '{_key}'"
                    )
            props = schema.get("properties", {})
            for key, rules in props.items():
                if key in instance:
                    validate(instance[key], rules, _key=key)

        if expected_type == "array":
            item_schema = schema.get("items")
            if item_schema:
                for idx, item in enumerate(instance):
                    validate(item, item_schema, _key=f"{_key}[{idx}]")

SCHEMAS = {
    "blds.jsonld": {
        "type": "object",
        "properties": {
            "id": {"type": "string"},
            "status": {"type": "string"},
            "submittedDate": {"type": "string"}
        },
        "required": ["id", "status", "submittedDate"]
    },
    "ifc.jsonld": {
        "type": "object",
        "properties": {
            "ifcVersion": {"type": "string"},
            "entities": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "type": {"type": "string"},
                        "id": {"type": "string"}
                    },
                    "required": ["type", "id"]
                }
            }
        },
        "required": ["ifcVersion", "entities"]
    },
    "geojson.json": {
        "type": "object",
        "properties": {
            "type": {"enum": ["Feature"]},
            "geometry": {
                "type": "object",
                "properties": {
                    "type": {"type": "string"},
                    "coordinates": {"type": "array"}
                },
                "required": ["type", "coordinates"]
            },
            "properties": {"type": "object"}
        },
        "required": ["type", "geometry", "properties"]
    },
    "iso20022.jsonld": {
        "type": "object",
        "properties": {
            "amount": {"type": "string"},
            "currency": {"type": "string"}
        },
        "required": ["amount", "currency"]
    }
}


def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    all_valid = True
    for fname, schema in SCHEMAS.items():
        path = os.path.join(base_dir, fname)
        with open(path) as f:
            data = json.load(f)
        if isinstance(data, dict) and "@context" in data:
            data = {k: v for k, v in data.items() if k != "@context"}
        try:
            validate(data, schema)
            print(f"{fname}: VALID")
        except Exception as exc:  # catch ValidationError or fallback
            all_valid = False
            print(f"{fname}: INVALID - {exc}")
    if not all_valid:
        sys.exit(1)


if __name__ == "__main__":
    main()
