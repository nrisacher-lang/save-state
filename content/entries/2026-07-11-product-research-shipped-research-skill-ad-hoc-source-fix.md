---
date: "2026-07-11"
project: field-notes
session: "Product research shipped, /research skill live, ad-hoc source display fixed"
tags: [feature, bug, ai]
type: session
---

## Features

- Product-research briefing type shipped end-to-end — intake `POST /api/intake/product-research`, an AD-HOC "Product Research" view, and a read render of comparison `table` → `scorecard` (Fit/Maturity/Value) → `bottom_line` verdict
- Verdict vocabulary is ADOPT/TRIAL/ASSESS/HOLD — the ThoughtWorks Tech Radar rings, the same language the site's tech radar already uses, so briefings can feed it later
- `/research` terminal skill live — dispatches an ad-hoc research request from the CLI and prints a navigable `/intel/<slug>` link
- Ad-hoc views generalized to a data-driven array in `IntelShell` — a future ad-hoc type (fact-check) is now a one-line addition, not a third copy of the research view
- Full-read renderer verified against live data — `section`, `scorecard`, and `bottom_line` all render correctly on a real github-trending briefing, closing the prior session's Phase 3b TODO
- `SourceBadge` converted from nested ternaries to a config map — five item types resolve label, accent, and color from one lookup

## Bug Fixes

- Ad-hoc sources no longer appear in the SOURCES sidebar — `getWeeklyBriefings` week-filters and collapses each source to its single most-recent scan, so ad-hoc feeds (one scan per dispatch) only ever showed the latest submission under a wrong "awaiting analysis" label; now excludes `source_type='manual'`
- The "my dispatch never landed" scare was purely that display artifact — every past dispatch (orthopedic dog beds, both PEMF, harness, SSIS) had landed and enriched fine; they were just invisible in the broken source view
- `ItemCard` rendered a spurious snapshot "active" chip on ad-hoc items — the snapshot cast now excludes both ad-hoc types

## Infrastructure

- field-notes auto-deploy restored — a repo-local `core.hooksPath` was silently shadowing the global pre-push deploy hook; unset it, and `git push` now triggers `vercel --prod`
- Slug backfill complete — 221 existing `fn_intel_items` rows filled with collision-safe `YYYY-MM-DD-kebab-title` slugs via a `ROW_NUMBER` de-dup pass
- `product-research` source registered (`source_type='manual'`); research intake route now returns `slug`
- `CRON_SECRET` added to field-notes `.env.local` — it was absent, so the skill and local dev had no token

## Lessons

- A repo-local `core.hooksPath` silently overrides a global git hooks dir — the push reports success while nothing deploys; check it first when a global hook doesn't fire
- The Supabase SQL editor is Monaco — typing SQL via browser automation corrupts it (auto-closed parens and quotes double up); set the clipboard and paste instead
- field-notes' recurring "triggers" are cloud routines at `claude.ai/code/scheduled`, not local scheduled scripts — the `run-*.ps1` files are only prompt storage
- Surfacing a source both as a SOURCES feed and an item-type view invites divergence — the week-filtered feed and the full item-type list disagreed, and the feed silently won

## TODO

- Product-research CCR deferred — items stay "awaiting research" until manually enriched; prompt source sits in `scripts/run-product-researcher.ps1`
- Em-dash mojibake (`�`) in research titles — an encoding bug at the intake source, not the renderer
- New scan items link by UUID instead of slug in the read URL — the backfill covered existing rows only
