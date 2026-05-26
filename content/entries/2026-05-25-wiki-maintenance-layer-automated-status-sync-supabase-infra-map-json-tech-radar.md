---
date: "2026-05-25"
project: understory-labs-site
session: "Wiki maintenance layer — automated status sync, Supabase infra map, JSON tech radar"
tags: [infrastructure, tooling, feature]
type: session
---

## Features

- `projects.status` now auto-inferred by `sync-wiki-state.ts` — active (≤30 days), paused (>30 days), planned (no state row); `complete` is protected from overwrite and must be set manually
- `kitchen-module` inherits status from `current-os` via `STATUS_INHERITS_FROM` map — child projects track parent activity instead of syncing independently
- Infra map migrated from hardcoded arrays to Supabase — `infra_nodes` table with `type`/`parent_id` hierarchy replaces three static constants; grid column count adapts dynamically to container count
- Tech radar extracted from hardcoded page to `src/data/tech-radar.json` — edit the file to update, commit to version-track ring movements; `moved` field added per ThoughtWorks standard
- `claude-code` project added to sync pipeline — `~/.claude` is a git repo, now tracked alongside the other 9 projects

## Infrastructure

- `infra_nodes` table created in Supabase with RLS enabled — `SELECT` policy grants anon key read access; all 4 node types (compute, service, monitoring, external) seeded from prior hardcoded data
- `projects_status_check` constraint updated to include `complete` — original constraint only allowed active/paused/planned
- `wiki/tech/page.tsx` drops `force-dynamic` — JSON import makes the page statically generated at build time
- `backfill-wiki-activity.ts` and `seed-wiki-life-automation.ts` committed to save-state repo — `claude-code` missing from `backfill` PROJECT_PATHS, add before running

## Lessons

- Supabase check constraints don't inherit from TypeScript types — a `ProjectStatus` type with `complete` doesn't mean the DB constraint allows it; the constraint must be explicitly updated to match
- Static generation is appropriate for config-file-backed pages — `force-dynamic` adds server overhead with no benefit when the data source is a committed JSON file
