---
date: "2026-05-31"
project: lore
session: "Lore v2 orientation — architecture briefed, changelog pipeline live"
tags: [infrastructure, tooling]
type: session
---

## Features

- Lore v2 read in full — Rails-Off Redesign (PlaceCanvas, 3-mood system, ritual scheduler) and WhatYouMissed (visit heartbeat, catch-up summaries after 2h+ absence) architecture documented
- `lore-changelog` source live in field-notes pipeline — weekly Gitea commit scan runs every Monday alongside GitHub Trending; enrichment trigger handles analysis automatically
- Architecture briefing written to `field-notes/briefs/lore-v2-briefing.md` — component map, DB schema changes, API routes, socket events, known gaps, and contribution opportunities per area

## Infrastructure

- Local master fast-forwarded 80 commits to v2 state (668ce39) after switching remote from SSH to HTTPS
- Scan handler at `field-notes/app/api/scan/lore-changelog/route.ts` — fetches last 7 days of Gitea commits, inserts as `changelog-entry` items in `fn_intel_items`
- Vercel cron added (`0 13 * * 1`) in `field-notes/vercel.json`; `GITEA_TOKEN` added to Vercel env vars; source record registered in Supabase
- `project_current_state.md` memory overwritten with full v2 state; global CLAUDE.md and lore CLAUDE.md repository section corrected

## Lessons

- SSH key not authorized on harmjoy org for Nicole — HTTPS is the only path; `git fetch` redirects automatically once the remote URL is corrected
- Gitea API returns 404 (not 401) for private repos without auth — looks like a wrong URL but is actually an access issue; `Authorization: token <TOKEN>` header required on every request
- Existing `NATHAN_GITEA_TOKEN` in `peer/.env` already covers `read:repository` scope for harmjoy org — no new token generation needed, value reused as `GITEA_TOKEN`
- Supabase source record must exist before the scan handler can run — handler queries by slug and returns 404 if missing; SQL insert is a required deploy step alongside the code

## TODO

- Run 3 pending Prisma migrations on lore production DB before PlaceCanvas can go live
- Nathan flips `useNewLayout=true` to smoke test PlaceCanvas; Nicole flips when ready
