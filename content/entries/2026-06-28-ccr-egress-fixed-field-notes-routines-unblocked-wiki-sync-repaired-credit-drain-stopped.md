---
date: "2026-06-28"
project: claude-code
session: "CCR egress fixed — field-notes routines unblocked, wiki sync repaired, credit drain stopped"
tags: [infrastructure, bug, ai]
type: session
---

## Features

- `sync-wiki-state.ts` now walks all commits since last synced hash — `last_commit_hash` added to `project_state`; multi-commit sessions no longer collapse to HEAD-only in wiki activity
- `validateAuth` accepts `?token=` query param as auth fallback — CCR WebFetch can't send custom headers; this is the only viable auth mechanism for CCR-initiated API calls
- Researcher rescheduled from every 4 hours to daily 10am EDT

## Bug Fixes

- Implementer CCR silently failing on every daily run — prompt used `curl`, which is blocked in the CCR environment; rewritten to WebFetch with `?token=` query param auth
- Researcher and implementer returning 403 on every WebFetch call — root cause: Default Cloud Environment blocks all outbound HTTP via egress proxy (403 came from CCR proxy, not from Vercel); fixed by creating "field-notes" custom cloud environment with `field-notes-sigma.vercel.app` in the allowlist
- Researcher enrichment submission failing — WebFetch URL limit (~300 chars) too short for encoded payloads; Step 5 rewritten to use Python urllib POST via Bash
- `peer-activity` route draining Anthropic API credits daily — Haiku summarization called `api.anthropic.com` directly with `ANTHROPIC_API_KEY`; replaced with 300-char truncation
- CRON_SECRET stale in all three CCR prompts — `.env.production` pulled from CLI held a rotated-out value; corrected to the live Vercel dashboard value

## Infrastructure

- "field-notes" custom cloud environment created in CCR settings — Network Access: Custom, Allowed domains: `field-notes-sigma.vercel.app`; applied to all three routines
- Enrichment trigger was already on correct environment — Jun 8, 15, 22 scheduled runs all completed successfully before this session

## Lessons

- CCR 403 looks identical to an auth failure but originates at the egress proxy — the right first move is checking the network layer (Environment → Network Access), not the target API logs
- WebFetch URL limit in CCR is ~300 chars and fails silently — "Failed to fetch" with no HTTP status code is the only signal; bisecting URL length is how the limit was found
- WebFetch in CCR cannot send Authorization headers — `?token=` query param fallback must be implemented server-side; fixing the CCR prompt alone isn't enough
- `.env.production` from `vercel env pull` can drift from the live dashboard value — the dashboard is authoritative; treat the local file as a stale reference copy

## TODO

- Approve Harness CI/CD enrichment (`67c3a731`) in intel UI — created during researcher test run, status: pending
- Implementer end-to-end test — requires at least one approved item in the intel UI before it will write research notes
- Git reconciliation in field-notes — `origin/master` ahead of local; run `git pull` before next push
