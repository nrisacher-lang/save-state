---
date: "2026-06-03"
project: claude-code
session: "Switchboard — shipped"
tags: [infrastructure, tooling]
type: ship
---

## Features

- Switchboard ships — session registry and VS Code terminal profile automation for Claude Code
- Sessions register automatically on every prompt and close on stop, surviving machine restarts and surfacing orphaned sessions at `/start` with compact context
- Terminal profiles generated from Supabase project config — 54 profiles total (3 per project, 3 per template type), written to VS Code settings and namespace-isolated from manually-defined profiles
- `/switchboard` skill added for manual intervention: `refresh`, `status`, `clear`, and `config` subcommands

## Infrastructure

- `switchboard-register.js` (UserPromptSubmit hook): registers session, fires daily Supabase pull via separate trigger guard so registration runs against existing data
- `switchboard-close.js` (Stop hook): marks session ended, captures compact summary from JSONL transcript
- `switchboard-pull.js`: fetches project config from Supabase REST API using pure `https.request` — no npm deps in `~/.claude/scripts/`
- `switchboard-profiles.js`: generates and merges VS Code terminal profiles; backs up `settings.json` on first write
- `sync-wiki-state.ts` updated — field-notes and peer added to `PROJECT_PATHS` (12 projects now synced)

## Bug Fixes

- `findSessionByProject` fallback was closing any open session regardless of project — fixed to resolve cwd → project ID first, then match sessions by project
- Timestamps stored as UTC ISO caused date to flip after ~8 PM EDT — fixed to local ISO 8601 with UTC offset throughout

## Lessons

- Daily guard files for trigger and success should be separate: writing the "triggered" marker before firing the pull lets the session register against yesterday's data while the pull refreshes in the background
- Supabase anon key silently writes 0 rows when RLS blocks an UPDATE — no error, no exception; initial data migration required manual SQL in the editor
- Namespace isolation by naming convention (`/ \[[a-z-]+\]$/`) is cleaner than tracking which profiles were generated — adding or removing projects requires no state reconciliation
