---
date: "2026-07-12"
project: taproot
session: "Firefly III live — SimpleFIN connected, import rate-limited"
tags: [infrastructure, feature]
type: session
---

## Features

- Firefly III deployed on CT 100 — personal finance manager live at `firefly.rootstack.dev`, DB on Taproot Postgres, admin account and API token confirmed
- Firefly data importer live at `firefly-import.rootstack.dev` (port 8081) — companion service for bank feed imports
- SimpleFIN Bridge paid and connected — SoFi account linked, setup token generated and claimed via Chrome automation
- First import initiated — fetched account data and transaction history chunks before hitting SimpleFIN's 24 req/day rate limit; pending retry (tomorrow, via LAN)

## Bug Fixes

- Importer returned 500 on every request — caused by `SESSION_DRIVER: database` set without a DB connection in the importer service; fixed by removing `SESSION_DRIVER` (main app keeps it, importer defaults to file)
- First import attempt failed with Cloudflare 524 — 100-second tunnel timeout killed the long-running chunked history fetch; workaround is LAN-direct `http://192.168.1.153:8081`
- SimpleFIN setup token 403 on retry — token was already consumed by the failed Cloudflare attempt; generated a new one from My Account → New app connection

## Infrastructure

- OAuth keys bind-mounted from `/opt/firefly/keys/` — keys owned `33:33` (www-data) at 600, prevents loss on container recreate
- `SESSION_DRIVER: database` on main app — persists sessions across restarts, eliminates CSRF mismatch on `--force-recreate`
- Cloudflare tunnel entries added for `firefly.rootstack.dev` and `firefly-import.rootstack.dev`
- Wiki todos added to `taproot/plan.mdx` — SimpleFIN account additions and first import instructions with LAN URL and 1-year range

## Lessons

- `SESSION_DRIVER: database` requires a DB connection in the same service — setting it on a container with no `DB_*` env vars crashes the session middleware on every request
- Cloudflare's 100-second timeout is a hard ceiling for browser-initiated operations; any long-running import or batch job needs to run via LAN-direct IP, not the tunnel hostname
- SimpleFIN setup tokens are one-time use regardless of whether the import succeeds — a failed import mid-claim consumes the token; plan for one token per attempt
- SimpleFIN's 24-request daily limit is per-app-token and resets every 24 hours; "Import everything" burns it across two retry attempts; "Go back 1 year" is the safe initial import size

## TODO

- Run first Firefly import — `http://192.168.1.153:8081`, SimpleFIN, "Go back some time → 1 year" (rate limit resets ~11 PM EDT 2026-07-12)
- Add investment and credit card accounts to SimpleFIN Bridge
