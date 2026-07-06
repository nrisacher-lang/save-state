---
date: "2026-07-05"
project: bud
session: "Ollama migration complete — 24 dropped purchases recovered, pipeline validated"
tags: [infrastructure, ai, bug]
type: session
---

## Features

- Extraction backend swapped from Claude Haiku to local Ollama (`qwen2.5:3b` on CT 100:11434) — zero API costs, inference stays on the homelab
- All 24 purchase emails dropped during the API credit outage recovered — 39 active purchases now in Supabase, zero errors remaining
- `_fix_null_strings()` added to `ollama_client.py` — walks the parsed JSON dict before Pydantic validation to replace `"null"` strings with Python `None`
- HTML fallback in n8n "Build Handler Payload": when plain-text body is under 500 characters, strips and uses HTML body instead — small models extract nothing useful from 50-word plain-text bodies

## Bug Fixes

- n8n "Build Handler Payload" read `email.payload.headers` (raw Gmail API format) — n8n's Gmail node returns a parsed object with top-level fields (`from.value[0]`, `subject`, `text`); rebuilt JS to match the actual output shape
- n8n HTTP Request timeout (300s) fired before Ollama processed deep-queue items — 24 concurrent requests queue sequentially; item 24 waits 23×67s ≈ 25 min before Ollama starts it; raised to 1800s in n8n and httpx
- `docker restart` was used after code edits — command reuses the baked image and silently runs old code; switched to `docker compose up --build -d`

## Infrastructure

- `src/services/ollama_client.py` — new extraction service using httpx against Ollama's `/v1/chat/completions` endpoint; 1800s timeout; JSON fence stripping; null-string normalization
- `src/config.py` updated: `anthropic_api_key` now optional (defaults to `""`); `ollama_url` and `ollama_model` added
- Migrations 003 (unsubscribe support) and 004 (`amount` nullable on purchases) applied
- `scripts/find_dupes.py` — one-shot soft-delete deduplication script; idempotent; dry-run flag
- `workflows/backfill/` — n8n recovery workflow JSON export and Python backfill runner

## Lessons

- `docker restart` reuses the baked image — Python file changes are invisible until `docker compose up --build -d`; the container logs look healthy the whole time
- n8n manual-trigger workflows cannot be triggered via REST API; `POST /api/v1/workflows/{id}/run` returns "POST method not allowed"; the UI Execute button is the only path
- Ollama queues inferences sequentially — n8n's HTTP timeout counts from when the request is sent, not when Ollama starts it; large concurrent batches will always exceed any reasonable n8n timeout
- Small models (`qwen2.5:3b`) emit `"field": "null"` as a string, not JSON `null` — Pydantic's date and float parsers reject it; the fix is a pre-validation dict walk, not a prompt change

## TODO

- Bud Web UI — Step 1 scaffold at `bud.understorylabs.co` (Split Brain: Vercel reads, Taproot acts); plan at `~/.claude/plans/bud-web-ui-plan.md`
