---
date: "2026-04-17"
project: current-os
session: "Product Intelligence — PI-1 through PI-4 built (retrospective)"
tags: [feature, ai, infrastructure]
type: session
---

## Features

- Product detection lands in intake engine — `product_assembly_detected` inference fires when AI identifies a specific kit or product, `readyToResearch` flag signals the UI to offer research before drafting
- Research service deployed on Taproot — `research.rootstack.dev` live, returns ManualsLib results + YouTube search URL + DuckDuckGo fallback for any product query
- Resource approval UI complete — "Resources Found" section in observations panel with type badges, checkboxes, Add your own URL input, and three explicit degradation paths when Taproot is unreachable
- Ingest pipeline written — `/ingest` endpoint downloads PDFs and HTML, extracts text, chunks by step-pattern → headings → 500-token windows, stores to ZFS cache under a temp project key
- Per-resource ingest status in intake overlay — loading / done (chunk count) / image-only-warning / error badges fire immediately on resource approval, non-blocking

## Bug Fixes

- Research fetch moved out of `useEffect` — cleanup function was aborting the in-flight request the moment `researchStatus` changed from `idle` to `loading`, causing an immediate `AbortError`
- `@vercel/node` import removed from `api/research.ts` — Vercel infers the runtime; explicit import broke the build
- Type assertion added for manual resource entry — TypeScript couldn't narrow the `type` field on user-pasted URLs

## Infrastructure

- `api/research.ts` — Vercel proxy with 10s timeout, forwards to `TAPROOT_RESEARCH_URL` with `x-api-key` auth; `RESEARCH_API_KEY` never exposed to the browser
- `api/ingest.ts` — second Vercel proxy, 25s timeout for PDF downloads
- `project_resources.source` column added — distinguishes `ai-discovered` from `manual` resources; feeds the future manual library
- `src/cache.js`, `src/ingest.js`, `src/retrieve.js` written in `~/Projects/homelab/services/research/` — BM25-lite keyword retrieval, ZFS-backed chunk storage
- PI-4 not yet deployed — ZFS bind-mount into docker-host (requires CT stop) and service rebuild are the next physical steps

## Lessons

- Chunking strategy order matters — trying numbered steps first (assembly manuals are full of them) before generic heading detection before token windows produces far better chunks than the reverse
- `ingestProjectKey` needs to be a temp UUID minted at resource-approval time, not the Supabase project ID — the project doesn't exist yet when ingestion kicks off; PI-5 will wire the linkage
- Explicit degradation beats silent fallback — presenting four named choices when Taproot is unreachable is only slightly more code and completely changes the user's ability to recover

## TODO

- Deploy PI-4: ZFS dataset on Proxmox host → bind-mount into CT 100 → rebuild research service → push Vercel changes
- Validate PI-4 checkpoint: ingest a real Ring doorbell PDF, confirm `/retrieve` returns relevant sections
- PI-5: inject approved chunks into `api/project-intake.ts` draft prompt using `ingestProjectKey`
