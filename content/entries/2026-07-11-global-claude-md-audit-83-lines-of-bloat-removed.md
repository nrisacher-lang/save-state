---
date: "2026-07-11"
project: claude-code
session: "Global CLAUDE.md audit — 83 lines of bloat removed"
tags: [tooling, refactor]
type: session
---

## Features

- Global CLAUDE.md trimmed from 274 to 191 lines — four categories of bloat identified, proposed, and cut in one pass
- Known Projects Status cells reduced to one sentence + URL — full operational state (trigger IDs, commit hashes, column names) now lives in each project's own CLAUDE.md
- Three empty Work Context placeholder sections removed — Access & Integration, GitHub Adoption, and Reporting Standardization had sat unfilled across many sessions
- Five infra-specific gotcha rows cut from global table — Proxmox terminal patterns, Lore pre-push hook, and n8n manual-trigger belong in project-level CLAUDE.mds, not the global file
- Three stale project entries removed — `agents`, `aesthetic-curator`, and `personal-stylist` had no active work and no CLAUDE.md

## Lessons

- The global gotchas table needs a scope check at promotion time — "would this bite on a project unrelated to this infrastructure?" is the right filter; single-project patterns belong in the project CLAUDE.md regardless of how often they bite in that one context
- Known Projects Status cells have no natural size constraint — they accumulate operational logs over sessions until a hard limit forces a purge; one sentence + URL is the right ceiling
- Placeholder sections that sit empty across multiple sessions should be cut, not carried — "to be added" that persists is the same as not added
