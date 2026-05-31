---
date: "2026-05-30"
project: understory-labs-site
session: "Wiki user guide system — six projects documented with drift detection"
tags: [feature, tooling, infrastructure]
type: session
---

## Features

- HOW TO USE page type added to the wiki — renders first on every project page, above
  architecture, always expanded
- Staleness indicator wired to drift data — "last updated X ago — N feature commits
  since" shown when a guide has fallen behind feature work
- Commit-specific drift classification: `feat:`, `ui:`, `design:`, `ship:` prefixes
  trigger staleness; `fix:`, `refactor:`, `chore:` do not
- Six project user guides written: life-automation (full Kitchen Module + companion + Home
  Projects coverage), kitchen-module, save-state, bud, codec, bark
- `/ship` extended with guide update/create prompt after vault check — fires whenever a
  feature is marked shipped
- `/wrap` extended with ship check — scans for shippable commits before drafting the
  session entry, closing the `/wrap` → `/ship` → guide update chain

## Infrastructure

- `sync-wiki-state.ts` extended with `isFeatureCommit()`, `getGuideLastUpdated()`, and
  `syncGuideDrift()` — runs on every push via the existing pre-push hook
- `guide_last_updated` (timestamptz) and `guide_drift_count` (int, -1 = no guide) added
  to `project_state` table in the save-state Supabase project
- `WIKI_DIR_OVERRIDE` map added to handle project ID → wiki directory mismatches
  (`current-os` → `life-automation`)
- Codec added to `PROJECT_PATHS` — drift tracking now covers 10 projects

## Lessons

- `project_state` lives in the **save-state** Supabase project, not the nrisacher-lang
  project — the dashboard defaults to the wrong one
- Reading `git log` before writing a project's guide surfaces shipped work you've
  forgotten — codec had Layer 2 Steps 1–2 live; the guide would have listed them as
  planned
- `replace_all: true` on Edit only catches the first match when a formatter has changed
  indentation on a second occurrence — target the second block directly
