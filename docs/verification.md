# Baseline verification

Verified locally on November 9, 2026 using Node 22.2.0 and pnpm 9.15.9.

- `pnpm test:all`: 26 unit/component tests passed, production type check and Vite build passed, 6 Playwright tests passed across desktop Chromium and mobile Chromium emulation.
- Playwright checks map paths, county selection and details, county dropdown, mobile document width, 2026 labeling and the Westchester reporting warning, and no external runtime requests.
- `pnpm audit`: no known vulnerabilities after updating Vite to 6.4.6, Vitest to 4.1.12, and Playwright to 1.65.0.
- Rebuilding raw data with the final preparation script produced byte-identical normalized files; reconciliation assertions and tests verify exact source totals.
- Issue seeder dry-run returned exactly 28 titles; no GitHub issues were posted.
- Formatted TypeScript, TSX, CSS, JSON, and configuration checked with temporary Prettier. The app requires no formatter installation to run.
- Devcontainer setup script passed `bash -n`. A real container build and GitHub Codespaces rehearsal were not possible here because Docker and a configured GitHub repository were absent.
- Desktop visual inspection confirmed authentic county shapes, coherent results/spotlight layout, and explicit unofficial 2026 labeling. Preview image: `docs/atlas-preview.png`.

Not verified externally: live GitHub Actions, branch rules/CODEOWNERS, agent installation inside a new Codespace, personal agent authentication, production deployment, and PR previews. See `instructor-guide.md` and `deployment.md` to configure and rehearse these before class.

Data provenance: the full New York Focus public feed response is now retained locally. All 62 governor counties reconcile with the feed statewide section and the independent BOE statewide transcription at November 9, 2026, 9:10:02 p.m. ET. Exact party-line, write-in, blank, void, ballot, and district totals are in `data/processed/governor-2026-reconciliation.json`. Current-result views use 2026; the historical section explicitly uses certified 2022 as a provisional same-office comparison. Westchester’s positive votes and 0/906 reporting discrepancy are preserved and explained. These checks establish arithmetic consistency, not certification or independent county-canvass verification.


Analytical feature verification: county net votes reconcile to the independent +1,203,501 statewide difference; historical comparisons cover all 62 FIPS and explicitly distinguish 2022 Zeldin from 2026 Blakeman; circle area follows candidate votes with no inflated minimum. Shared selection is tested through map modes, contribution rows, historical rows, and the existing views. Visual desktop/mobile checks confirmed readable provisional labels and separate map circles (minimum observed gap between any two symbols exceeded 3 SVG units). The mobile historical chart uses a full-width scale so endpoint markers remain distinguishable. Browser tests also compare actual rendered map and legend circle diameters at both viewport sizes, protecting against mismatched SVG scaling. No new raw results, extrapolated votes, or external runtime requests were introduced.

Analytical preview: `docs/atlas-analysis-preview.png`. The main preview shows the publication header and statewide results in `docs/atlas-preview.png`.


The publication redesign replaces the cream/green theme and promotional copy with a white newspaper layout, direct chart headings, black rules, neutral controls, and a shared blue/red data palette. Existing domain, linked-selection, and legend-scale tests remain in place. Browser headline and map-control expectations use the updated wording. Raw data, metric definitions, thresholds, and candidate aggregation are unchanged. Desktop and mobile visual previews are refreshed in the same documentation image files.
