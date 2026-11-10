#!/usr/bin/env bash
set -euo pipefail
# Pin the package manager; install agent commands, never credentials.
npm install --global pnpm@9.15.9 @openai/codex @anthropic-ai/claude-code
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium
printf '\nReady. Run pnpm dev, codex, or claude. Authenticate agents with your own account.\n'
