# Architecture: local clarity, shared consequences

React + TypeScript + Vite, D3 geographic projection and threshold colors, SVG map, ordinary CSS. No backend, runtime fetch, state store, or authentication. All JSON is imported at build time. Python standard-library data preparation reads committed raw sources; users do not need Python to run the app.

## Find your feature

| Area | Location | Responsibility |
| --- | --- | --- |
| Page composition and selection | `src/App.tsx` | selected FIPS and active year; conditionally separates current statewide and historical county views |
| Map | `src/features/ElectionMap.tsx` | D3 projection, paths, hover/focus readout, county labels |
| Spotlight | `src/features/CountyDetails.tsx` | selected county totals and comparison with statewide margin |
| State overview | `src/features/StatewideResults.tsx` | candidate totals, shares, write-ins, popular-vote strip |
| Supporting charts | `src/features/Comparisons.tsx` | closest-county ranking and selected county/state bars |
| Legend | `src/components/Legend.tsx` | ordered shared color swatches and threshold labels |
| Data contract and calculations | `src/data/elections.ts` | ballot lines, aggregation, candidate denominator, signed margin, geographic join |
| Shared appearance | `src/utils/electionColors.ts`, `src/utils/formatNumbers.ts` | one scale and number conventions for multiple views |
| Layout | `src/styles/global.css` | editorial system and responsive breakpoints |
| Source processing | `scripts/prepare-data.py` | raw CSV/KML → normalized JSON; reconciliation assertions |

## Relationships worth reviewing

`App` owns one selected county FIPS, passes it to map/details/comparisons, and passes one setter to map/ranking/dropdown. Hover is local to the map and does not change selection. Race-year choice retains county selection when returning to 2022. There is one governor contest per year; adding other offices requires an explicit contract and labeling review.

`aggregateVotes` groups candidate identities across fusion lines. `candidateVoteTotal`, `share`, and `margin` feed all result surfaces. A denominator change affects the headline, map, ranking, and comparison. The raw source's total-votes column includes blank/void, which our candidate denominator excludes. Do not change one chart independently.

`electionColor` and its shared palette power map paths and ranked bars; the legend imports the same color array. The map communicates signed share margin with thresholds at ±5, ±15, ±30 and zero. True ties use a neutral fill; missing data uses gray. If thresholds change, update legend labels and integration tests together. Details and overview use shared candidate colors. A palette change can affect contrast elsewhere.

`formatNumbers` controls count separators, share rounding, and margin labels across every surface. The tooltip is an inline map readout plus native SVG title; extracting a shared tooltip should have a real second consumer, not an artificial abstraction. Shared components are intentionally modest: the legend and state overview are concrete, with ordinary feature components and CSS variables rather than a generic chart framework.

County source names are matched once to Census names in preparation. Runtime uses five-character FIPS. Data tests check 62 unique counties and a complete join; unmatched data must not silently disappear. A missing named candidate returns null margin; no-results is distinct from a true tie.

## Validation map

- `tests/unit/elections.test.ts`: fusion, exact source totals, invalid counts, denominators, incomplete data, ties, FIPS joins, formatters, threshold boundaries.
- `tests/integration/app.test.tsx`: shared selection, keyboard/picker, consistent legend/map colors, year isolation.
- `tests/e2e/atlas.spec.ts`: browser startup, map selection, selected details, picker, mobile width, current snapshot, zero external runtime requests.
- CI rebuilds normalized data and fails if committed outputs differ, then runs unit/component tests, production build, desktop and mobile browser tests.

The structure permits normal overlapping changes. Before touching a shared file, check who else owns a related issue. Don't avoid shared behavior merely to avoid merge conflicts; discuss the contract and keep PRs reviewable.
