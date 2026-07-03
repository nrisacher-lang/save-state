---
date: "2026-07-03"
project: taproot
session: "Power outage recovery — all containers back up, onboot configured"
tags: [infrastructure]
type: session
---

## Infrastructure

- Taproot survived a power outage — host came back online automatically, containers did not (onboot was unconfigured)
- All three containers started manually via Proxmox shell: `pct start 100 && pct start 101 && pct start 102`
- `onboot=1` set on CT 100, 101, and 102 — containers now auto-start with Proxmox on any future reboot or power event
- CT 102 (n8n) documented — was running but missing from `homelab/CLAUDE.md`
- Outage recovery procedure written into `homelab/CLAUDE.md` — ping host, try vault URL, Chrome autofill for Proxmox, shell start sequence

## Lessons

- Proxmox does not enable `onboot` by default — containers stay stopped after a host reboot until explicitly configured
- Chrome password manager is the recovery path for Proxmox when Vaultwarden is down — the chicken-and-egg problem breaks there
- SSH key auth on docker-host (CT 100) does not extend to the Proxmox host itself — the host requires password auth only
