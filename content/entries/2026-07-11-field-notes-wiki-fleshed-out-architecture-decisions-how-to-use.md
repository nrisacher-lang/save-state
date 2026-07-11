---
date: "2026-07-11"
project: field-notes
session: "field-notes wiki fleshed out — architecture, decisions, how-to-use"
tags: [infrastructure, feature]
type: session
---

## Features

- `architecture.mdx` added to field-notes wiki — covers all five pipeline paths (ascii flow diagrams), Supabase schema, BRIEFING_TYPES manifest, and Vercel deployment notes
- `decisions.mdx` added — seven entries documenting BriefingBody block schema, inline vs CCR enrichment split, Python urllib POST for CCR submissions, `?token=` auth pattern, `fn_` prefix rationale, ad-hoc source sidebar exclusion, and weekly snapshot restructure
- `how-to-use.mdx` added — quick reference table, per-source workflow docs, typical tasks, troubleshooting table, and build/deploy notes including CCR trigger prompt paths

## Bug Fixes

- `ItemCard` now reads confidence and confidence reasoning from BriefingBody `bottom_line` block — old flat-field format and new block format both handled without breaking existing github-trending cards

## Infrastructure

- ISSUE-028 closed — ad-hoc sources confirmed absent from SOURCES sidebar; verified by user after deploy
