# Working on New York Election Results

Prioritize readable, explicit React and TypeScript. Keep changes focused on the issue. Do not perform unrelated refactors, add abstractions, or add dependencies without a concrete need.

Preserve election accuracy. Never fabricate real results or allocate statewide votes to counties. Do not silently change the contracts in `src/data/elections.ts`. Fusion lines are summed once per candidate; shares include write-ins and exclude blank/void ballots. A margin is a percentage-point difference, never turnout. Preserve status, source date, and year labels.

Before changing shared logic, inspect its consumers: map, legend, statewide results, county details, comparisons, contributions, and historical changes. Explain assumptions and cross-feature effects in the PR. Keep raw sources separate from normalized data. If data changes, update `data/sources.md`, run `pnpm data:prepare`, and check the reconciliation tests.

Use the committed Oxlint and Prettier configurations. Run `pnpm lint` and `pnpm format:check` before submitting changes; use `pnpm lint:fix` and `pnpm format` for automatic fixes. Keep any lint suppression narrow and explain why it is needed. Do not format raw or generated election data.

Run relevant tests; for shared changes use `pnpm test` and `pnpm build`. For interaction changes also use `pnpm test:e2e`. Do not weaken tests merely to make CI pass. Check mobile layout and keyboard navigation. Historical comparisons must explicitly use the correct Republican identity for each year, preserve certified-2022 versus incomplete-2026 labels, and distinguish share margins, net votes, and vote volume. Circle areas and their legend share one square-root radius scale. Prefer changes a peer can review in a few minutes. Never commit credentials, `.env` files, or agent login state.
