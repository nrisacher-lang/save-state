---
date: "2026-07-26"
project: current-os
session: "Kitchen module overhaul — URL capture, auto-grocery, calendar-aware suggestions"
tags: [feature, ai]
type: ship
---

## Features

- Kitchen module overhaul ships — meal planning, grocery sync, and recipe import unified into a zero-friction flow
- URL quick-capture: paste a recipe link directly into the meal plan picker — recipe and ingredients import in one step, no draft or triage detour
- Grocery list auto-syncs after every plan change — a fire-and-forget call to `/api/shopping-generate` runs on every save and delete, no "Generate" button required
- Week suggestion now reads Google Calendar before calling the AI — recommendations account for what's actually on the schedule, not a hypothetical empty week

## Infrastructure

- Migration 016: `source` column on `shopping_list_items` (`'generated'` vs `'manual'`) — regeneration clears only AI-built rows, preserving manual additions across syncs

## Lessons

- Silent full-regeneration (re-run the entire shopping-generate on every plan change) was cleaner than surgical per-recipe tracking — reuses existing logic and handles removes correctly, which per-recipe tracking would have missed
- `source` column (not a `recipe_id` FK) was the minimum schema change needed — full-regeneration doesn't require item-to-recipe provenance, only a safe-to-delete flag
- Google Calendar `provider_token` is available client-side via `supabase.auth.getSession()` — no separate OAuth scope or backend proxy needed
- On-demand calendar fetch scoped inside `suggestWeek()` was right — not a shared context, not a cached subscription, one fetch when the user clicks
