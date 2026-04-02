---
date: "2026-04-01"
project: lore
session: "Art direction POC deployed — /vision route live"
tags: [launch, refactor, infrastructure]
type: session
---

## Features

- Art direction POC complete — all four plan steps shipped on `feature/art-direction-poc`
- Three themed environments live: The Library, The Tavern, The Meadow — photo backgrounds with presence-responsive lighting
- Four surface views: Landing, About, Server (mock chat UI layered over scene), Community (ambient presence dots)
- Demo controls: theme crossfade, presence slider (0–50), surface tabs, auto-demo mode, sound toggle

## Bug Fixes

- Tavern scene: removed all positioned circular `radial-gradient` elements — last remaining source of floating orbs
- Dev debug readout removed from `VignetteOverlay` before sharing

## Infrastructure

- Vercel CLI installed and project linked (`nrisacher-langs-projects/lore`) — repo on self-hosted Gitea requires manual CLI deploys, no GitHub integration
- `rootDirectory: apps/web` set via Vercel API — not settable in `vercel.json` (causes deploy failure if attempted there)
- Next.js updated 15.1.0 → 15.5.14 — Vercel blocks deployment of vulnerable versions (CVE-2025-29927, middleware auth bypass)
- Preview live at https://lore-drab.vercel.app/vision

## Lessons

- Positioned circular `radial-gradient` divs always read as orbs against photorealistic backgrounds — blend modes don't fix it. Full-width linear gradients and full-scene `mixBlendMode: overlay` tints are the correct approach for shapeless presence indication.
- `rootDirectory` is a Vercel project setting, not a `vercel.json` key — Vercel CLI v50 also removed `--root-directory`. Set it once via API: `PATCH /v9/projects/{id}` with `{"rootDirectory": "apps/web"}`.
- Deploying from the monorepo root (not `apps/web`) is required — Vercel must see the pnpm lockfile at root to resolve workspace dependencies.

## TODO

- Source Lottie animation files (fire, candles, petals) — `LottieLayer` and Howler are both wired, waiting on assets
- Open PR on Gitea for Nathan's review — draft description already written
