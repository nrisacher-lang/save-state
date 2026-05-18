---
date: "2026-05-17"
project: current-os
session: "Kitchen Module complete — KM-6 intelligence layer and KM-7 n8n automation"
tags: [feature, ai, infrastructure]
type: session
---

## Features

- KM-6 intelligence layer complete — meal plan context flows into daily brief (tonight's dinner, defrost reminders)
- Dietary flag warnings in meal plan recipe picker — flagged recipes show ⚠ with hover tooltip listing flags; `dietary_flags` fetched on all recipe loads including quick-add path
- Preference learning — `completeShopping()` writes `preferred_store` back to `recipe_ingredients` for every checked item that has a source ingredient row; store routing improves automatically after each trip
- AI suggestion upgrade — `meal-suggest.ts` now labels each recipe `fresh` or `recent` (2-week cutoff), includes `avg_cost`, derives season from `weekStart`, adds variety/budget/seasonal constraints to prompt

## Bug Fixes

- Removed unused `CSSProperties` import from `ShopMode.tsx` — Vercel strict build rejected it; local `tsc --noEmit` did not catch it
- Fixed `RecipeSummary` type mismatch on quick-add path — `dietary_flags` and `avg_cost` missing from select caused build failure on Vercel

## Infrastructure

- Migration 009 — `price_alerts` table; written by n8n price monitor and sale surfacer; indexed for unseen alerts per user
- `api/meal-suggest.ts` auto-draft sub-action — n8n calls `action: "auto-draft"` with `userId` + `weekStart`; server fetches recipes, runs Claude, upserts `meal_plan`, clears and rewrites entries and cook events; secured by `X-Automation-Secret` header
- 4 n8n workflows imported and activated on CT 102: weekly plan drafter (Thu 8pm), price monitor (daily 2am), sale surfacer (Sun 6pm), pantry nudger (daily 8am)
- `SUPABASE_URL` added to Vercel dashboard — auto-draft sub-action requires it separate from `VITE_SUPABASE_URL`
- `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` added to n8n docker-compose — required for `$env` access in Code nodes
- `AUTOMATION_SECRET` shared between Vercel and n8n — n8n docker-compose env var, Vercel dashboard env var, Vaultwarden entry

## Lessons

- Vercel's strict TypeScript build catches errors local `tsc --noEmit` misses — always treat a passing local check as necessary but not sufficient
- The 12-function Vercel hobby limit is a real architectural constraint — sub-actions on existing functions (auto-draft in meal-suggest, costco-lookup in shopping-generate) are the right pattern; adding files is not
- n8n Variables is a paid feature; Docker environment variables with `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` is the self-hosted equivalent — same `$env.VAR` syntax in Code nodes
- Heredocs reliably fail in LXC consoles and sometimes in PowerShell — scp a locally-written file instead of trying to write multiline content via paste

## TODO

- Bud RecipeHandler — recipe email ingestion via n8n Gmail trigger; build in bud project session
- n8n timezone check — container runs UTC; verify Thu 8pm schedule aligns with local time (`date` on CT 102)
- Kroger production API approval — currently on Certification sandbox; apply when ready for real prices
