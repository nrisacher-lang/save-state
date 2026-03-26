---
date: "2026-03-25"
project: save-state
session: "Data lifecycle complete — /ship, visual treatment, guardrails"
tags: [feature, tooling, infrastructure]
type: session
---

## Features

- `/ship` skill ships — marks features in Supabase and generates voice-matched `type: ship` changelog entries
- Mode A ships existing features: `--check` confirms current state before any write runs; Mode B debuts new projects with full Supabase upsert and debut entry
- Ship/debut visual treatment: full colored border, ambient glow via `color-mix()`, SHIPPED/NEW PROJECT badges, JetBrains Mono 700 title — visually distinct from session cards
- 6 retroactive ship entries created for all historically shipped features across bark, current-os, save-state, and claude-code
- Guardrails complete: `/save` prompts for `/wrap` when commits exist; `/start` flags unlogged sessions; `/health` Section 5.5 checks data freshness and stale in-progress features

## Infrastructure

- `scripts/update-feature.ts` — update or insert Supabase features with `--check` dry-run mode; case-insensitive name matching within a project
- `scripts/upsert-project.ts` — upsert projects to Supabase and auto-add `--project-<id>: <color>;` to `globals.css`
- `Card.tsx` extended with `variant` prop — `--card-project-color` set inline, letting `.card-ship` and `.card-debut` classes reference per-project color without per-project rules
- `seed-projects.ts` deleted — Supabase data now managed via `/ship` and write scripts
- Supabase corrections applied: analytics dashboard marked shipped, all Bark `shipped_date` values corrected to 2026-03-21

## Lessons

- Separating `--check` from the actual update prevents accidental Supabase writes — confirm state first, execute second
- CSS custom properties set inline (`--card-project-color`) are the right pattern for per-instance theming — one class handles all project colors without generating per-project rules
- Session entries and ship entries serve different purposes — retroactive ship entries don't replace session logs, they add a celebration layer that was always missing
- Terminal line-break issues (bash treating wrapped args as separate commands) are a recurring copy-paste hazard — the fix is always one unbroken line before Enter
