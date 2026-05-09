---
date: "2026-05-09"
project: current-os
session: "Kitchen Module KM-1 — recipe foundation, URL import, conversational intake"
tags: [feature, ai, infrastructure]
type: session
---

## Features

- Kitchen Module brainstormed and planned — 7-step plan covers recipe management, AI meal planning, batch cooking, pantry tracking, store-routed shopping lists (Kroger + Costco + Amazon), mobile `/shop` route, cost-per-recipe historicals, and n8n automation
- Recipe URL import — two-pass extraction: Schema.org JSON-LD first (zero AI cost on major recipe sites), Claude Haiku fallback for sites without structured data
- Conversational recipe intake — multi-turn Sonnet conversation builds a full recipe from natural description; auto-drafts when `readyToDraft` is true, manual trigger available after 2+ rounds
- Dietary flag scanning — soy derivatives and pea protein watchlists enforced at both import paths; soy-containing ingredients flagged inline during conversational flow
- `RecipesOverlay` — full overlay with list, detail, URL import, conversation, review/edit, and manual entry phases
- Recipe access wired into both shells — `⊛` FAB at bottom-right in DashboardShell, Recipes button under KITCHEN section in MobileShell More tab
- Kroger developer account registered — Certification environment, Products + Cart API products; Production approval is a separate step

## Infrastructure

- Migration 003 — `recipes` and `recipe_ingredients` tables with RLS; soft delete (`deleted_at`); `dietary_flags` and `tags` as `TEXT[]`; `source_type` constrained to `manual | url-import | conversational | email`
- ISO 8601 duration parser — `PT1H30M → 90`; handles hours-only and minutes-only variants
- Schema.org extractor handles `@graph` arrays, root arrays, and direct Recipe objects — covers all major recipe site structural variants
- Markdown fence stripping on all Claude API responses — both handlers strip ` ```json ` wrappers before `JSON.parse`

## Lessons

- Schema.org JSON-LD is reliable and free on major recipe sites — Haiku fallback is the exception, not the rule
- Dietary awareness needs two enforcement layers: prompt-level (inline warning during conversation) and data-level (scanner on all ingredients at save time) — one layer alone can be bypassed
- Store routing follows each platform's natural access point — Kroger has a developer API, Costco has a web interface, Amazon has direct search URLs; forcing a uniform integration pattern onto all three would be the wrong abstraction
- `scrollIntoView()` on nested scroll containers scrolls all ancestors — fixed by targeting `containerRef.current.scrollTop` directly on the specific chat div

## TODO

- Apply `supabase/migrations/003_kitchen_module.sql` in Supabase SQL Editor before testing
- Test URL import with 3–5 real recipe URLs; test conversational flow with 2–3 meals
- KM-2: Meal Planning — `meal_plans`, `meal_plan_entries`, `cook_events` schema + MealPlanOverlay weekly grid
