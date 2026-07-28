---
date: "2026-07-27"
project: taproot
session: "Vault 1033 diagnosed — CT 100 memory crisis, DHCP drift on CT 101"
tags: [infrastructure, bug]
type: session
---

## Bug Fixes

- `vault.rootstack.dev` Cloudflare 1033 resolved — cloudflared was dropping all 4 tunnel connections under CT 100 swap pressure; reconnected at connIndex=0 without intervention once diagnosed

## Infrastructure

- CT 100 true container inventory documented — 12 Docker containers running (Authentik stack, Firefly III, two Postgres instances, pgAdmin, PostgREST, taproot-status-api) against 8 GB RAM; system was at 98% RAM + 100% swap as of 2026-07-26
- cloudflared confirmed running as systemd service (not Docker) — only 35 MB RAM; not the memory hog
- CT 101 DHCP lease shift confirmed — Vaultwarden moved from `192.168.1.165` to `192.168.1.174`; cloudflared ingress rule was already tracking the correct current IP
- CT 100 IP corrected to static in CLAUDE.md — Proxmox config shows `ip=192.168.1.153/24`, not DHCP as previously documented
- Known Issues added to homelab CLAUDE.md — CT 100 memory overload and Vaultwarden DHCP → cloudflared coupling documented; static IP assignment for CT 101 flagged as the long-term fix

## Lessons

- SSH banner exchange timeout on LXC (exit 255 "timed out during banner exchange") means the host is swap-thrashing — sshd accepted the TCP but can't allocate memory to complete the handshake; longer SSH timeouts don't help; use the already-logged-in Proxmox browser tab with `fetch('/api2/json/nodes/taproot/lxc/{vmid}/status/current', {credentials:'include'})` instead
- Cloudflare 1033 is tunnel-down, not backend-unreachable — a 502 would mean cloudflared is connected but the origin failed; 1033 means cloudflared has no active connection to Cloudflare's edge
- CT 100 IP was always static in Proxmox config despite CLAUDE.md marking it DHCP — the Proxmox API `lxc/{vmid}/config` response is authoritative; the label was wrong from initial setup
- DHCP on CT 101 couples directly to cloudflared ingress config — any lease renewal silently breaks `vault.rootstack.dev` until `/etc/cloudflared/config.yml` is updated and cloudflared restarted

## TODO

- Assign CT 101 a static IP in Proxmox to decouple from cloudflared config
- Plan CT 100 memory relief — Authentik stack and/or Firefly III should move to a dedicated container, or CT 100 RAM ceiling should be raised in Proxmox
