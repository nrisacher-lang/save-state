---
date: "2026-04-17"
project: taproot
session: "Lost session recovery — research service confirmed live, PI-1 through PI-4 discovered complete"
tags: [infrastructure, feature]
type: session
---

## Features

- Research service verified end-to-end — `https://research.rootstack.dev/health` returns 200 from cellular, Tuff Shed query returns manufacturer direct + Brave + fallback results
- PI-1 through PI-4 discovered complete from retrospective entry — product detection, resource approval UI, ingest pipeline, and per-resource status badges all built in the lost session

## Infrastructure

- Deployed service differs from repo: JS/Express, port 3002, Brave Search + ManualsLib + manufacturer direct — TypeScript `research-api` archived to `_archive/`
- `config.yml` synced with server — `research.rootstack.dev → localhost:3002` entry added
- Research service source lives in `~/Projects/homelab/services/research/` — deployed version is PI-2 only; PI-4 endpoints written but not deployed (ZFS bind-mount + service rebuild pending)
- homelab CLAUDE.md, global CLAUDE.md, and product intelligence plan updated to reflect actual state

## Lessons

- Lost session state is recoverable — `docker ps` and `ls /opt` reconstruct what was deployed; retrospective Save State entries reconstruct what was built
- `cut -d= -f2` silently truncates base64 keys with trailing `=`; `grep -oP '(?<=KEY=).*'` handles them correctly
- The repo and the server diverged during development — implementation language, port, and architecture all changed; the repo was never updated

## TODO

- Deploy PI-4: ZFS bind-mount into CT 100 → rebuild research service → validate `/ingest` and `/retrieve` against a real PDF
- PI-5: inject approved chunks into `api/project-intake.ts` draft prompt
