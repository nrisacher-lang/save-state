---
date: "2026-06-01"
project: bud
session: "Pipeline live — Gmail trigger activated, handler resilience fixed"
tags: [feature, bug, infrastructure]
type: session
---

## Features

- Gmail purchase router workflow published and active in n8n — polls inbox every minute for new emails
- Classification pipeline end-to-end: Gmail trigger → Claude Haiku classify → confidence-based routing → handler POST or Supabase log
- Read status filter set to all emails (read + unread) — prevents missed classification if email is opened before n8n polls

## Bug Fixes

- Handler crashed on emails where Claude returned null for amount — `PurchaseExtraction.amount` was required, now optional
- `email_log` audit trail never written when extraction failed — crash happened in `extract()` before `store()` was reached; moved email_log write before compliance checks
- Handler returned 200 with error body but route still reported `status: "ok"` — now returns `"partial"` when email is logged but no purchase row created
- Deployed model mismatch: `EmailPayload` on docker-host was missing `unsubscribe_link` and `is_read` fields — scp'd the updated model file

## Infrastructure

- Lost session reconstructed from git state and uncommitted files — committed as `dab51e7`
- Google Cloud OAuth, n8n Gmail credential, and workflow import confirmed already complete from prior session
- Gmail Trigger node had stale "Every Day" poll entries from JSON import — removed, set to Every Minute
- Deployment confirmed: scp to `/opt/bud/` on docker-host, `docker compose build && up -d`

## Lessons

- When deploying via scp, every changed file must be pushed — not just the files edited in the current session; a model file mismatch caused an AttributeError that only surfaced at runtime
- n8n workflow JSON imports can carry orphaned poll configuration entries that prevent activation — the `.trim()` error gave no indication which node or field was the problem
- Handler pipelines should write the audit log (email_log) unconditionally at the top of `store()`, not after validation — a crash in `extract()` leaves zero trace otherwise

## TODO

- Confirm end-to-end with a real purchase email landing in both `email_log` and `purchases` tables — fix deployed but not yet validated
