from pathlib import Path
import importlib.util

import pytest

EPA_IMPORTER_PATH = Path(__file__).resolve().parents[2] / "agent" / "epa_importer.py"
spec = importlib.util.spec_from_file_location("epa_importer", EPA_IMPORTER_PATH)
epa_importer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(epa_importer)

SAMPLE_XML = Path('openpermit/standards/epa-permitting/examples/sample_permit.xml')


def test_parse_and_convert_sample():
    # Parse the sample XML and convert to NFL JSON
    permit = epa_importer.parse_xml(SAMPLE_XML)
    nfl = epa_importer.convert_to_nfl(permit)

    # Ensure required fields are present
    assert permit['identifier'] == 'TEST-123'
    assert permit['name'] == 'Sample Permit'

    # Converted JSON should have a permit.core node with those fields
    core = nfl['nodes'][0]
    assert core['type'] == 'permit.core'
    data = core['data']
    assert data['identifier'] == 'TEST-123'
    assert data['name'] == 'Sample Permit'


def _write_temp_xml(tmp_path, content):
    path = tmp_path / 'permit.xml'
    path.write_text(content)
    return path


def test_missing_identifier_raises(tmp_path):
    xml = """<PermitIdentification><PermitName>Sample</PermitName></PermitIdentification>"""
    path = _write_temp_xml(tmp_path, xml)
    with pytest.raises(epa_importer.ParseError):
        epa_importer.parse_xml(path)


def test_missing_permit_identification_raises(tmp_path):
    xml = """<Root></Root>"""
    path = _write_temp_xml(tmp_path, xml)
    with pytest.raises(epa_importer.ParseError):
        epa_importer.parse_xml(path)
