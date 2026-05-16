---
date: "2026-05-16"
project: claude-code
session: "Health check cleanup — five issues closed, zero remaining"
tags: [bug, infrastructure, tooling]
type: session
---

## Bug Fixes

- WeekWidget work mode pill view fixed — `variant === "resting"` early-return fires before `workVisible` check, suppressing the Mon–Fri pill layout whenever the card isn't focused; condition narrowed to `variant === "resting" && !workVisible`
- TypeScript `unknown` errors resolved in `api/project-intake.ts` — `ParsedQuestion` and `ParsedDraft` interfaces added; `JSON.parse()` result cast through typed interfaces instead of accessed raw; `tsc --noEmit` clean

## Infrastructure

- SSH key auth live on docker-host CT 100 — appended via password-auth session; `ssh -o BatchMode=yes` confirms passwordless
- `/log` skill added to toolkit.md — command file existed in `commands/` but was absent from the inventory table
- ISSUE-013 and ISSUE-014 voided — lore codebase scrapped and restarted; original fantasy theme and Android build issues no longer applicable
- Issue log at zero — all five open issues closed in a single session

## Lessons

- Early-returns that precede a mode branch are silent render hijacks — the resting shortcut in WeekWidget suppressed the work pill view without any error or warning
- `claude mcp list` reports "Failed to connect" for GitHub MCP in bash subshell — cosmetic, same pattern as ISSUE-001; GitHub MCP functions normally inside a live Claude Code session
