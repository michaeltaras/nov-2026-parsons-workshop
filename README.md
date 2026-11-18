# 2026 New York Governor Election Results

An interactive New York election explorer for the Parsons data visualization club. Explore how counties contribute to the statewide margin, compare reported results with certified 2022 governor results, and switch from land area to circles sized by candidate votes. All three views share one county selection.

**Data release:** current-result views use an **unofficial 2026 governor snapshot**, updated November 9 at 9:10 p.m. ET. All 62 county totals reconcile exactly with the statewide totals, including fusion party lines, write-ins, blanks/voids, and district counts. The app is a fixed snapshot, not a live feed. Westchester reports votes alongside 0/906 districts reporting and has an incomplete-ballot warning. A clearly labeled comparison uses certified 2022 governor results as its baseline. [Sources and definitions](data/sources.md).

[Live results](https://michaeltaras.github.io/nov-2026-parsons-workshop/) · [Workshop issues](https://github.com/michaeltaras/nov-2026-parsons-workshop/issues) · [Open a Codespace](https://codespaces.new/michaeltaras/nov-2026-parsons-workshop)

## Open in Codespaces

Open [the workshop repository](https://github.com/michaeltaras/nov-2026-parsons-workshop), then choose **Code → Codespaces → Create codespace on main**. Wait for the container setup to finish. It installs Node 22, pnpm, GitHub CLI, Codex CLI, Claude Code, dependencies, and Chromium. Requires a GitHub account with repository access and available Codespaces quota. See [instructor setup](docs/instructor-guide.md) for access and review requirements.

## Start an agent

In the terminal run `codex` or `claude`, then follow its sign-in instructions using your own account. An eligible plan or billing arrangement is required; a Codespace does not include AI access. For Codex on a remote terminal, `codex login --device-auth` can be used if browser login is unavailable and your account permits it. Never paste credentials into a PR or commit login files. If agent access fails, pair with someone or edit directly; the app needs no AI credentials. [Codex CLI](https://learn.chatgpt.com/docs/codex/cli) · [Claude setup](https://code.claude.com/docs/en/setup).

## Run the application

```bash
pnpm dev
```

Open forwarded port **5173**. For local development, install Node 22.23.4 (see `.tool-versions`) and pnpm 9.15.9, then run `pnpm install --frozen-lockfile` first. The app runs entirely in the browser with bundled local data; no API or account is required. Installation and agent use require internet. `pnpm build` produces static files in `dist/`; `pnpm preview` previews them.

## Code standards and tests

```bash
pnpm lint                 # Oxlint, no warnings allowed
pnpm format:check         # Prettier formatting check
pnpm test                 # domain and component tests
pnpm build                # type check and production build
pnpm exec playwright install chromium  # once locally; container does this for you
pnpm test:e2e             # desktop and mobile browser tests
pnpm test:all             # all of the above checks
```

Use `pnpm lint:fix` for safe automatic lint fixes and `pnpm format` to format files. Oxlint checks JavaScript/TypeScript correctness, React hooks, JSX accessibility, unused code, explicit types, braces, and import consistency; strict TypeScript checks run during the build. The rules live in `.oxlintrc.json`; formatting lives in `.prettierrc.json` and `.editorconfig`. Raw and generated election data are excluded from formatting. Python data preparation remains covered by the reconciliation tests. CI runs lint, formatting, tests, and the build. Codespaces includes the Oxlint and Prettier editor extensions with formatting on save.

`pnpm data:prepare` reproducibly rebuilds normalized JSON and New York GeoJSON from committed raw files, using only Python 3's standard library. No network request is made. [Architecture](docs/architecture.md) explains where changes propagate.

## Contribute a PR

1. Choose and claim [a workshop issue](https://github.com/michaeltaras/nov-2026-parsons-workshop/issues); discuss unclear product decisions with another participant.
2. `git switch -c your-name/short-description`
3. Ask your agent to read `AGENTS.md`, inspect the issue, and make a focused change.
4. Review the diff yourself. Run relevant tests and try another affected view.
5. `git add <changed-files>` then `git commit -m "Describe the change"`
6. `git push -u origin HEAD` then `gh pr create --fill`
7. Request one peer review and the instructor review. Respond to feedback, then merge when checks and required reviews pass.

Your branch and PR are shared work: coordinate when touching colors, calculations, selection, or layout. [Workshop guide](docs/workshop-guide.md) · [Backlog: 28 issues](docs/workshop-issues.md) · [Collaboration](docs/collaboration.md) · [Product brief](docs/product.md).
