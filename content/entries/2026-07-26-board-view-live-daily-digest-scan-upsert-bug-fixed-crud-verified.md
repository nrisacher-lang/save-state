---
date: "2026-07-26"
project: field-notes
session: "Board view live — daily-digest scan, upsert bug fixed, CRUD verified"
tags: [feature, bug, infrastructure]
type: session
---

## Features

- Board view operational in `/intel` — live TODO tracker grouped by project, distinct from the editorial card grid; `[ ]` toggle, `+ append`, and soft-delete per item; header stat line shows open/done/project counts
- Board CRUD endpoints live in understory-labs-site — `GET /api/board` returns items grouped by `project_id`; `POST /api/board/item`, `PATCH /api/board/item/:id`, and `DELETE /api/board/item/:id` handle optimistic UI round-trips
- Daily-digest scan route populates `board_items` from wiki TODOs — parses open `- [ ]` items from `/api/todos` (understory-labs-site), seeds Taproot via insert-new + update-existing; `fn_intel_sources` row seeded, cron at `0 10 * * *`
- n8n Board Wiki Reconciler live — daily at 6am UTC, calls pipeline-api `/reconcile` to sync board done-state back to wiki MDX checkboxes; published in n8n instance on CT 102

## Bug Fixes

- Daily-digest scan silently wrote zero rows despite returning success — `board_items.natural_key` uses a partial unique index (`WHERE deleted_at IS NULL`), which PostgREST `ON CONFLICT` can't target; `42P10` error was caught and logged but not thrown, so `boardUpserted: 7` was reported while Taproot stayed empty; fixed by replacing `.upsert({ onConflict: 'natural_key' })` with fetch-existing + separate `.insert()` for new keys and `.update().eq('id', id)` for existing ones

## Infrastructure

- Taproot Supabase client added to field-notes (`app/api/_lib/taproot.ts`) — `TAPROOT_SUPABASE_URL` + `TAPROOT_SUPABASE_SERVICE_ROLE_KEY` env vars in Vercel prod
- `board_items` table on Taproot CT 104 — soft delete (`deleted_at`), partial unique index on `natural_key WHERE deleted_at IS NULL`, `source` column distinguishes `wiki` (scan-origin) from `board` (user-added)

## Lessons

- PostgREST `ON CONFLICT` requires a full non-partial unique constraint — tables with `UNIQUE ... WHERE deleted_at IS NULL` return `42P10` and write nothing; no exception is thrown unless `{ error }` is explicitly checked, so the failure is completely silent without defensive error propagation
- Counting `rows.length` before the DB call and using that count in the response creates a class of "silent write failure" bugs — always check `{ error }` from every mutation and reflect actual outcome in the response

## TODO

- Add `GITHUB_PAT` to pipeline-api systemd unit on CT 104 (`Environment=GITHUB_PAT=<token>` in `/etc/systemd/system/pipeline-api.service`; `systemctl daemon-reload && systemctl restart pipeline-api`) — required for wiki reconciler to commit MDX changes
- Run n8n Board Wiki Reconciler manually after PAT is wired to confirm full round-trip: board done-state → MDX checkbox flip → commit on `understory-labs-site` → Vercel redeploy
