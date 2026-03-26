---
date: "2026-03-25"
project: save-state
session: "/ship skill — shipped"
tags: [feature, tooling]
type: ship
---

## Features

- `/ship` skill ships — marks features as shipped in Supabase and generates voice-matched changelog entries
- Mode A ships existing features: checks current state, confirms, updates Supabase, drafts a `type: ship` entry
- Mode B debuts new projects: gathers details, upserts to Supabase, adds CSS variable, drafts a `type: debut` entry
- `update-feature.ts` and `upsert-project.ts` scripts handle all Supabase writes via service role key
- `--check` flag on `update-feature.ts` queries without mutating — the confirmation layer before any update runs

## Infrastructure

- CSS custom property `--card-project-color` set inline by `Card.tsx` — lets `.card-ship` and `.card-debut` CSS classes reference per-project color without per-project rules
- `color-mix(in srgb, ...)` used for tinted backgrounds and glow shadows — no hardcoded opacity values needed

## Lessons

- Separating check from execute prevents accidental writes — the skill runs `--check` first, then asks, then runs the real command
- Ship/debut visual treatment needs real entries to validate against — build the CSS first, create a test entry second
