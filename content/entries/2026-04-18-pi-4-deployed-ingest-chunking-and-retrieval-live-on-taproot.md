---
date: "2026-04-18"
project: taproot
session: "PI-4 deployed — ingest, chunking, and retrieval live on Taproot"
tags: [infrastructure, feature]
type: session
---

## Features

- PI-4 fully deployed — `/ingest`, `/chunks/:projectId`, and `/retrieve` endpoints live at `research.rootstack.dev`
- Tuff Shed PDF ingested end-to-end — 13 pages, 4 chunks, BM25 retrieval returning correct assembly steps
- Research service upgraded to v1.1.0 — Brave Search + ManualsLib + manufacturer direct + full ingest pipeline in a single container

## Bug Fixes

- Node 18 → Node 20 in Dockerfile — axios 1.7+ pulls in undici which requires `File` global not available until Node 20; container was crash-looping
- ZFS cache permissions set on Proxmox host — `chmod 777 /taproot-data/research-cache` required at the host level; LXC bind mount is read-only from inside the container

## Infrastructure

- `homelab/services/research/` is now the canonical source — Brave Search scrapers added, PI-4 files (ingest, cache, retrieve) merged, port locked to 3002
- ZFS bind-mount added to CT 100 via `pct set 100 -mp0` — dataset `taproot-data/research-cache` (already existed from Step 1) mounted at `/taproot-data/research-cache`
- Old `/opt/research-api` (unused TypeScript code) removed from docker-host

## Lessons

- Docker images survive source directory cleanup — container keeps running from the cached image even if the build directory is gone; only matters for future rebuilds
- Merging two diverged implementations requires picking one as the base and grafting from the other — keeping the deployed service's search providers and adding the PI-4 endpoints was cleaner than replacing everything

## TODO

- PI-5: build `api/_lib/taproot.ts` helper and inject approved chunks into `api/project-intake.ts` draft prompt
