---
date: "2026-07-04"
project: taproot
session: "Research API relocated to dedicated CT 103 — full endpoint set live on ZFS"
tags: [infrastructure, ai]
type: session
---

## Features

- Research API now runs on its own dedicated container (CT 103, research-host, `192.168.1.154`) — separated from the CT 100 god-container that mixed cloudflared with churning app deployments
- Full PI-4 endpoint set live for the first time: `/ingest`, `/chunks`, `/retrieve`, `/conversations` — only `/research` and `/health` had ever been deployed
- ZFS dataset `taproot-data/research` mounted natively into CT 103 — eliminates the bind-mount blocker that kept PI-4 dark on CT 100
- Cloudflare tunnel repointed: `research.rootstack.dev` routes to `192.168.1.154:3002`; tunnel stays on CT 100 as shared ingress

## Bug Fixes

- Bud purchase handler now stores null-amount purchases with `needs_review=true` instead of silently dropping — was causing real purchases (Amazon multi-item orders with no grand total) to disappear from the pipeline
- Purchase handler made idempotent: email_log upsert on `message_id` + skip-if-purchase-exists by `email_log_id` — safe to re-run recovery workflows without duplicating records

## Infrastructure

- CT 103 created via Proxmox browser automation — Ubuntu 24.04, 2 cores, 2 GB RAM, static IP via netplan, `onboot=1`
- Docker in unprivileged LXC required two fixes: `features: nesting=1` in `/etc/pve/lxc/103.conf` for overlayfs, `security_opt: apparmor=unconfined` in `docker-compose.yml` for build containers
- `docker-default` AppArmor profile loaded into CT 103's LXC namespace from the Proxmox host via `apparmor_parser --namespace='lxc-103_<-var-lib-lxc>'` — not persistent across Proxmox host reboots (rebuild-time concern; restart policy handles runtime)
- Ollama deployed natively on CT 100 (`qwen2.5:3b`, CPU-only) — replaces Anthropic API in Bud handler after API credits exhausted; GPU passthrough blocked by unprivileged LXC cgroup UID mapping

## Lessons

- Unprivileged LXC containers block cgroup device rules from propagating to nested Docker containers — GPU devices appear as `nobody:nogroup` inside; `chmod` fails; native install (Ollama as a systemd service directly in the LXC) bypasses the nesting issue entirely
- Docker's `security_opt: apparmor=unconfined` in compose applies to running service containers but not to build containers — `docker compose up --build` still fails without the AppArmor profile loaded at the namespace level; `docker compose up` (restart, no rebuild) works fine after the image exists
- `security-opt` in `daemon.json` is not a valid key — Docker daemon refuses to start with it; the option is per-container only, not daemon-global
- `cut -d= -f2` truncates a base64-encoded key at its trailing `=` padding — use `-f2-` to capture everything after the first delimiter

## TODO

- 24 dropped Bud purchases pending recovery — n8n workflow `iroy69I3gOTPvj2L` has two open bugs: Build Handler Payload reads Gmail raw API format instead of n8n's simplified output; HTTP Request timeout too short for sequential Ollama queue depth
- AppArmor profile load on Proxmox host is in-memory only — a systemd hook on `pct-start@103` would make it persistent across reboots (needed before next Docker image rebuild on CT 103)
- Bud Web UI plan confirmed (7 steps, `~/.claude/plans/bud-web-ui-plan.md`): Step 7a recovery comes first, then Step 1 scaffold at `bud.understorylabs.co`
