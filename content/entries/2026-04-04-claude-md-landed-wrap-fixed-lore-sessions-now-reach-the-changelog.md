---
date: "2026-04-04"
project: lore
session: "CLAUDE.md landed — /wrap fixed, lore sessions now reach the changelog"
tags: [infrastructure, tooling]
type: session
---

## Features

- CLAUDE.md added to lore repo root — stack, literary terminology, deployment targets, collaboration conventions, and place theme architecture all documented
- Place theme system (Library, Meadow, Tavern) captured as confirmed art direction — `color-mix()` frosted glass pattern included so Nathan's session has it

## Infrastructure

- `/wrap` skill: `lore` added to project mapping table, `git push` added to Step 7 — entries now write, commit, and deploy in one step
- save-state was 5 commits ahead of origin — pushed and deployed, changelog now current through April 3
- Pulled Nathan's Phader voice style system merge — settings page, `phader.ts`, preferences store, 19 files, 4457 insertions

## Lessons

- A missing `git push` in a skill's commit step makes the pipeline invisible — entries were being written and committed locally but never reached the deployed site
- Project directory → ID mapping tables in skills decay silently as projects are added; wire new projects in at setup time, not retroactively

## TODO

- CORS blocker: `lore-drab.vercel.app` origin not whitelisted in Nathan's API — login/register broken on Vercel preview until `EXTRA_ORIGINS` is set on VPS
- Nathan has open branches to check: `add-claude-md`, `docs/claude-md`, `feature/vps-migration`, `merge/phader-plus-place-themes`
