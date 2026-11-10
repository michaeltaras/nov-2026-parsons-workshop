# Architecture: local clarity, shared consequences

React + TypeScript + Vite, D3 geographic projection and threshold colors, SVG map, ordinary CSS. No backend, runtime fetch, state store, or authentication. All JSON is imported at build time. Python standard-library data preparation reads committed raw sources; users do not need Python to run the app.

## Find your feature

| Area | Location | Responsibility |
| --- | --- | --- |
| Page composition and selection | `src/App.tsx` | selected FIPS; all result views use the 2026 county/state snapshot |
| Map | `src/features/ElectionMap.tsx` | D3 projection, land/vote-circle modes, hover/focus readout, county labels |
| Spotlight | `src/features/CountyDetails.tsx` | selected county totals and comparison with statewide margin |
| State overview | `src/features/StatewideResults.tsx` | candidate totals, shares, write-ins, popular-vote strip |
| Contributions | `src/features/MarginContributions.tsx` | diverging net-vote bars and all-county statewide arithmetic |
| Historical changes | `src/features/HistoricalChanges.tsx` | connected 2022/2026 margin dots, net-vote and count comparisons |
| Analytical logic | `src/data/analysis.ts` | explicit historical baseline, net votes, county comparisons |
| Vote-circle layout | `src/features/voteCircleLayout.ts` | shared area scale and deterministic, displaced layout |
| Supporting charts | `src/features/Comparisons.tsx` | closest-county ranking and selected county/state bars |
| Legend | `src/components/Legend.tsx` | ordered shared color swatches and threshold labels |
| Data contract and calculations | `src/data/elections.ts` | ballot lines, aggregation, candidate denominator, signed margin, geographic join |
| Shared appearance | `src/utils/electionColors.ts`, `src/utils/formatNumbers.ts` | one scale and number conventions for multiple views |
| Layout | `src/styles/global.css` | editorial system and responsive breakpoints |
| Source processing | `scripts/prepare-data.py` | raw CSV/KML → normalized JSON; reconciliation assertions |

## Relationships worth reviewing

`App` owns one selected county FIPS, passes it to map/details/comparisons/contributions/history, and passes one setter to every selectable chart and the dropdown. Hover is local to the map and does not change selection. All views use the same 2026 governor snapshot. The separate analytical module imports certified 2022 governor results for an explicit same-office comparison. Adding other years or offices requires an explicit contract and labeling review.

`aggregateVotes` groups candidate identities across fusion lines. `candidateVoteTotal`, `share`, and `margin` feed all result surfaces. A denominator change affects the headline, map, ranking, and comparison. The raw source's total-votes column includes blank/void, which our candidate denominator excludes. Do not change one chart independently.

`electionColor` and its shared palette power map paths and ranked bars; the legend imports the same color array. The map communicates signed share margin with thresholds at ±5, ±15, ±30 and zero. True ties use a neutral fill; missing data uses gray. If thresholds change, update legend labels and integration tests together. Details and overview use shared candidate colors. A palette change can affect contrast elsewhere.

`formatNumbers` controls count separators, share rounding, and margin labels across every surface. The tooltip is an inline map readout plus native SVG title; extracting a shared tooltip should have a real second consumer, not an artificial abstraction. Shared components are intentionally modest: the legend and state overview are concrete, with ordinary feature components and CSS variables rather than a generic chart framework.

County source names are matched once to Census names in preparation. Runtime uses five-character FIPS. Data tests check 62 unique counties and a complete join; unmatched data must not silently disappear. A missing named candidate returns null margin; no-results is distinct from a true tie.

## Validation map

- `tests/unit/elections.test.ts`: fusion, exact source totals, invalid counts, denominators, incomplete data, ties, FIPS joins, formatters, threshold boundaries.
- `tests/integration/app.test.tsx`: shared selection, keyboard/picker, consistent legend/map colors, current data/status labeling and the Westchester reporting discrepancy.
- `tests/e2e/atlas.spec.ts`: browser startup, map selection, selected details, picker, mobile width, current snapshot, zero external runtime requests.
- CI rebuilds normalized data and fails if committed outputs differ, then runs unit/component tests, production build, desktop and mobile browser tests.

The structure permits normal overlapping changes. Before touching a shared file, check who else owns a related issue. Don't avoid shared behavior merely to avoid merge conflicts; discuss the contract and keep PRs reviewable.

## 2026 import and reconciliation

`data/raw/nysfocus-results-2026-11-09.json` preserves the complete public feed response. `prepare-data.py` extracts only the governor race, maps full ticket names to candidate IDs, retains each party line once, adds write-ins separately, and carries district counts, source partial flag, timestamp, and unofficial status into normalized data. The source’s `St.Lawrence` maps explicitly to Census `St. Lawrence`; all other names must match exactly.

`Result` retains the vote contract. `County` now also requires year, update timestamp, district reporting counts, and the source partial flag. The default margin challenger is `blakeman`. County details and comparisons use the independent `statewide2026` snapshot, rather than defining statewide results by summing counties at runtime. The preparation script and tests independently verify that those sums match. Historical calculations must pass the correct challenger explicitly.

The preparation script checks every candidate’s party lines, each county’s ballot identity, 62 unique matching FIPS, county sums against the feed’s statewide section, and the separate BOE CSV transcription. It writes `governor-2026-reconciliation.json`. CI reproduces that report along with the datasets. `sourcePartial: false` does not mean complete: Westchester retains positive votes and 0/906 district reporting. The UI preserves this discrepancy, explains it, and never infers turnout or vote completion from district counts.


## Three editorial questions, one shared county

`netVotes` computes the named-candidate difference, while `margin` computes a share difference including write-ins in its denominator. `summarizeContributions` keeps positive and negative county net votes separate; the contribution chart shows the arithmetic against the independent statewide result. The default list shows four largest contributions per direction, while the expand control shows all 62. Each side uses the same scale. Changing candidate aggregation affects both this chart and the existing overview.

`compareCounty` joins certified 2022 by FIPS, explicitly uses Zeldin for the old Republican identity and Blakeman for the new one, and returns share-margin, net-vote, and candidate-vote-volume differences separately. The historical chart uses one fixed −100 to +100 percentage-point domain for both years. It orders by absolute margin change and keeps the selected county visible outside the top eight. Missing comparisons return null. The historical baseline's statewide margin is derived from summed votes rather than averaged county shares.

`voteCircleRadius` is the sole size contract for map symbols and the size legend. Radius grows with the square root of candidate votes, preserving proportional area. Map and size-legend SVGs use the same 810-unit viewBox width and the same rendered container width; sharing a radius function alone would not preserve on-screen sizes. A seeded D3 force layout runs synchronously to completion; no timers or animation remain active. It shifts symbols away from collisions and bounds them inside the SVG. Guide lines retain the connection to geographic centroids. Rendering switches geometry without changing selected FIPS, color semantics, or vote denominator. Do not change symbol sizes independently of the legend or silently substitute registered voters/population.

`tests/unit/analysis.test.ts` protects contribution additivity, historical candidate identities/denominators, missing-data behavior, circle-area proportionality, and deterministic collision placement. Integration and browser tests select from each new view, switch map modes, and verify selection reaches the other views on desktop and mobile. The provisional historical comparison warning is a tested part of the product, not optional decoration.
