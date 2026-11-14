# Collaboration and review

Claim an issue before coding. Announce which shared file you expect to change. Read the product brief when the issue leaves a decision open. Work on a short-lived branch, keep one user outcome per PR, and inspect your AI's full diff before asking anyone else to read it.

A useful peer review checks the user outcome, another affected view, source labels, and the tests. Run the branch locally or use a preview deployment. Ask one concrete question when something is unclear. “Looks good” without inspecting behavior is not a review. Leave actionable comments; disagreement about a visualization's purpose is useful evidence, not a merge conflict to resolve mechanically.

## Current workshop settings

Verified on November 14, 2026: public repository, `main` protection requiring the `checks` job, up-to-date branches, two approvals, code-owner review, dismissal of stale approvals, and resolved conversations. Force pushes and branch deletion are blocked. The instructor administrator retains a maintenance bypass. Squash merging is enabled; merge commits and rebase merging are disabled, and merged feature branches are deleted automatically. All 28 workshop issues are labeled by difficulty. Participant access must be granted separately.

## Administrator settings

Protect `main` with a ruleset: require PRs, two approving reviews, code-owner review, dismissal of stale approvals, conversation resolution, and the `checks` status from the Checks workflow. Block force pushes and deletion. Disallow bypass if appropriate. First let Checks run once so GitHub offers the correct status. Never require optional deployment as a merge check.

The committed `.github/CODEOWNERS` assigns all files to instructor `@michaeltaras`. Update it if instructor ownership changes. A code owner must have write access. Two required approvals plus required code-owner approval ordinarily gives one instructor and one peer; an instructor approval counts toward the total. If several instructors can approve, facilitate peer participation explicitly.

Later, remove the CODEOWNERS catch-all and disable required code-owner review; reduce required approval count to one peer (or keep two peers if desired). CODEOWNERS alone cannot express instructor plus peer as distinct roles. Confirm actual ruleset behavior with a practice PR and examine organization rules that may override repository settings.

GitHub settings must be verified separately from committed configuration. CI workflows run after files are pushed with Actions enabled. See the instructor guide for deployment and recovery.
