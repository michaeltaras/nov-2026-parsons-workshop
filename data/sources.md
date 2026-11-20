# Data sources and release notes

Acquired November 19-20, 2026 (America/New_York). All runtime data is committed. No result is synthetic.

## 2026 governor — unofficial county and statewide snapshot (active release)

- Original publisher: New York State Board of Elections (BOE), https://nyenr.elections.ny.gov/HomeNoJS.aspx. The BOE describes these as unofficial, incomplete election-night results.
- Acquisition intermediary: New York Focus, https://nysfocus.com/interactives/2026-election-results/governor/. Its public `results.js` describes an ingest worker that copies the BOE reporting pages and serves `api/results`, which the page refreshes every minute. This project does **not** refresh live.
- Feed URL: https://nysfocus.com/interactives/2026-election-results/api/results
- Acquired November 20, 2026 through the public JSON URL. The complete response was saved without parsing/reformatting to `raw/nysfocus-results-2026-11-19.json`. Direct command-line requests were accessible for this snapshot. This preserves JSON response text, not HTTP headers or a byte-for-byte network archive.
- SHA-256 of retained response text: `e642c10e649eac834269124822f1478f34cbf3e919b6ab376efccf64ea0a3d6b`.
- Election ID 45. Source `updatedISO`: `2026-11-19T20:40:36.000Z` = **November 19, 2026, 3:40:36 p.m. ET**. Feed `receivedAt`: `2026-11-20T02:00:30.867Z` = November 19, 9:00:30 p.m. ET. The latter is the intermediary's ingestion timestamp, not a new election count. Source views have their own ingestion metadata in the retained full response. The full response includes other contests and race calls; this app imports **only the governor race** and makes no race call.

### Independent statewide verification

The newer snapshot has not been independently cross-checked against a downloadable BOE statewide export. BOE contest pages and export endpoints were unavailable or returned 403/500 responses during acquisition. The BOE transcription retained in `raw/governor-2026-statewide.csv` is from the older November 9 snapshot and must not be used as a cross-check for this newer release.

| Metric | Sum of 62 counties | Feed statewide | Difference |
| --- | ---: | ---: | ---: |
| Hochul · Democratic | 3,257,462 | 3,257,462 | 0 |
| Hochul · Working Families | 373,912 | 373,912 | 0 |
| Blakeman · Republican | 2,138,945 | 2,138,945 | 0 |
| Blakeman · Conservative | 234,598 | 234,598 | 0 |
| Blakeman · Vote Affordable | 40,697 | 40,697 | 0 |
| Write-ins | 12,794 | 12,794 | 0 |
| Blank | 57,647 | 57,647 | 0 |
| Void | 5,379 | 5,379 | 0 |
| All ballots | 6,121,434 | 6,121,434 | 0 |
| Districts reporting | 12,076 | 12,076 | 0 |
| Total districts | 13,187 | 13,187 | 0 |

Candidate totals: Hochul/Adams **3,631,374**, Blakeman/Hood **2,414,240**, write-ins **12,794**. All candidate votes: **6,058,408**. These totals reconcile exactly within the retained feed; they do not establish certification or completeness.

### Transformations and checks

`prepare-data.py` extracts `races.governor`. Full ticket names map explicitly to `hochul` and `blakeman`. Each party line becomes one ballot-line record; the feed's already aggregated candidate `votes` is used only for validation, never added to the lines. Write-ins are a separate identity. Blank/void counts remain outside the candidate denominator.

The sole county-name exception is `St.Lawrence` → Census `St. Lawrence`. All 62 source names must join to unique Census FIPS; no counties are estimated, allocated, dropped, or duplicated. Each county's candidate lines must equal its candidate totals, and named candidates plus write-ins, blanks, and voids must equal its ballot total. County party-line sums must match the feed's statewide section. District counts and noncandidate categories must reconcile as well. A timestamp change requires explicit source review in the script.

Outputs: `processed/governor-2026.json`, `processed/governor-2026-statewide.json`, and `processed/governor-2026-reconciliation.json`. Runtime uses these local files, never the external feed. The historical comparison imports the certified 2022 governor dataset as an explicit baseline. The map, contribution arithmetic, and main overview continue to show the same unofficial 2026 snapshot.

### Reporting limitations that must stay visible

- All results are unofficial. Full district reporting does not imply certification or that all valid ballots have been counted.
- District reporting is source-specific and must be read alongside the candidate totals without interpreting it as a vote-count percentage.
- **Westchester has positive votes (228,579 Hochul; 117,281 Blakeman; 450 write-ins) alongside 0/906 districts reporting.** Both are source values. Do not drop those votes, infer no votes were counted, or silently repair the reporting field. The BOE separately warns of unscanned emergency Election Day ballots in Westchester. The county panel and overview preserve this warning.
- All feed county `partial` flags are false. We retain that flag as `sourcePartial` without treating it as certification or complete district reporting. The raw flag and reporting counts have distinct meanings; the source does not provide a sufficient definition to infer vote completion.
- Districts reporting is not the share of votes counted. The closest-county ranking is provisional and can change as counts change.
- The feed exposes blank/void values of zero in some counties. They are preserved as source-reported zeros, not independently verified claims that no blank/void ballots occurred.
- The source page warns that absentee, affidavit, and military ballots counted after election night are excluded. The snapshot does not establish complete inclusion of these ballot categories; no final turnout or winner is inferred.

## 2022 governor baseline — certified, county level

- Publisher: New York State Board of Elections.
- Contest and official document links: https://results.elections.ny.gov/contest/1
- Download: https://ny.elstats.civera.com/api/download_contest/1_table.csv?split_party=true
- Original downloaded bytes: `raw/governor-2022.csv`. Two header rows precede the statewide row and 62 county rows. Numeric totals do not contain thousands separators.
- The contest links official canvass documents, including `2022-11-08-General-Concatenated.pdf`, page 35. The database export is treated as certified historical results.
- Hochul/Delgado: Democratic plus Working Families. Zeldin/Esposito: Republican plus Conservative. Each ballot line is counted exactly once; the aggregate candidate total is never added again.
- Scattering becomes the aggregate `write-in` identity. Blank and void are retained separately. Original totals reconcile to 5,962,278 ballots, including 5,912,286 candidate votes. Candidate totals: Hochul 3,140,415; Zeldin 2,762,581; write-ins 9,290.
- Used only for the explicitly labeled historical comparison. Output: `processed/governor-2022.json`; the preparation script verifies each county's ballot total and all four statewide party-line sums.

## Geography — authentic Census cartographic boundaries

- Publisher: U.S. Census Bureau, 2023 Cartographic Boundary Files, county layer at **1:5,000,000**.
- Documentation: https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.2023.html
- Original ZIP: https://www2.census.gov/geo/tiger/GENZ2023/kml/cb_2023_us_county_5m.zip
- Stored unchanged at `raw/cb_2023_us_county_5m.zip`, including Census metadata. Script reads the KML, filters STATEFP 36, retains FIPS GEOID and county name, extracts polygon rings, rounds coordinates to 5 decimal places, and reverses ring winding for D3 spherical rendering. No county is dropped or invented.
- Output: `geography/ny-counties.json`, 62 features; joined by five-character FIPS after an exact source-name-to-Census-name match during preparation. Tests enforce uniqueness and complete joins. Coordinates are geographic longitude/latitude. Display uses a New York conic conformal projection.
- Generalized cartographic coastlines are suitable for statewide display, not surveying or precinct analysis. Small NYC counties are hard to target; the dropdown provides an alternative. 2023 geometry is used for the 2026 county display; this release does not claim district-level comparability.

## Definitions and limitations

Candidate share = candidate's fusion-aggregated votes / all candidate votes including write-ins × 100. Signed margin = Hochul share minus named Republican share. The county spotlight names the leader using the sign; charts compare percentage points. Closest counties are sorted by absolute margin. A tie is neutral; missing results are gray and never coerced to a tie. Empty denominators return null.

No registration-based turnout calculation, population rate, or precinct inference is included. The historical section compares certified 2022 with incomplete 2026 and does not infer individual voter switching or a final partisan swing. Rounding may cause displayed shares not to sum to exactly 100%. Land area is not voter population; the map caption and vote-share comparison explain this limitation. Source status describes the dataset, not an independent certification by this project.

To reproduce: `pnpm data:prepare`, `pnpm test`, `pnpm build`. To update: preserve a dated raw source, document publisher/status/denominators, change the script explicitly, rebuild, reconcile totals, and review all consumers. Do not overwrite 2022 with 2026 while retaining historical labels.


## Analytical encodings added to this release

**County contribution:** Hochul candidate votes minus Blakeman candidate votes. Positive values favor Hochul; negative values favor Blakeman. Each fusion ballot line enters its candidate total once. Write-ins, blank, and void ballots are not added to either named candidate. The county differences sum to **1,217,134** reported net votes statewide, matching the retained feed's county and statewide candidate totals. This is a within-feed reconciliation, not an independent verification. These are differences, not counts of all votes cast in those groups. The default chart shows the four largest contributions in each direction on one symmetric scale; expansion reveals all 62 ordered by absolute magnitude. The displayed statewide arithmetic always includes all counties.

**Historical comparison:** same office (governor/lieutenant-governor ticket), same county FIPS, certified 2022 versus the dated unofficial 2026 snapshot. Both years use all candidate votes including write-ins as their share denominator and exclude blanks/voids. The 2022 Republican identity is explicitly `zeldin`, not `blakeman`. A county's margin change is its 2026 D−R share margin minus its 2022 D−R share margin, in percentage points. Its net-vote change is its 2026 named-candidate vote difference minus the 2022 named-candidate vote difference. Its candidate-vote volume change is reported 2026 candidate votes minus certified 2022 candidate votes. These three quantities answer different questions; none is a turnout rate or proof of individual vote switching. Different candidates/running mates, incomplete ballot inclusion, and possible later revisions limit interpretation. County results alone do not identify a cause. Missing baselines or missing named-candidate results return unavailable, never a fabricated zero change. The statewide historical baseline sums all 62 certified counties; its share margin is computed from summed votes, never from an unweighted average of county percentages.

**Vote-circle map:** circle area is proportional to all reported candidate votes, including write-ins and excluding blanks/voids. Radius = 34 × sqrt(candidate votes / 500,000) in the SVG's coordinate units; the size legend uses the same function. Zero votes would produce zero radius; no minimum visible radius inflates small counties. Size represents reported votes, not population, registration, or turnout. Circle colors retain the current 2026 percentage-point margin scale. A seeded, stopped D3 collision layout displaces symbols to avoid overlap; guide lines connect each symbol to its projected county centroid, and authentic county boundaries remain visible as a reference. This is a displaced proportional-symbol representation, not a claim that the circle centers are exact county locations. Keyboard selection and the county dropdown remain available in either map mode. The fixed snapshot and Westchester warning apply to all derived views.
