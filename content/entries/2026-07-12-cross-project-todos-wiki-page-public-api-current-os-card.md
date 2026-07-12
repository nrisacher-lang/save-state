---
date: "2026-07-12"
project: understory-labs-site
session: "Cross-project todos — wiki page, public API, Current OS card"
tags: [feature, infrastructure]
type: session
---

## Features

- `getAllTodos()` utility live — reads all `content/wiki/**/*.mdx` at request time, finds `## TODO` / `## Next Steps` sections, parses `- [ ]` / `- [x]` items with bold `**title**` extracted as a separate field
- Wiki todos page at `/wiki/todos` — stats grid (OUTSTANDING / PROJECTS / COMPLETE), per-project cards with item list; auto-gated by existing `proxy.ts` HMAC cookie auth, no extra code needed
- `/api/todos` public endpoint live — CORS-open, no auth required; returns outstanding items grouped by project with display names from Supabase; consumed by life-automation dashboard
- `WikiTodosCard` wired into Current OS — focused variant groups items by project (uppercase label + count + ○ glyph per item); resting variant shows inline project+count badges; footer link to `/wiki/todos`
- Intel: trending research dispatch added — when github-trending enrichment is approved, `dispatchTrendingResearch()` creates a research-request item in the ad-hoc-research source; `penpal-doc` badge type added to `SourceBadge` (purple, `◉ penpal` label)

## Infrastructure

- Todos sidebar entry added as first VIEWS item in `WikiSidebar.tsx` — Todos → Activity → Infra Map → Tech Radar

## Lessons

- `proxy.ts` matcher covers `/wiki/:path*` — new pages under `/wiki/` inherit HMAC auth automatically; no need to add each new route
- Keeping the todos API unauthenticated avoided env var overhead in life-automation; TODO text is non-sensitive and CORS headers are sufficient for a cross-origin React fetch
- `git status` before staging revealed parallel-session intel file changes already on disk — committing them in a separate commit before the todos feature kept the feature commit clean and attribution honest
