"""Rebuild local JSON using committed raw sources and Python's standard library."""

import csv
import json
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
KML_NAMESPACE = {"k": "http://www.opengis.net/kml/2.2"}


def write_json(relative_path, data, compact=False):
    options = {"separators": (",", ":")} if compact else {"indent": 2}
    (ROOT / relative_path).write_text(json.dumps(data, **options) + "\n")


# Census KML includes the whole country. Retain only New York's county shapes.
with zipfile.ZipFile(ROOT / "data/raw/cb_2023_us_county_5m.zip") as archive:
    document = ET.fromstring(archive.read("cb_2023_us_county_5m.kml"))

features = []
for place in document.findall(".//k:Placemark", KML_NAMESPACE):
    properties = {}
    for item in place.findall(".//k:SimpleData", KML_NAMESPACE):
        properties[item.attrib["name"]] = item.text
    if properties.get("STATEFP") != "36":
        continue

    polygons = []
    for polygon in place.findall(".//k:Polygon", KML_NAMESPACE):
        rings = []
        for ring in polygon.findall(".//k:LinearRing", KML_NAMESPACE):
            coordinate_text = ring.findtext("k:coordinates", namespaces=KML_NAMESPACE)
            coordinates = []
            for point in coordinate_text.split():
                longitude, latitude = point.split(",")[:2]
                coordinates.append([round(float(longitude), 5), round(float(latitude), 5)])
            # D3 spherical outer rings are clockwise; KML outer rings are counterclockwise.
            # Reversing every ring also preserves the opposite winding of interior holes.
            rings.append(list(reversed(coordinates)))
        polygons.append(rings)

    features.append({
        "type": "Feature",
        "id": properties["GEOID"],
        "properties": {"name": properties["NAME"], "fips": properties["GEOID"]},
        "geometry": {"type": "MultiPolygon", "coordinates": polygons},
    })

assert len(features) == 62, f"Expected 62 counties, found {len(features)}"
write_json("data/geography/ny-counties.json", {
    "type": "FeatureCollection", "features": features,
}, compact=True)

# The BOE export uses county names; resolve them exactly once to stable Census FIPS.
fips_by_name = {}
for feature in features:
    fips_by_name[feature["properties"]["name"]] = feature["id"]

with (ROOT / "data/raw/governor-2022.csv").open() as source:
    # The first two rows are candidate names and party-line headers.
    rows = list(csv.reader(source))[2:]

counties = []
for row in rows:
    if row[0] != "County":
        continue
    county_name = row[1]
    counts = list(map(int, row[2:]))
    democratic, working_families, republican, conservative, write_in, blank, void, ballots = counts
    assert sum(counts[:7]) == ballots, f"Ballot total mismatch: {county_name}"

    # Retain each ballot line. Runtime aggregation groups them by candidate identity.
    counties.append({
        "fips": fips_by_name[county_name],
        "name": county_name,
        "status": "certified",
        "ballotLines": [
            {"candidate": "hochul", "party": "DEM", "votes": democratic},
            {"candidate": "hochul", "party": "WOR", "votes": working_families},
            {"candidate": "zeldin", "party": "REP", "votes": republican},
            {"candidate": "zeldin", "party": "CON", "votes": conservative},
            {"candidate": "write-in", "party": "", "votes": write_in},
        ],
        "blank": blank,
        "void": void,
    })

for index, party in enumerate(["DEM", "WOR", "REP", "CON"]):
    county_sum = sum(county["ballotLines"][index]["votes"] for county in counties)
    official_state_sum = int(rows[0][index + 2])
    assert county_sum == official_state_sum, f"Statewide reconciliation failed: {party}"
write_json("data/processed/governor-2022.json", counties)

# 2026 is a transcribed, fixed statewide snapshot, not a county dataset or live feed.
with (ROOT / "data/raw/governor-2026-statewide.csv").open() as source:
    lines = list(csv.DictReader(source))

ballot_lines = []
non_candidate_counts = {}
for line in lines:
    count = int(line["votes"])
    if line["candidate"] in ["blank", "void"]:
        non_candidate_counts[line["candidate"]] = count
    else:
        ballot_lines.append({
            "candidate": line["candidate"], "party": line["party"], "votes": count,
        })

assert sum(int(line["votes"]) for line in lines) == 6111361
write_json("data/processed/governor-2026-statewide.json", {
    "year": 2026,
    "status": "unofficial",
    "timestamp": "November 9, 2026 · 9:10 p.m. ET",
    "districtsReporting": 12199,
    "districtsTotal": 13187,
    "ballotLines": ballot_lines,
    "blank": non_candidate_counts["blank"],
    "void": non_candidate_counts["void"],
})
print("Prepared 62 counties, authentic boundaries, and the 2026 statewide snapshot.")
