// Preview by default. Explicit --apply creates issues in the chosen repository.
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const args = process.argv.slice(2);
const repository = args.find((arg) => arg.startsWith("--repo="))?.slice(7);
if (!repository || !/^[\w.-]+\/[\w.-]+$/.test(repository)) {
  console.error("Usage: pnpm issues:seed --repo=OWNER/REPO [--apply]");
  process.exit(1);
}
const markdown = readFileSync(
  new URL("../docs/workshop-issues.md", import.meta.url),
  "utf8",
);
const issues = [
  ...markdown.matchAll(
    /^### (\d+)\. (.+)\n([\s\S]*?)(?=^### |^## |$(?![\s\S]))/gm,
  ),
];
if (issues.length !== 28) {
  throw new Error(`Expected 28 issues, found ${issues.length}`);
}
let existing = [];
if (args.includes("--apply")) {
  existing = JSON.parse(
    execFileSync(
      "gh",
      [
        "issue",
        "list",
        "--repo",
        repository,
        "--state",
        "all",
        "--limit",
        "1000",
        "--json",
        "title",
      ],
      { encoding: "utf8" },
    ),
  );
}
for (const [, number, title, body] of issues) {
  const issueTitle = `[Workshop ${number}] ${title}`;
  if (!args.includes("--apply")) {
    console.log(issueTitle);
    continue;
  }
  if (existing.some((issue) => issue.title === issueTitle)) {
    console.log(`Already exists: ${issueTitle}`);
    continue;
  }
  // stdin preserves newlines and avoids interpolating issue content into a shell command.
  execFileSync(
    "gh",
    [
      "issue",
      "create",
      "--repo",
      repository,
      "--title",
      issueTitle,
      "--body-file",
      "-",
    ],
    { input: body.trim(), stdio: ["pipe", "inherit", "inherit"] },
  );
}
