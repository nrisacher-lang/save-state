---
date: "2026-04-30"
project: bud
session: "PurchaseHandler live — Steps 2–4 complete, n8n up"
tags: [infrastructure, ai, feature]
type: session
---

## Features

- PurchaseHandler local test passed — 3/3 email formats (Amazon, DoorDash, Netflix) extracted and written to Supabase
- Handler deployed on docker-host — FastAPI container running at `192.168.1.153:8001`, health endpoint confirmed from network
- n8n operational — CT 102 (`192.168.1.152:5678`) created, Docker installed, n8n running and survives reboot
- Gmail API enabled on Google Cloud project `life-dashboard` — OAuth credentials next

## Bug Fixes

- Claude Haiku wraps JSON extraction responses in ` ```json ``` ` fences despite explicit instructions — stripped before `model_validate_json()` in `claude_client.py`

## Infrastructure

- Supabase schema live — `email_log` and `purchases` tables with RLS, indexes, and soft delete
- `.env.example` committed — documents `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `ANTHROPIC_API_KEY`
- `services.md` created at `~/.claude/services.md` — global inventory of cloud platforms, APIs, and self-hosted services; updated by `/wrap` going forward
- n8n compose file uses `N8N_SECURE_COOKIE=false` — required for HTTP access on local network

## Lessons

- Smaller models (Haiku) reliably ignore "no markdown formatting" instructions — fence stripping is a required defensive layer, not optional
- `scp` with `~` fails in PowerShell; full Windows paths (`C:\Users\nrisa\...`) required — write files locally and copy over rather than fighting heredocs or rsync
- Services inventory needs to exist before the second integration, not after — build the index early so "do I already have a GCP project?" has a real answer

## TODO

- Step 5: create Google OAuth 2.0 credentials in life-dashboard, wire Gmail trigger in n8n
- Add `bud` to save-state project registry via `/ship`
