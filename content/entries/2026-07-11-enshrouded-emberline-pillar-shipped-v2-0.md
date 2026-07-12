---
date: "2026-07-11"
project: codec
session: "Enshrouded Emberline pillar — shipped (v2.0)"
tags: [feature, launch]
type: ship
---

## Features

- Enshrouded pillar shipped (v2.0) — full recipe and crafting tracker for modded co-op sessions, sourced from the community wiki and live in production
- 1,964 items and 1,785 recipes loaded via MediaWiki Cargo API (`action=cargoquery`); 5,227 ingredient edges stored in a normalized junction table for recursive traversal
- Campaign system live — create a world by name, share a 6-character invite code; all unlock and wanted state is scoped per campaign and shared across members in real time
- BOM engine (`explode()`) recursively expands any recipe to raw materials, cycle-guarded via `Set`, depth-capped at 12 — crafted intermediates collapse automatically into the final aggregate
- Field Manifest (▤ MANIFEST) turns all wanted recipes into a raw-materials gather list with per-player assignment and live sync via Supabase Realtime
- Artisan unlock info curated for 8 NPCs (rescue location, quest name); unknown unlock paths get a Google search button and a saveable community note — honest where the data runs out
- Wiki feedback form shipped to the how-to guide — bug/suggestion toggle, screenshot upload to Supabase Storage, live RECENT submissions list

## Bug Fixes

- `join_campaign()` returned "Invalid invite code" for all callers — root cause: `codec` schema tables don't auto-grant `INSERT` to `service_role`; fixed by converting to a `SECURITY DEFINER` function owned by `postgres`
- `RETURNS TABLE(campaign_id uuid, ...)` caused "column reference is ambiguous" inside the function body — output variable shadowed the same-named column in `INSERT ... ON CONFLICT`; fixed by switching to `RETURNS void` (required `DROP FUNCTION` + recreate, return type can't change in place)
- ETL recipe FK violations — ingredient edges referenced recipe IDs for items dropped by PostgREST's silent 1000-row cap on the item read-back; fixed with `.range()` pagination
- Wiki tables across 18 files rendered as raw pipe text — `remark-gfm` was imported but not in `package.json`, breaking the build and silently breaking table rendering everywhere; missing dep committed immediately

## Lessons

- Supabase `service_role` bypasses RLS but still needs explicit grants on non-`public` schemas — `service_role` is not omnipotent the moment you use a custom schema
- `RETURNS TABLE(col_name type)` creates output variables that shadow same-named columns inside the function body — use `RETURNS void` when the caller needs no return value
- PostgREST silently truncates `.select()` results at 1000 rows with no error — any ETL read-back or full-table scan needs `.range()` pagination from the start
- Filing the first bug through the new feedback form immediately surfaced a real issue — remark-gfm not wired to `MDXRemote` made every table in the wiki render as pipe text; the tool catching its own gap on first use is a good sign
- MediaWiki Cargo API (`action=cargoquery`) is a clean structured data source for any wiki on the platform — structured JSON, no scraping, covers the full recipe corpus

## TODO

- Rotate the Supabase service-role key — a live key was pasted in chat during this session; rotate in Supabase dashboard and update `.env.local` + Vercel
- Field Manifest full test — mark recipes wanted across two accounts, verify BOM aggregation, assign materials, tick gathered, confirm realtime sync propagates
