---
date: "2026-07-11"
project: bud
session: "Catch-up Sweep live — watermark-based Gmail coverage, backfill gap confirmed closed"
tags: [feature, infrastructure, bug]
type: session
---

## Features

- Catch-up Sweep workflow published to n8n (ID: NXwPAwurVz56Mfdx) — runs every 30 minutes, fetches up to 25 emails from Gmail starting 1h before the watermark in `email_log`
- Watermark logic: queries `MAX(received_at)` from `email_log`, subtracts 1h safety buffer, builds `after:YYYY/MM/DD` Gmail filter — incremental by design, idempotent on re-run
- Ollama classification (qwen2.5:3b) wired into the sweep — same Parse Classification logic as the main pipeline, handles code fences and `"null"` string normalization
- Historical backfill workflow ported to Ollama (`gmail-historical-backfill.json` v3) — covers Apr 17–May 16 gap period, manual-trigger, limit 50

## Bug Fixes

- `Prefer: resolution=ignore-duplicates` header alone returned 409 on duplicate inserts — PostgREST requires `?on_conflict=message_id` as a URL query param in addition to the Prefer header; added to both sweep and backfill Log Unclassified nodes

## Infrastructure

- n8n CLI workflow import: `docker cp file.json n8n:/tmp/ && docker exec n8n n8n import:workflow --input=/tmp/file.json` — usable when n8n API key is unavailable or the workflow was never registered
- Bud CLAUDE.md updated: Gmail OAuth re-auth note added (SSH tunnel pattern: `ssh -L 5678:localhost:5678 root@192.168.1.152`), Steps 6-7 marked complete
- Historical gap validated via direct Supabase row count: 78 rows in `email_log` for Apr 24–May 16; first backfill batch (50 emails) returned all 409 duplicates, confirming the Jul 5 work had already covered the period

## Lessons

- PostgREST `resolution=ignore-duplicates` needs two things: the `Prefer` header AND `?on_conflict=<column>` in the URL — the header alone silently returns 409 and the error looks identical to a real constraint violation
- Expired Gmail OAuth in n8n manifests as `ETIMEDOUT` on a Google IP — looks like a network failure, not a credential error; check n8n Credentials before debugging connectivity
- A gap in `email_log` doesn't mean a gap in coverage — the Jul 5 backfill had already filled Apr 24–May 16; first backfill run hitting 409 on all 50 rows was the confirmation signal, not a failure
