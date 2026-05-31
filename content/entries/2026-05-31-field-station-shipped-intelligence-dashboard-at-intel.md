---
date: "2026-05-31"
project: understory-labs-site
session: "Field Station shipped — intelligence dashboard at /intel"
tags: [feature, ai, launch]
type: ship
---

## Features

- Field Station intelligence dashboard shipped at `/intel` — surfaces AI-enriched items from the field-notes pipeline for weekly review
- Two-panel layout: 220px sticky source sidebar with amber active state + scrollable content area; source tabs collapse to a horizontal strip on mobile
- Three-lens scoring per item — Signal (amber), Learning (teal), Relevance (green), each on a 1–10 bar with fill transition and glow
- ItemCard expands three sections on demand — Why Trending, Insights, Relevance — each collapsed by default to keep the digest scannable
- Approve / Reject review flow per item — confirm step with optional note field, optimistic state update, reverts on server error
- Sort and filter bar sticks below the briefing header — sort by any score axis, filter by enrichment status (all / pending / approved / rejected)
- Own visual identity distinct from the Cybernetic Nature main site — `--intel-bg-deep #0f1117`, Instrument Serif (editorial display), Geist Sans/Mono (UI + data labels), amber bridges to site accent

## Infrastructure

- `/api/intel/review` POST route writes to `fn_enrichments` via `SUPABASE_SERVICE_ROLE_KEY` — anon key correctly excluded from write path
- `--intel-*` CSS variables scoped in `globals.css` — no color collisions with main site palette
- Instrument Serif, Geist Sans, and Geist Mono added to root layout via `next/font/google`

## Lessons

- Tailwind v4 CSS variable tokens don't participate in opacity modifiers (`bg-intel-bg/80` outputs solid color) — inline `style` props with raw CSS variables are the correct pattern for scoped design systems that aren't in the Tailwind config
- Service role key must be a non-`NEXT_PUBLIC_` env var in Vercel; the public key won't pass RLS write policies regardless of how the client is constructed

## TODO

- Peer Sync source card design exists but source is not live — awaiting the peer `/api/peer` endpoint from Naptown Labs
- `ProjectIcon` images still pending at `public/icons/`
- `insert-release-note.ts` schema mismatch — script uses `body`/`released_at` but table has `content`/`published_at`; fix when release notes are next used
