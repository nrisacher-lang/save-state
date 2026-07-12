---
date: "2026-07-11"
project: field-notes
session: "Fact-check CCR live — all three ad-hoc pipelines fully operational"
tags: [feature, ai, infrastructure]
type: session
---

## Features

- `field-notes-fact-checker` CCR cloud trigger live (`trig_01MgKXUkqAhSoEy4aDsDRVy4`, daily 10am EDT) — fact-check briefing type now fully operational end-to-end: intake → frontend → CCR enrichment → verdict badge
- CCR uses adversarial verification — four search angles (corroborate, debunk, primary sources, outlet credibility) converge to a required steelman block and a `bottom_line` with a verdict (TRUE/FALSE/MISLEADING/UNVERIFIED/MIXED)
- `ItemCard` fact-check branch added — `VERDICT_STYLES` map drives color-coded verdict badges; `isFactCheck` guard prevents fact-check items from hitting the standard score-bar branch, which looks for Relevance/Signal/Learning scores that don't exist
- Product-researcher CCR closed the prior entry's TODO — `field-notes-product-researcher` routine live (`trig_01DTP3MHZJ9E75PYypYUxU69`); all three ad-hoc pipelines (research, product research, fact-check) now have CCR enrichment
- Pipelines wiki live at `understorylabs.co/wiki/field-notes` — Quick Reference table, ASCII decision tree, per-pipeline intake fields, example JSON, analysis description, and verdict vocabulary for all six briefing types

## Bug Fixes

- Markdown tables in wiki MDX now render as HTML tables — `remarkGfm` wired to all six `MDXRemote` calls in `page.tsx`; earlier sessions imported the plugin but didn't pass it to the component options

## Infrastructure

- `scripts/run-fact-checker.ps1` added — version-controlled source of truth for the CCR prompt; runnable locally for one-off passes
- `Claude_Code_Remote` connector behavior documented in global gotchas — auto-attaches when a repo is selected on a new CCR routine; "No more connectors available" in the Add connector dropdown is correct, not an error

## Lessons

- `scored: 'verdict'` in the BRIEFING_TYPES manifest is truthy — without a dedicated `isFactCheck` guard, the standard score-bar rendering branch fires on fact-check cards and silently renders nothing (scores don't exist for verdict-type enrichments)
- Supabase duplicate-key errors during INSERT look identical to new write failures — the constraint name (`fn_intel_sources_slug_key`) in the error body is the signal that the row already exists; a clean 409 means success in this context
- CCR WebFetch hits a ~300-char URL ceiling — fact-check briefings with a full evidence ledger, steelman, and five sources exceed this even URL-encoded; Python `urllib` POST is the required path for all enrichment submissions

## TODO

- Commit `scripts/run-fact-checker.ps1` and updated `CLAUDE.md` to field-notes repo — both untracked/modified
- Financial summaries briefing type — next new type; Bud purchases table has 39 rows but categorization is poor (mostly `"other"` or null); needs better Ollama prompt + category taxonomy before the field-notes scan route can pull meaningful data
