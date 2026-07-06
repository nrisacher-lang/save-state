---
date: "2026-07-05"
project: taproot
session: "Semantic Reranking — shipped"
tags: [feature, ai]
type: ship
---

## Features

- Semantic Reranking shipped on the Research API — `/retrieve` now runs a Voyage `rerank-2.5` cross-encoder pass before returning results.
- Keyword search pulls up to 30 BM25 candidates; Voyage reorders by semantic relevance and returns the requested `topK` — response includes `reranked: true` so callers know which mode is active.
- Graceful fallback built in — if `VOYAGE_API_KEY` is absent or Voyage is unreachable, results return in keyword order with `reranked: false`.

## Infrastructure

- AppArmor persistence fixed via Proxmox hookscript — `/var/lib/vz/snippets/ct103-apparmor.sh` loads the `docker-default` profile into CT 103's LXC namespace on every `pct start`; registered in `103.conf` as `hookscript: local:snippets/ct103-apparmor.sh`.
- Profile stored permanently at `/etc/apparmor.d/lxc-ct103-docker-default` — `docker compose up --build` now works after any host reboot without manual intervention.

## Lessons

- Docker's `security_opt: apparmor=unconfined` in compose covers running containers but not build containers — `docker compose up --build` still requires the profile loaded at the namespace level; restart-only works fine once the image exists.
- The xterm.js terminal buffer fills from row 0 in a fresh or cleared terminal — reading `buf.length - N` returns blank rows; always iterate from 0 to `cursorY + 1`.
- AppArmor namespace strings (`<-var-lib-lxc>`) in terminal output trigger the browser extension's credential filter — `clear` the terminal before reading the buffer after any command that prints them.
