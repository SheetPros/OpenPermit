# Workflow Overview

This section outlines the typical permit lifecycle described in this repository.
The design is influenced by open‑source projects such as the [fs‑open‑forest‑platform](https://github.com/USDAForestService/fs-open-forest-platform) and similar municipal solutions.

## Steps
1. **Application Submission** – A user submits an `Application` with required documents and fees.
2. **Review and Approval** – The authority reviews the `Application` and either approves or rejects it. When approved, a `Permit` is issued.
3. **Inspections** – During the life of a `Permit`, one or more `Inspection` records may be scheduled to ensure compliance.
4. **Closure** – After all `Inspections` pass and conditions are met, the `Permit` is closed or renewed as needed.

Each step corresponds to entities in `ontology`:
- `Application` captures submission metadata such as status and associated documents.
- `Permit` represents the authorization issued after an approved application.
- `Inspection` tracks field verification events linked back to a permit.

## Extending the JSON-LD
1. Open the file [`ontology.json`](../ontology.json) to see the existing class structure.
2. Add new properties under the relevant class.
3. If new relationships are needed, append them in the `relationships` list.
4. Validate your JSON‑LD with tools in `open-data-layer/schema/` (e.g., `validate_schema.py`).

This framework uses JSON‑LD contexts so you can combine BLDS, IFC, CityJSON and other vocabularies.  Extend the `@context` array in your data to link additional schemas and maintain interoperability.
