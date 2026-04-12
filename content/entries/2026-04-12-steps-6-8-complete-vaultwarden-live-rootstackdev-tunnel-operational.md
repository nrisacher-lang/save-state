---
date: "2026-04-12"
project: taproot
session: "Steps 6 + 8 complete — Vaultwarden live, rootstack.dev tunnel operational"
tags: [infrastructure]
type: session
---

## Features

- Vaultwarden deployed and operational — password manager live at `vault.rootstack.dev` with real HTTPS
- Bitwarden extension connected to self-hosted vault — all Taproot credentials transferred and accessible
- Cloudflare Tunnel established (UUID `5f21212a-2895-42f2-9b77-ffd6056af6cf`) — Taproot services reachable externally without port forwarding or exposing home IP
- `rootstack.dev` registered via Cloudflare Registrar — infrastructure domain live
- DNS routes configured: `status.rootstack.dev` → Uptime Kuma, `vault.rootstack.dev` → Vaultwarden, `research.rootstack.dev` pre-configured for research service
- ISSUE-017 resolved — Vercel serverless can now reach Taproot, unblocking the product intelligence feature

## Bug Fixes

- Ubuntu 24.04 SSH blocks root via three separate mechanisms (PermitRootLogin, PasswordAuthentication, and drop-in sshd_config.d overrides) — sshd_config on CT 100 also had immutable bit set, requiring `chattr -i` before sed could edit it
- `docker-compose-v2` conflicts with Docker's built-in compose plugin — removed; `docker compose` used directly
- `cloudflared service install` failed with "cannot determine default configuration path" — fixed with explicit `--config /etc/cloudflared/config.yml` flag
- GPG dearmor command truncated when piped in SSH terminal — split into two steps: curl to temp file, then gpg separately
- Vaultwarden enforces HTTPS for all operations — HTTP access non-functional by design; Cloudflare Tunnel resolves this with real TLS rather than fighting self-signed cert workarounds

## Infrastructure

- CT 101 recreated fresh (Ubuntu 24.04, nesting enabled) after SSH lockdown and package conflicts proved unresolvable on the original container
- `cloudflared` installed on docker-host (CT 100) via official Cloudflare apt repo; tunnel config at `/etc/cloudflared/config.yml`
- Config written locally, scp'd to server — heredoc-in-remote-terminal pattern retired; local-write + scp is now standard for any multi-line file creation on remote hosts
- Product Intelligence plan confirmed (PI-1 through PI-6) — manufacturer site recon complete, hybrid scraping strategy validated (HTTP scraper + aggregators first, Firecrawl as last resort)

## Lessons

- Ubuntu 24.04 SSH lockdown is multi-layered — fixing one mechanism while others remain active wastes an entire session; audit all three before starting
- The right solution is less work than the wrong one — Vaultwarden's HTTPS requirement wasn't a blocker, it was a nudge toward finishing Step 8; fighting it would have cost more time than the tunnel took
- Heredoc in any remote terminal is unreliable — write multi-line configs locally and scp; this eliminates an entire class of paste-corruption errors
- Manufacturer content is mostly accessible via simple HTTP scraper — Firecrawl is last-resort, not primary; most products have direct PDF URLs or are covered by aggregators (ManualsLib, Manualzz)

## TODO

- Change Vaultwarden `ADMIN_TOKEN` from placeholder to a strong credential
- Tailscale (Step 8d) — private device-to-device access separate from public tunnel
- Step 7: ClaudeVault
- Step 9: Research Service deployment (needed for PI-2)
- Execute product intelligence plan — PI-1 through PI-6
