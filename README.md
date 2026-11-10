# The 2026 Election Atlas

An interactive New York election explorer for the Parsons data visualization club. Explore all 62 counties, candidate vote shares, close county margins, and the relationship between geography and the popular vote.

**Data release:** all views use an **unofficial 2026 governor snapshot**, updated November 9 at 9:10 p.m. ET. All 62 county totals reconcile exactly with the statewide totals, including fusion party lines, write-ins, blanks/voids, and district counts. The app is a fixed snapshot, not a live feed. Westchester reports votes alongside 0/906 districts reporting and has an incomplete-ballot warning. Historical 2022 data remains archived for future work. [Sources and definitions](data/sources.md).

## Open in Codespaces

On your GitHub repository, choose **Code → Codespaces → Create codespace on main**. Wait for the container setup to finish. It installs Node 22, pnpm, GitHub CLI, Codex CLI, Claude Code, dependencies, and Chromium. Requires a GitHub account with repository access and available Codespaces quota. The instructor must first upload this project to GitHub; see [instructor setup](docs/instructor-guide.md).

## Start an agent

In the terminal run `codex` or `claude`, then follow its sign-in instructions using your own account. An eligible plan or billing arrangement is required; a Codespace does not include AI access. For Codex on a remote terminal, `codex login --device-auth` can be used if browser login is unavailable and your account permits it. Never paste credentials into a PR or commit login files. If agent access fails, pair with someone or edit directly; the app needs no AI credentials. [Codex CLI](https://learn.chatgpt.com/docs/codex/cli) · [Claude setup](https://code.claude.com/docs/en/setup).

## Run the application

```bash
pnpm dev
```

Open forwarded port **5173**. For local development, install Node 22 and pnpm 9.15.9, then run `pnpm install --frozen-lockfile` first. The app runs entirely in the browser with bundled local data; no API or account is required. Installation and agent use require internet. `pnpm build` produces static files in `dist/`; `pnpm preview` previews them.

## Run tests

```bash
pnpm test                 # domain and component tests
pnpm build                # type check and production build
pnpm exec playwright install chromium  # once locally; container does this for you
pnpm test:e2e             # desktop and mobile browser tests
pnpm test:all             # all of the above checks
```

`pnpm data:prepare` reproducibly rebuilds normalized JSON and New York GeoJSON from committed raw files, using only Python 3's standard library. No network request is made. [Architecture](docs/architecture.md) explains where changes propagate.

## Contribute a PR

1. Choose and claim an issue; discuss unclear product decisions with another participant.
2. `git switch -c your-name/short-description`
3. Ask your agent to read `AGENTS.md`, inspect the issue, and make a focused change.
4. Review the diff yourself. Run relevant tests and try another affected view.
5. `git add <changed-files>` then `git commit -m "Describe the change"`
6. `git push -u origin HEAD` then `gh pr create --fill`
7. Request one peer review and the instructor review. Respond to feedback, then merge when checks and required reviews pass.

Your branch and PR are shared work: coordinate when touching colors, calculations, selection, or layout. [Workshop guide](docs/workshop-guide.md) · [Backlog: 28 issues](docs/workshop-issues.md) · [Collaboration](docs/collaboration.md) · [Product brief](docs/product.md).

The workshop thesis: AI lowers the cost of producing code. Communication, judgment, review, and shared ownership still belong to us.
