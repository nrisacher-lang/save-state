---
date: "2026-07-03"
project: understory-labs-site
session: "Research briefing view — shipped"
tags: [feature, ai]
type: ship
---

## Features

- Research briefing view ships in Field Station — ad-hoc research requests submitted to the field-notes pipeline now surface as enriched cards in `/intel` under a dedicated Research section
- Each card renders the Researcher's full output: key findings (string list), prose analysis, confidence chip with reasoning tooltip, recommendations, and cited sources with trust levels and excerpts
- `IntelShell` routes a virtual `__research__` slug to the new section — no URL changes, no new pages; sidebar and mobile chip handle navigation entirely within the existing intel layout
- `getResearchBriefings()` uses a two-step Supabase query — items fetched by `item_type`, enrichments joined in JS — because Supabase cannot filter a parent table by a child table's column in one step

## Infrastructure

- `briefing_content` JSONB on `fn_enrichments` is now typed and extracted in `src/lib/intel.ts` — `mapEnrichment()` passes it through as `Record<string, unknown>` with named field extraction at render time
- `SourceBadge` extended with `research-request` type — blue `#82a0d2` badge, `◎ research` label

## Lessons

- Assuming Researcher output matches deep-research output shape was wrong — the Researcher CCR uses a completely different schema (`key_findings[]`, `analysis`, `relevance.recommendations[]`) vs. the built-in workflow (`findings[].claim`, `caveats`, `openQuestions[]`). The right move was to trigger the Researcher manually, query the actual `fn_enrichments` row, and build the render to match what came back.
- TypeScript union cast through `unknown` is the correct pattern when a discriminated union type overlaps with a sibling type in the same field: `item.itemData as unknown as ResearchItemData`, not a direct cast
