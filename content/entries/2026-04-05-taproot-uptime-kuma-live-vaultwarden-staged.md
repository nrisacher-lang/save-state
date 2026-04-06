---
date: "2026-04-05"
project: taproot
session: "Steps 5–6 — Uptime Kuma live, Vaultwarden container staged"
tags: [infrastructure]
type: session
---

## Features

- Uptime Kuma deployed and running — monitoring dashboard live at port 3001 on docker-host (CT 100)
- Vaultwarden container created (CT 101, IP 192.168.1.165) — Ubuntu 24.04, Docker installed, compose deploy staged
- Credential hygiene workflow established — Notepad scratch pad pattern now the standard for all multi-step build sessions

## Infrastructure

- docker-host (CT 100) confirmed fully operational — Docker CE, Compose plugin, hello-world verified
- Vaultwarden container mirrors docker-host setup: same LXC config, same Docker install sequence
- Uptime Kuma docker-compose.yml deployed to /opt/uptime-kuma with restart: unless-stopped

## Bug Fixes

- Docker apt sources malformed — command substitution in Proxmox console split across lines; fixed by hardcoding arch=amd64 and codename=noble directly in sources entry
- Ubuntu 24.04 blocks root SSH by default — fixed with sed replace on PermitRootLogin in sshd_config
- Gateway misconfigured to 192.168.100.1 during Proxmox install — corrected to 192.168.1.1 in network UI

## Lessons

- The Proxmox web console is unreliable for anything interactive — SSH first, console only as fallback
- Interactive commands (passwd) produce no visible output in the console; non-interactive alternatives (echo 'root:pass' | chpasswd) are the only reliable path
- Credential amnesia is a real session hazard — the Notepad rule exists for a reason; enforce it at session start, not after the first forgotten password

## TODO

- Complete Vaultwarden compose deploy (generate ADMIN_TOKEN, write docker-compose.yml, docker compose up -d)
- SSH still failing on CT 101 — reset root password via chpasswd, retry
- Transfer all session credentials from Notepad into Vaultwarden once live
- Step 7: ClaudeVault (CT 102)
- Step 8: Tailscale on Proxmox host
- Step 9: git init homelab, initial commit
