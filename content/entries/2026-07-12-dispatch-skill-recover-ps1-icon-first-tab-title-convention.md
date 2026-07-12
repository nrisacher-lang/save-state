---
date: "2026-07-12"
project: claude-code
session: "Dispatch skill + recover.ps1 — icon-first tab title convention"
tags: [tooling, infrastructure]
type: session
---

## Features

- `/dispatch` skill reworked — tab title is now the session topic; project identity carried by icon and color alone, no project name in title text
- `recover.ps1` aligned to the same convention — recovery tabs title as `[emoji] Resuming`, new-idea tabs with a prompt title as `[emoji] [topic text]`, no-prompt tabs as `[emoji] /start`
- Multi-tab session launch via inline `$WtArgs` — 4 parallel work tabs opened from a single `/start` session, each with its own per-tab prompt and distinct title

## Infrastructure

- CLAUDE.md gotcha added — `recover.ps1 -Idea` applies one shared prompt to all `-NewIdeas` tabs; direct `$WtArgs` construction required when tabs need different prompts or titles

## Lessons

- Icon + tab color is sufficient to identify a project in Windows Terminal — title text is better used for what the session is actually doing
- `recover.ps1` only supports a single `-Idea` value shared across all projects in `-NewIdeas`; when tabs need per-tab prompts, bypass `recover.ps1` and build the `wt` arg list directly with `$WtArgs.AddRange(...)` per tab
