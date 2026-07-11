---
date: "2026-07-11"
project: taproot
session: "Self-hosted Supabase live — bud migrated off cloud"
tags: [infrastructure, feature]
type: session
---

## Features

- CT 104 (`supabase-host`, `192.168.1.210`) fully operational — 5-container Supabase stack (Kong, PostgREST, Postgres, Studio, Meta) behind `supa.rootstack.dev`
- Bud migrated off cloud Supabase — 2,732 `email_log` rows + 39 `purchases` moved via REST API, row counts verified against cloud source
- Vaultwarden entry complete — all 5 CT 104 credentials stored as Hidden custom fields (POSTGRES_PASSWORD, JWT_SECRET, ANON_KEY, SERVICE_ROLE_KEY, DASHBOARD_PASSWORD)
- Nightly `pg_dump` cron installed on CT 104 — gzips to `/taproot-data/supabase/backups/`, 7-day rolling retention
- Restore tested end-to-end — scratch DB provisioned, dump piped in via `docker exec`, 2,732 / 39 row counts confirmed, scratch DB dropped

## Bug Fixes

- Cloud Supabase DB password inaccessible post-creation — direct pg_dump/restore path blocked; switched to REST API migration (cloud service key → self-hosted service key)
- Cloudflare returned 1010 when migration script POSTed through `supa.rootstack.dev` from CT 100 — fixed by targeting `http://192.168.1.210:8000` (LAN-direct) instead of the tunnel hostname

## Infrastructure

- `migrate-bud-data.py` committed to `homelab/scripts/` — paginated reads from cloud REST API, batched POSTs to self-hosted, idempotent via `ignore-duplicates`
- Bud `.env` on CT 100 cut over to LAN-direct URL; `.env.cloud-backup` written for one-command rollback
- `SITE_URL` and `API_EXTERNAL_URL` in CT 104's Supabase `.env` updated from `localhost` to `https://supa.rootstack.dev`, containers restarted
- `homelab/CLAUDE.md` updated — CT 104 in containers table, services section, outage recovery command, Build Progress Step 12, two new BTWs

## Lessons

- Vaultwarden's API is end-to-end encrypted — POSTing plaintext values to `/api/ciphers` creates entries the UI can't decrypt; browser automation is the only viable path for adding entries
- Cloudflare tunnel hostnames block non-browser HTTP clients from within the LAN (error 1010) — internal service-to-service calls must use LAN-direct IPs, not `*.rootstack.dev` hostnames
- Self-hosting Supabase shifts backup ownership entirely — the nightly `pg_dump` cron isn't optional; it's the first thing to set up after the stack is healthy
- `du -sh` on ZFS reports the block-size floor, not actual bytes — "512" from a 293KB file; always verify with `ls -lh` when size matters
