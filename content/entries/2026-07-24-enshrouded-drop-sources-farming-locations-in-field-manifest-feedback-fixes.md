---
date: "2026-07-24"
project: codec
session: "Enshrouded drop sources — farming locations in Field Manifest, feedback fixes"
tags: [feature, infrastructure]
type: session
---

## Features

- Drop sources enrichment live — `scripts/enrich-enshrouded-drops.ts` pulls the wiki `Drops`
  Cargo table (286 rows), matches to `ref_items` by slug, writes `drops: [{ source, qty, type }]`
  into `properties`; 91 items enriched, idempotent on re-run
- Field Manifest source pills — raw materials in the gather list now show which enemies or nodes
  drop them (up to 4 shroud-styled pills with +N overflow); players can farm without leaving the page
- Item detail "FOUND ON" section — raw material detail pages surface drop locations with a
  "MORE ON WIKI ↗" link; falls back to the Google search button when no drop data exists
- Ember/shroud glyph color fix in the codec how-to-use guide — ◈ and ◇ now render in their
  correct design-system colors; required named React components (`Ember`, `Shroud`, `EmberSpan`,
  `ShroudSpan`) as a workaround for `next-mdx-remote/rsc` style stripping

## Infrastructure

- Bearer token auth path added to `/api/wiki/feedback` — codec server-to-server calls authenticate
  via `CODEC_API_KEY`; `game_slug` column added to `public.wiki_feedback` (additive, nullable —
  existing wiki inserts unaffected)

## Bug Fixes

- Enrichment upsert rejected with NOT NULL violation on `category` — `ON CONFLICT DO UPDATE` still
  validates all NOT NULL constraints before routing to UPDATE even when the row exists; fixed by
  switching to individual `.update().eq("id")` calls

## Lessons

- `next-mdx-remote/rsc` silently strips `style={{ }}` props from inline MDX JSX — DOM inspection
  confirms `style attr: null` at runtime; define named components in the page file with styles in
  TypeScript and reference by name in the MDX
- Postgres `ON CONFLICT DO UPDATE` validates NOT NULL constraints on the INSERT row before checking
  for a conflict — partial upserts that omit required columns fail even when the row already exists
- MediaWiki Cargo's `Drops` table has 40 slugs that don't match `ref_items` — name discrepancies
  between the `Ingredients` table (ETL source) and `Drops`; 91/131 is still solid coverage for v1

## TODO

- Quest search — open feedback submission: "be able to search for quests — to see where gives the
  quest and what the quest chain is"; no quest data in DB yet, needs a wiki data source
- Field Manifest full test — carry-forward from launch: mark recipes wanted across two accounts,
  verify BOM totals, assign materials, confirm realtime sync
