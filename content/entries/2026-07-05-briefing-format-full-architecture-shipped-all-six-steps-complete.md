---
date: "2026-07-05"
project: field-notes
session: "Briefing Format — full architecture shipped, all six steps complete"
tags: [feature, ai, phase]
type: ship
---

## Features

- Briefing format architecture complete — all six plan steps shipped; Field Station `/intel` now renders structured BriefingBody blocks across all four sources
- `BRIEFING_TYPES` manifest drives all card and API behavior — approve/reject only renders for `curated: true` sources, eliminating the button leak on research and peer cards
- Block schema introduced (`blocks.ts`) — eight typed block variants: `section`, `callout`, `table`, `quote`, `steelman`, `scorecard`, `bottom_line`, `markdown`; each block carries markdown prose with inline `[n]` citation markers
- Phase 3a + 3b `BlockRenderer` ships in full — all eight block types render; `react-markdown` handles prose; citation markers auto-link to sources; unknown block types degrade gracefully to null
- Full-read route `/intel/[slug]` live — each briefing card links to a dedicated dispatch view rendering the complete `BriefingBody`
- Human-readable slugs on all items — `YYYY-MM-DD-kebab-title` format; `getItemById()` accepts UUID or slug with automatic detection; existing UUID links still resolve
- GitHub-trending CCR now emits `BriefingBody` — Why It's Trending, Technical Overview, optional For Understory Labs, scorecard, and APPROVE/PASS `bottom_line` verdict
- Researcher CCR now emits `BriefingBody` — Overview, Key Findings, Analysis, and `bottom_line` verdict
- Lore-changelog restructured — one weekly `project-snapshot` item per scan; all commits rolled up; inline `BriefingBody` written at scan time without a CCR trigger
- Peer-activity inline enrichment added — `BriefingBody` built from session log, active projects, and penpal state at scan time; `bottom_line` SUMMARY verdict

## Bug Fixes

- Duplicate `GET` export in `enrichments/route.ts` blocked Turbopack build — second copy removed
- `ResearchIntakeModal` TypeScript error after `slug: string | null` added to `IntelItem` — resolved by adding `slug: null` to the optimistic item object

## Infrastructure

- `fn_intel_items.slug` column added via Supabase SQL editor — `TEXT UNIQUE`, nullable; existing rows null until backfill
- `app/api/_lib/slug.ts` — `generateSlug(title, isoDate)` used in all four scan and intake routes
- `ITEM_TYPE_TO_BRIEFING_TYPE` extended with `'changelog-entry': 'lore-changelog'` for backward compat with pre-Step-6 lore items

## Lessons

- Supabase DDL cannot run via PostgREST — `ALTER TABLE` requires the SQL editor or a migration file; the service role key hits the REST layer, not the SQL engine
- `[n]` citation markers in markdown strings don't auto-link in ReactMarkdown — preprocessing to `[[n]](#source-n)` before the string reaches the component is required
- Per-commit lore items created noise without observation value — restructuring to one `project-snapshot` item per scan, with commits in `item_data`, is the right unit

## TODO

- Backfill `slug` for existing `fn_intel_items` rows — SQL UPDATE with `YYYY-MM-DD-kebab-title` pattern against existing `title` + `created_at`
- Verify full-read view renders correctly against live data (real enriched items)
- Phase 3b block types in production — confirm callout, table, quote, steelman, scorecard render against CCR output
