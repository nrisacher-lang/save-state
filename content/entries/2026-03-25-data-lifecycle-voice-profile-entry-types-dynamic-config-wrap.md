---
date: "2026-03-25"
project: save-state
session: "Data lifecycle — voice profile, entry types, dynamic config, /wrap"
tags: [infrastructure, tooling, feature]
type: session
---

## Features

- Data lifecycle plan finalized — 6-step system for keeping Save State current without manual upkeep
- Voice profile created — reference document at `references/voice-profile.md` encoding writing patterns and few-shot examples for AI-generated entries
- Entry type system added — frontmatter now supports `type: session | ship | debut` with backward-compatible defaulting for existing entries
- `/wrap` skill built — session-closing ceremony that saves memory, drafts a voice-matched entry, and commits on approval

## Infrastructure

- `config.ts` deleted — `PROJECT_NAMES` and `PROJECT_COLORS` replaced with live Supabase lookups across `EntryCard`, `EntryList`, `RecentActivity`, and `entries.ts`
- `scripts/new-entry.ts` updated — project IDs fetched dynamically from Supabase at runtime, no hardcoded list
- Entry type defaulting added to `getAllEntries()` — missing `type` field resolves to `session` at read time

## Lessons

- Save State had no data lifecycle — entries, feature statuses, and project metadata were write-once with no mechanism to stay current
- The staleness problem is structural, not behavioral — fixing it requires automation with a human approval gate, not just better habits
- Voice matching requires two layers: explicit rules and few-shot examples — abstract rules alone don't produce consistent output
- Hardcoded maps create invisible maintenance debt — the cost isn't visible until a new project silently breaks the UI

## TODO

- Continue data lifecycle plan: Steps 4–6 remain (`/ship` skill, visual treatment for ship/debut entries, guardrails + cleanup)
