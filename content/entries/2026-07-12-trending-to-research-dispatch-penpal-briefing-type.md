---
date: "2026-07-12"
project: field-notes
session: "Trending → Research dispatch live, Penpal briefing type, fact-check CCR"
tags: [feature, ai, infrastructure]
type: session
---

## Features

- Trending → Research auto-dispatch — approving a GitHub Trending enrichment now creates a `research-request` item in `ad-hoc-research` automatically; `dispatchTrendingResearch()` chains 4 Supabase queries and inserts `item_data.trending_context` carrying all pre-computed scores, insights, and project suggestions from the enrichment
- Researcher CCR prompt extended — CASE A (trending dispatch) runs 4 targeted searches using pre-computed signals; CASE B (standard ad-hoc) runs 3; trending dispatches always include an "Understory Labs Relevance" section; prompt synced to live `field-notes-researcher` cloud trigger via Chrome browser automation
- Fact-check CCR live — `field-notes-fact-checker` routine created (`trig_01MgKXUkqAhSoEy4aDsDRVy4`), daily 10am EDT; adversarial steelman + TRUE/FALSE/MISLEADING/UNVERIFIED/MIXED verdict format
- Penpal briefing type and tab — Nathan walkthrough docs published from CLI via `/penpal-send`; coral accent (`#e8927c`), write-through enrichment at intake, no approve/reject (read-only for Nathan); `IntelShell` gains AD-HOC "Penpal" view
- Penpal doc intake route — `POST /api/intake/penpal-doc` wired to `penpal-doc` source slug
- Cross-project todos page — `/wiki/todos` pulls open items from all Understory Labs projects; `/api/todos` is a public endpoint for downstream consumption

## Bug Fixes

- `isTrendingResearch` flag prevents title regression — trending research items are `research-request` type, so `isAdHoc` was true and the title rendered as plain text even though `external_url` is the GitHub repo; adding `isTrendingResearch` to the render condition restores the `<a>` link
- `penpal-doc` badge gap closed — item type was in `intel.ts` union but absent from `SourceBadge`'s `BadgeItemType` union and `BADGES` record; TypeScript failed on any Penpal item render
- Markdown block renderer gains heading/table/code styles — remark-gfm content now renders correctly inside `BriefingBody` section blocks

## Infrastructure

- `SupabaseClient` imported directly in review route — `ReturnType<typeof createClient>` typed all query `.data` results as `never`, producing ~22 TypeScript errors; direct import from `@supabase/supabase-js` resolves inference correctly

## Lessons

- `ReturnType<typeof createClient>` as a function parameter type collapses Supabase query result types to `never` — import `SupabaseClient` directly; the Supabase generic `createClient` overloads don't preserve through `ReturnType`
- Sharing a Supabase instance across projects eliminates the inter-service HTTP transport entirely — approving in understory-labs-site writes directly into field-notes tables with no new env vars or cross-service error surface
- React controlled textarea inputs ignore direct `.value =` assignment — native setter via `Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(el, val)` followed by `dispatchEvent(new Event('input', { bubbles: true }))` is required to trigger React's synthetic event system

## TODO

- Financial summaries briefing type — recurring, Firefly III on Taproot Postgres (never cloud Supabase); plan not yet drafted
- Gated implementation pipeline — spike on Taproot external access, n8n→CCR webhook, CCR→GitHub egress
