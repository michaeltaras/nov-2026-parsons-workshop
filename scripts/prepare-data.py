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

# Retain the separate BOE transcription as an independent statewide cross-check.
with (ROOT / "data/raw/governor-2026-statewide.csv").open() as source:
    official_rows = list(csv.DictReader(source))
official_ballot_lines = []
non_candidate_counts = {}
for row in official_rows:
    count = int(row["votes"])
    if row["candidate"] in ["blank", "void"]:
        non_candidate_counts[row["candidate"]] = count
    else:
        official_ballot_lines.append({
            "candidate": row["candidate"], "party": row["party"], "votes": count,
        })
assert sum(int(row["votes"]) for row in official_rows) == 6111361

# New York Focus mirrors the BOE election-night pages. Preserve the complete raw
# response separately; import only governor data and never add candidate totals
# to the party lines that already make up those totals.
with (ROOT / "data/raw/nysfocus-results-2026-11-09.json").open() as source:
    feed = json.load(source)
race = feed["races"]["governor"]
assert feed["updatedISO"] == "2026-11-10T02:10:02.000Z", "Review the source timestamp before replacing this snapshot"
assert len(race["counties"]) == 62, "Governor snapshot must contain all 62 counties"

candidate_ids = {
    "Kathy C. Hochul / Adrienne E. Adams": "hochul",
    "Bruce A. Blakeman / Todd Hood": "blakeman",
}


def normalize_2026_result(result):
    ballot_lines = []
    assert {candidate["name"] for candidate in result["candidates"]} == set(candidate_ids)
    for candidate in result["candidates"]:
        assert sum(line["votes"] for line in candidate["lines"]) == candidate["votes"], "Fusion lines must equal the candidate total"
        for line in candidate["lines"]:
            assert isinstance(line["votes"], int) and line["votes"] >= 0
            ballot_lines.append({
                "candidate": candidate_ids[candidate["name"]],
                "party": line["party"],
                "votes": line["votes"],
            })
    ballot_lines.append({"candidate": "write-in", "party": "", "votes": result["writeIn"]})
    assert sum(line["votes"] for line in ballot_lines) + result["blank"] + result["void"] == result["total"], "Candidate, write-in, blank and void votes must reconcile to ballots"
    assert 0 <= result["reporting"] <= result["districts"]
    return {
        "ballotLines": ballot_lines,
        "blank": result["blank"],
        "void": result["void"],
        "districtsReporting": result["reporting"],
        "districtsTotal": result["districts"],
        # The feed's partial flag is preserved, not interpreted as certification
        # or full district reporting. Westchester has partial=false but 0/906.
        "sourcePartial": result["partial"],
        "status": "unofficial",
        "year": 2026,
        "updatedISO": feed["updatedISO"],
    }


current_counties = []
for source_county in race["counties"]:
    # This is the sole source-name exception; do not broadly strip punctuation.
    name = "St. Lawrence" if source_county["area"] == "St.Lawrence" else source_county["area"]
    county = {"fips": fips_by_name[name], "name": name, **normalize_2026_result(source_county)}
    current_counties.append(county)
assert len({county["fips"] for county in current_counties}) == 62, "Duplicate or missing county FIPS"
assert {county["fips"] for county in current_counties} == set(fips_by_name.values())

current_state = normalize_2026_result(race)
current_state["timestamp"] = "November 9, 2026 · 9:10 p.m. ET"

# Verify counties against the feed's independent statewide section AND our
# separately transcribed official BOE statewide snapshot, at the same timestamp.
checks = []
for official_line in official_ballot_lines:
    identity = (official_line["candidate"], official_line["party"])
    county_sum = sum(
        line["votes"] for county in current_counties for line in county["ballotLines"]
        if (line["candidate"], line["party"]) == identity
    )
    feed_state_sum = sum(
        line["votes"] for line in current_state["ballotLines"]
        if (line["candidate"], line["party"]) == identity
    )
    assert county_sum == feed_state_sum == official_line["votes"], f"2026 statewide party-line mismatch: {identity}"
    checks.append({"metric": ":".join(identity), "countySum": county_sum, "feedStatewide": feed_state_sum, "officialStatewide": official_line["votes"], "difference": 0})

for field, official_value in [
    ("blank", non_candidate_counts["blank"]), ("void", non_candidate_counts["void"]),
    ("districtsReporting", 12199), ("districtsTotal", 13187),
]:
    county_sum = sum(county[field] for county in current_counties)
    assert county_sum == current_state[field] == official_value, f"2026 statewide mismatch: {field}"
    checks.append({"metric": field, "countySum": county_sum, "feedStatewide": current_state[field], "officialStatewide": official_value, "difference": 0})

assert sum(county["total"] for county in race["counties"]) == race["total"] == 6111361
checks.append({"metric": "ballots", "countySum": 6111361, "feedStatewide": race["total"], "officialStatewide": 6111361, "difference": 0})
write_json("data/processed/governor-2026.json", current_counties)
write_json("data/processed/governor-2026-statewide.json", current_state)
write_json("data/processed/governor-2026-reconciliation.json", {
    "updatedISO": feed["updatedISO"], "feedReceivedAt": feed["receivedAt"],
    "counties": len(current_counties), "checks": checks,
})
print("2026 county snapshot reconciles exactly with the feed and official BOE statewide totals.")
