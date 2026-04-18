---
date: "2026-04-18"
project: save-state
session: "Build fix — output: export removed, analytics force-dynamic restored"
tags: [bug, infrastructure]
type: session
---

## Bug Fixes

- `output: "export"` removed from `next.config.ts` — static export mode blocks any page with `dynamic = "force-dynamic"`, surfacing as a Vercel build error on `/analytics`

## Lessons

- The analytics page's `force-dynamic` is correct: `getAllProjects()` and `getAllFeatures()` hit Supabase at request time, and `todayStr()` makes momentum score, streak, and recency calculations inherently time-sensitive — a static snapshot would go stale immediately
- CLAUDE.md was already ahead of the config ("dynamic SSR — no longer static export") — the stale `output: "export"` was a local uncommitted modification, not a regression in the committed codebase
