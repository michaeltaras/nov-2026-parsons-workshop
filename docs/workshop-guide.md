# Workshop guide

The goal is to discover what collaboration still requires when an agent can produce code quickly. The election results app is a shared product; a technically valid change can still be an unhelpful feature or an inconsistent experience.

## A 90-minute session

1. **0–10 min:** Open the election results app and find something surprising. Identify the displayed year, denominator, and source. Briefly discuss land area versus vote counts.
2. **10–20 min:** Open Codespaces, run `pnpm dev`, and authenticate an agent. Pair up for reviews; choose different issues. Claim your issue and make a branch.
3. **20–45 min:** Ask the agent to read `AGENTS.md` and the issue. Discuss ambiguous requirements with another participant. Make the smallest useful change, review the diff, test an affected sibling view, and open a PR.
4. **45–65 min:** Swap PRs for review. Run the changes or use a preview. Explain what you checked and ask for revisions when needed. Merge with instructor and peer approval.
5. **65–80 min:** Instructor removes their required review. Participants maintain the shared product, coordinate overlapping changes, and decide whether regressions call for a fix or revert.
6. **80–90 min:** Look at the live main branch together. What improved? What became inconsistent? What did the AI fail to know about another person's work?

## A useful agent prompt

“Read AGENTS.md and issue [number]. Explain which shared modules this touches. Implement a focused solution with readable code. Preserve source/year/status labels. Run relevant tests. Tell me what to review and any unresolved product choices.”

Do not assume the generated change is correct because it compiles. You own the decision to request review. If you cannot access an agent, pair or edit directly; the same collaboration workflow applies.

## Before opening a PR

Try your change with another county and on a narrow screen. If shared colors or calculations changed, inspect map, legend, details, statewide overview, and comparison. Keep a screenshot or short explanation of what changed. Ask reviewers to focus on a meaningful uncertainty.
