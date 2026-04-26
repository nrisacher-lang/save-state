---
date: "2026-04-25"
project: current-os
session: "CLAUDE.md restructured — manifest index, five reference docs"
tags: [tooling, infrastructure, refactor]
type: session
---

## Features

- CLAUDE.md reduced from 546 to 115 lines — detailed specs extracted into five focused docs under `docs/`
- `docs/architecture.md` — full subsystem specs: gravity layout, items table, triage, capture, mobile, PWA, AI intake engine, context engine, home projects, AI API, infra principle, and component file map
- `docs/phases.md` — all phase completion tables (MVP through PI-6) and plan/vision document links consolidated in one place
- `docs/widgets.md` — per-widget behavioral specs: Calendar, Week, NowPlaying, Queue, Lyrics, Affirmations, DailyBrief, Lists
- `docs/effects.md` — breathing glow rAF loop, title line glow, header spark, ambient canvas, WidgetCard two-div structure
- `docs/aesthetic.md` — palettes, 3-tier font system, card/button specs, mode treatments, Cybernetic Nature direction
- CLAUDE.md now uses a manifest-style reference table with "read before..." triggers — lean index loads each session, detail files read on demand

## Infrastructure

- Peer reference updated — ClaudeVault decommissioned; brother replaced full FastAPI + PostgreSQL + Redis app with declarative YAML manifest approach (same pattern as `agent.yaml` in everything-claude-code)
- Global CLAUDE.md: background agent Write restriction documented in Known Environment Patterns

## Lessons

- Monolithic CLAUDE.md loads into every session regardless of what's being touched — modular docs eliminate noise; a background task on animations shouldn't carry 200 lines of phase history
- The manifest pattern (declarative index + "read before..." triggers) is the right abstraction — same principle as `agent.yaml` in ECC: discovery surface without runtime overhead
- Background agents spawned with `run_in_background: true` can't Write new files — permission is restricted; all new-file creation goes in the main session thread
- `everything-claude-code` evaluated and declined — 183 skills, most for stacks not in use, overlaps heavily with custom setup; valuable as a pattern reference, not an install target
