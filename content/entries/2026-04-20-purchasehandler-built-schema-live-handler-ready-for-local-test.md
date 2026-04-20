---
date: "2026-04-20"
project: bud
session: "PurchaseHandler built — schema live, handler ready for local test"
tags: [feature, infrastructure, ai]
type: session
---

## Features

- PurchaseHandler complete — extract → validate → store pipeline wired to `/api/v1/handle/purchase`
- Extraction prompt with three few-shot examples (Amazon order, DoorDash delivery, Netflix subscription) — Haiku model, JSON-only output
- `HandlerResponse` returns `email_log_id` and `purchase_id` on success — n8n gets traceable IDs, not just a status string
- `amount > 0` and non-empty `vendor` validation gates every write — no silent bad data reaches Supabase

## Infrastructure

- `email_log` and `purchases` tables live in Supabase — RLS enabled, dedup index on `message_id`, FK from purchases into email_log
- Migration files in `migrations/` numbered 001/002 — ordering enforces the FK dependency at run time
- Sync Supabase client wrapped in `asyncio.to_thread` — avoids supabase-py async API fragility across 2.x minor versions
- `email_log` row written before `purchases` insert — if the purchases write fails, the audit trail exists and carries the error

## Lessons

- Supabase service_role bypasses RLS by design — adding a write policy is redundant and misleading; only anon/authenticated reads need explicit policies
- supabase-py async API changed names between 2.x minor versions (`acreate_client` vs `create_async_client`) — sync + `asyncio.to_thread` is the portable fix
- Prompt templates with JSON few-shot examples can't use `.format()` — JSON braces read as format variables; `.replace()` per slot avoids the trap
- Write the audit log row first, then the derived row — partial failures are recoverable; a missing anchor row is not

## TODO

- Step 2 checkpoint: venv setup, `.env`, curl tests with three email formats against localhost
- Steps 3–6 after checkpoint: Docker deployment on docker-host, n8n LXC, Gmail trigger workflow, end-to-end validation
