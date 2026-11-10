# Baseline verification

Verified locally on November 9, 2026 using Node 22.2.0 and pnpm 9.15.9.

- `pnpm test:all`: 14 unit/component tests passed, production type check and Vite build passed, 4 Playwright tests passed across desktop Chromium and mobile Chromium emulation.
- Playwright checks map paths, county selection and details, county dropdown, mobile document width, year isolation, and no external runtime requests.
- `pnpm audit`: no known vulnerabilities after updating Vite to 6.4.6, Vitest to 4.1.12, and Playwright to 1.65.0.
- Rebuilding raw data with the final preparation script produced byte-identical normalized files; reconciliation assertions and tests verify exact source totals.
- Issue seeder dry-run returned exactly 28 titles; no GitHub issues were posted.
- Formatted TypeScript, TSX, CSS, JSON, and configuration checked with temporary Prettier. The app requires no formatter installation to run.
- Devcontainer setup script passed `bash -n`. A real container build and GitHub Codespaces rehearsal were not possible here because Docker and a configured GitHub repository were absent.
- Desktop visual inspection confirmed authentic county shapes, coherent results/spotlight layout, and explicit historical labeling. Preview image: `docs/atlas-preview.png`.

Not verified externally: live GitHub Actions, branch rules/CODEOWNERS, agent installation inside a new Codespace, personal agent authentication, production deployment, and PR previews. See `instructor-guide.md` and `deployment.md` to configure and rehearse these before class.

Data limitation: no verified 2026 county export was acquired. The default county map is certified 2022; the separate 2026 statewide result is an explicitly transcribed unofficial snapshot with its own source timestamp. No current county results or historical swing were inferred.
