---
date: "2026-04-06"
project: save-state
session: "Taproot onboarded — add-project script, entry cohesion audit"
tags: [infrastructure, tooling]
type: session
---

## Features

- `add-project` script ships — registers new projects via CLI flags, no Supabase dashboard required
- `add-project` writes both Supabase row and `globals.css` CSS variable in one command — full project setup autonomous
- Entry cohesion audit complete — 9 entries corrected across all projects: missing `type` fields, unapproved tags, wrapped bullets, Taproot description formatting
- Step 4.5 added to `/wrap` — samples 2–3 existing entries of the same type before drafting to prevent style drift going forward

## Bug Fixes

- `add-project.ts` initially skipped `globals.css` — project color never written; detected when Taproot card showed no color on the project grid; fixed by porting `ensureCssVariable` logic from `upsert-project.ts`
- Taproot description stored with literal `\n\n` instead of actual newlines — paragraphs not breaking; corrected via Supabase service role update

## Infrastructure

- `scripts/add-project.ts` created — CLI-flag interface (`--id`, `--name`, `--tagline`, `--description`, `--tech`, `--color`) for automation-friendly project creation; sort_order auto-detected from existing max
- `npm run add-project` registered in `package.json` alongside `npm run new-entry`

## Lessons

- New scripts should read existing ones before duplicating logic — `upsert-project.ts` was already handling Supabase + CSS together; `add-project.ts` missed that step until the color gap surfaced
- Entry drift accumulates silently — the audit found 6 missing `type` fields and 3 unapproved tags spread across 9 entries over a month of writing without a sampling step to catch it
