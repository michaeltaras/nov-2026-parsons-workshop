# Data sources and release notes

Acquired November 9, 2026 (America/New_York). All runtime data is committed. No result is synthetic.

## 2022 governor — certified, county level

- Publisher: New York State Board of Elections.
- Contest and official document links: https://results.elections.ny.gov/contest/1
- Download: https://ny.elstats.civera.com/api/download_contest/1_table.csv?split_party=true
- Original downloaded bytes: `raw/governor-2022.csv`. Two header rows precede the statewide row and 62 county rows. Numeric totals do not contain thousands separators.
- The contest links official canvass documents, including `2022-11-08-General-Concatenated.pdf`, page 35. The database export is treated as certified historical results.
- Hochul/Delgado: Democratic plus Working Families. Zeldin/Esposito: Republican plus Conservative. Each ballot line is counted exactly once; the aggregate candidate total is never added again.
- Scattering becomes the aggregate `write-in` identity. Blank and void are retained separately. Original totals reconcile to 5,962,278 ballots, including 5,912,286 candidate votes. Candidate totals: Hochul 3,140,415; Zeldin 2,762,581; write-ins 9,290.
- Output: `processed/governor-2022.json`; the preparation script verifies each county's ballot total and all four statewide party-line sums.

## 2026 governor — unofficial statewide only

- Publisher: New York State Board of Elections, https://nyenr.elections.ny.gov/HomeNoJS.aspx
- Retrieved through web page reading on November 9, 2026; page timestamp **11/09/2026 9:10:02 PM**. Other reads during research returned earlier snapshots. Only this single timestamp is used.
- Direct HTTP download returned 403. `raw/governor-2026-source.txt` is an explicitly labeled manual transcription of the source extract, **not an original HTML archive**. `raw/governor-2026-statewide.csv` retains transcribed ballot-line counts. Recheck against an archived official export before replacing or extending this release.
- Hochul/Adams: DEM 3,247,323 + WOR 372,854 = 3,620,177. Blakeman/Hood: REP 2,141,711 + CON 234,340 + Vote Affordable 40,625 = 2,416,676. Write-ins 12,721. Blank 56,513; void 5,274. Ballot total 6,111,361; candidate votes 6,049,574.
- Source percentages include blank/void in their denominator. **Our percentages recalculate shares of candidate votes**, and therefore intentionally differ from the source percentages.
- 12,199 of 13,187 districts reported. This is not the fraction of votes counted. The source warns of unscanned emergency ballots in Westchester. No claim of a final winner or complete canvass is made.
- Output: `processed/governor-2026-statewide.json`. No usable, verifiable county download was acquired in this session; no county estimates were made. This is a fixed snapshot, not a live feed. The certified 2022 explorer is the default to provide a complete county experience with honest labeling.

## Geography — authentic Census cartographic boundaries

- Publisher: U.S. Census Bureau, 2023 Cartographic Boundary Files, county layer at **1:5,000,000**.
- Documentation: https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.2023.html
- Original ZIP: https://www2.census.gov/geo/tiger/GENZ2023/kml/cb_2023_us_county_5m.zip
- Stored unchanged at `raw/cb_2023_us_county_5m.zip`, including Census metadata. Script reads the KML, filters STATEFP 36, retains FIPS GEOID and county name, extracts polygon rings, rounds coordinates to 5 decimal places, and reverses ring winding for D3 spherical rendering. No county is dropped or invented.
- Output: `geography/ny-counties.json`, 62 features; joined by five-character FIPS after an exact source-name-to-Census-name match during preparation. Tests enforce uniqueness and complete joins. Coordinates are geographic longitude/latitude. Display uses a New York conic conformal projection.
- Generalized cartographic coastlines are suitable for statewide display, not surveying or precinct analysis. Small NYC counties are hard to target; the dropdown provides an alternative. 2023 geometry is used for the historical 2022 county display; this release does not claim district-level comparability.

## Definitions and limitations

Candidate share = candidate's fusion-aggregated votes / all candidate votes including write-ins × 100. Signed margin = Hochul share minus named Republican share. The county spotlight names the leader using the sign; charts compare percentage points. Closest counties are sorted by absolute margin. A tie is neutral; missing results are gray and never coerced to a tie. Empty denominators return null.

No registration-based turnout calculation, population rate, precinct inference, or historical swing is included. The two years are separate explorations, not a claim about comparable completion or partisan swing. Rounding may cause displayed shares not to sum to exactly 100%. Land area is not voter population; the map caption and vote-share comparison explain this limitation. Source status describes the dataset, not an independent certification by this project.

To reproduce: `pnpm data:prepare`, `pnpm test`, `pnpm build`. To update: preserve a dated raw source, document publisher/status/denominators, change the script explicitly, rebuild, reconcile totals, and review all consumers. Do not overwrite 2022 with 2026 while retaining historical labels.
