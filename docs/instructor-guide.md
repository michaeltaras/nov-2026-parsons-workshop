# Instructor guide

This file is instructor-facing, not access-controlled. A public repository exposes it to students. Move a copy to your private teaching notes if you want the coordination pairs below to remain a surprise; remove that section from the distributed copy. No hidden sabotage or incorrect data is used.

## Before class

The goal is a credible shared product whose ordinary dependencies require communication. AI can generate code quickly; use the workshop to foreground judgment, review, and ownership. Read `data/sources.md` first: county exploration is certified 2022, while 2026 is an unofficial statewide snapshot. Do not tell students the map depicts 2026.

1. Create a GitHub repository in the teaching organization. Upload this folder, including the lockfile and raw data. The delivery includes a local Git baseline on `main`; no GitHub repository, remote, PR, or protection rule has been created automatically. Review the local commit, then use `gh repo create ORG/REPO --source=. --push` with the visibility you intend.
2. Give participants write access through a workshop team. Decide whether external collaborators, forks, and organization policies are compatible with Codespaces and preview deployments. Do not give everyone administrator access.
3. Enable Actions. Run Checks on main; require its `checks` job in a main-branch ruleset. Require pull requests, two approvals, resolved conversations, stale-approval dismissal, no force pushes, and no deletions. Add a real instructor owner in `.github/CODEOWNERS` and require code-owner review. See `collaboration.md` for limitations and why two counts alone do not enforce reviewer roles.
4. Open a fresh Codespace yourself. Wait for `.devcontainer/setup.sh`, run `pnpm test:all`, check `gh --version`, `codex --version`, and `claude --version`. Test private authentication for both agents without committing login state. Codespaces quota, org permissions, network access, and eligible AI plans are external prerequisites. Agent packages are installed at their current release, so record working versions before class or pin tested versions for your event.
5. Configure a static host from `deployment.md`. GitHub Pages can deploy main; Netlify can provide main plus PR previews. Verify a practice PR preview and show the production URL on the projector. No hosting account or live deployment was provisioned by these files.
6. Seed issues: `pnpm issues:seed --repo=ORG/REPO` previews 28 titles; after reviewing, `pnpm issues:seed --repo=ORG/REPO --apply` creates them with `gh`. Sign in to `gh` first and verify the target. Existing exact-title issues are skipped, including closed issues. A renamed issue may be duplicated; inspect the list before rerunning. Optional difficulty labels can be added in GitHub after import. Do not run with an untrusted repository argument.
7. Choose a few smaller issues for newcomers, leave ambiguous issues for product conversations, and pair reviewers across skill levels. Budget time for source review and manual interaction, not just coding.

## During the session

Use `workshop-guide.md` for the 90-minute arc. Require participants to claim issues and describe shared files they expect to change. Ask authors to explain code they submit, including code written by agents. A peer should run or inspect at least one sibling view affected by shared logic.

Start with instructor plus peer approval. Later explain the transfer of ownership, then remove the instructor catch-all from CODEOWNERS and turn off required code-owner review in the ruleset. Set the approval count to one peer, or two peers if the class size supports it. Check organization-level rulesets too; editing this repository cannot override them. Verify with a practice PR before announcing the change.

## Coordination pairs — instructor notes

These pairs are not guaranteed conflicts. They are legitimate overlapping decisions; do not force breakage. The student descriptions identify relevant shared areas without listing every paired issue.

| Issues | Likely tension | Facilitation prompt |
| --- | --- | --- |
| 01 + 02 | Both edit legend layout/copy; precision competes with density | What must someone understand at a glance? |
| 02 + 12 | New palette/thresholds can invalidate legend labels | Who owns the scale contract and the evidence? |
| 03 + 14 | Map hover styling and tooltip behavior/focus can conflict | Which state is hover and which is selection? |
| 04 + 17 | Compact number conventions may obscure exact vote-count chart labels | Where do readers need exact values? |
| 05 + 09 | Mobile selection handoff may move focus away from picker | Who controls focus after selection? |
| 06 + 26 | Initial county defaults can overwrite a URL selection | Which source of state wins on load and history? |
| 07 + 13 | Ranking expansion changes the claim and headline | What is a county comparison versus a race? |
| 11 + 18 | Search focus and map keyboard state may compete | Can readers predict where the next key goes? |
| 15 + 21 | New partial 2026 data needs missing states before rendering | Does absence mean unavailable, zero, or not reported? |
| 16 + 25 | Ballot-line UI may assume fixed candidate identities | Which metadata belongs to the contest? |
| 19 + 23 | Label placement depends on map geometry and inset scale | Can the two PRs share a projection interface? |
| 20 + 27 | Distribution denominators can change under filters | What population does each view summarize? |
| 21 + 22 | Historical change can mix snapshots or partial totals | Is the comparison supported by comparable evidence? |

The shared color, formatter, and calculation modules make independent-looking feature work consequential. Ask reviewers to use architecture.md to trace those relationships. Avoid announcing every conflict in advance; let participants discover normal coordination needs.

## Recovery and facilitation

**Too many people on one component:** keep ownership visible on the board; ask pairs to agree on a shared contract, sequence PRs, or choose separate outcomes. Do not solve every overlap by assigning isolated files; collaboration is part of the exercise.

**CI begins failing:** identify the earliest failing PR or check, reproduce its exact command, and determine whether code, data, or environment changed. Pause merging affected PRs. Do not disable assertions simply to turn the badge green. Upload failed browser traces can help. If CI itself is broken, have a temporary documented manual check and repair CI promptly.

**Someone merges a regression:** acknowledge the user-visible effect. Determine blast radius, then decide together whether a small fix is well understood or whether reverting restores the product faster. Keep the projector on the deployed main so consequences are tangible, without blaming the contributor.

**Revert a merged PR:** use GitHub's Revert button to create a reviewed revert PR. In a terminal, for a merge commit use `git revert -m 1 MERGE_SHA`; for a squash commit use `git revert SQUASH_SHA`, on a new branch. Inspect the commit graph first; do not guess the parent. Run checks and open the revert PR. Never reset/force-push shared main. Reverting code does not undo external source or hosting settings. Later reapply a corrected change in a new PR; explain how the original issue was addressed.

**Two PRs conflict:** bring authors together. Explain the desired final behavior before resolving text. Update one branch from main, resolve shared assumptions, rerun both features' tests, and have the second author review. Do not accept all “ours” or “theirs” without inspection.

**Agent performs an enormous unrelated refactor:** stop before merge. Save the work on the branch, ask for a focused patch, or restore unrelated files using a reviewed diff. Ask the author to explain why each changed file is necessary. Smaller PRs improve learning and reduce review load.

**Agent access fails:** pair with a signed-in participant or work directly in the editor. Do not share credentials or assume subscriptions are interchangeable. Prioritize learning review over troubleshooting billing during class.

**Fix forward versus revert discussion:** How many users are affected? Is the cause understood? Can we test the fix quickly? Did other merges depend on it? Which choice restores trust with the least uncertainty? A revert is a product recovery tool, not a judgment about the person who authored the change.

## Reliability limits

The devcontainer and workflows are configuration deliverables. This environment can validate local app behavior, but creating an actual Codespace and exercising GitHub review rules require a real repository and appropriate permissions. Before your event, run a clean container build and practice the whole branch → PR → review → merge → deploy cycle. Installation uses a pinned pnpm and application lockfile; the Node image major, agent releases, GitHub CLI feature, and Actions major tags can evolve. Freeze tested infrastructure versions if strict event reproducibility is needed.
