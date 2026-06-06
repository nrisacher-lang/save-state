---
date: "2026-06-06"
project: claude-code
session: "Field Notes end-to-end — pipeline fixed, peer briefing rebuilt, research intake live"
tags: [feature, infrastructure, ai]
type: session
---

## Features

- Peer briefing live — daily scan consolidates penpal status, recent projects, and Nathan's session log into a single `peer-briefing` item; ◉ peer badge and expanders render in intel UI
- Haiku session summaries: each session log entry gets a 2-3 sentence AI summary (what was built, why it matters, current focus implied) via direct Anthropic API call in the scan route
- Date-window replaces hardcoded limit — peer briefing fetches all session entries dated yesterday or later; captures full daily output instead of capping at three
- 60 GitHub Trending items enriched on first successful trigger run — three-lens analysis (Signal / Learning / Relevance) against `context/enrichment-guide.md` rubric
- ISSUE-026 resolved — enrichment trigger scoped to `?source=github-trending`; peer-briefing and lore-changelog items no longer receive GitHub repo lens analysis
- Ad-hoc research intake live — `POST /api/intake/research` accepts topic, context, and research goal; creates `research-request` item in Supabase; `ad-hoc-research` source registered
- `field-notes-researcher` trigger created (`trig_017jfRbNBt3BFicX6K26CPL8`, every 4 hours) — picks up research requests, runs WebSearch across 3+ angles, produces sourced `briefing_content` enrichment

## Bug Fixes

- Intel UI empty despite successful scans — field-notes was writing to `nwiyddpjdeogtyjeelyh` (wrong Supabase project) since inception; corrected to shared `ylqeognifplrvxfmcevt`
- Both CCR triggers silently failing — `field-notes.vercel.app` disabled (free-tier limit on old personal account); active deployment is `field-notes-sigma.vercel.app`; both triggers updated
- Session log returning oldest entries — `chunks.slice(-3)` on a newest-first file; corrected to `slice(0, 3)`
- Peer briefing title flipping to tomorrow after 8pm EDT — `toISOString().split('T')[0]` returns UTC date; replaced with `toLocaleDateString('en-CA', { timeZone: 'America/Indianapolis' })`
- Duplicate peer-briefing cards accumulating across the week — daily cron adds a new scan each day; fixed with Set-based dedup in `getWeeklyBriefings`, keeping newest scan per source

## Infrastructure

- `ANTHROPIC_API_KEY` added to field-notes Vercel production — peer-activity route now calls Haiku directly; ~$0.001/day at current volume
- Active threads section removed — MEMORY.md Reminders bullets lacked context without Nathan's full session state; replaced by session count chip and Haiku summaries
- `briefing_content JSONB` column added to `fn_enrichments` — research-specific output field for sourced analysis, key findings, relevance, and confidence
- Trigger update API requires `type` inside `data` as a sibling of `message`, not inside `message` — correct structure documented in session

## Lessons

- A Vercel project's stable production URL lives in the `aliases` array from `vercel inspect`, not the `field-notes.vercel.app` pattern — that shorter URL belongs to a personal account that can go disabled independently
- Newest-first log files are easy to get backwards: `slice(-3)` quietly returns the oldest entries; verify ordering before slicing
- `new Date().toISOString()` always returns UTC on any server — `toLocaleDateString` with an explicit timezone is the only safe pattern for date strings that need to respect local time
- Haiku session summaries at ~$0.001/day are functionally free; the tradeoff between raw markdown noise and a direct API call in the scan route is obvious once the cost is known

## TODO

- Researcher trigger checkpoint — manually run `trig_017jfRbNBt3BFicX6K26CPL8` to verify harness briefing quality and `briefing_content` structure before trusting the schedule
- `ResearchBriefingMeta` component — research-request items have no UI treatment in `ItemCard.tsx` yet
- `/research` Claude Code skill — end-to-end from skill invocation to enrichment to intel dashboard
- Custom domain for field-notes — `field-notes-sigma.vercel.app` is stable now but alias could rotate; `intel-api.understorylabs.co` via Cloudflare would be permanent
