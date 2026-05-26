---
date: "2026-05-25"
project: current-os
session: "Projects overlay — backlog/duplicate statuses, multi-image, three bug fixes"
tags: [feature, bug, infrastructure]
type: session
---

## Features

- `backlog` and `duplicate` project statuses — backlog defers a project without archiving, duplicate closes with a visible label and no data loss
- Both groups collapse by default in the status list — generic `expandedGroups` Set replaces the previous `completedExpanded` boolean; any status added in the future collapses automatically if listed in `COLLAPSED_BY_DEFAULT`
- Multi-image support — `project_images` table stores photos and schematics per project; Photos section in the detail view with `+` tile upload and per-image `×` delete
- First uploaded photo auto-sets `image_url` card thumbnail; deleting the thumbnail rolls forward to the next photo or clears it

## Bug Fixes

- Archive silent failure — `archiveProject()` had no error check; a failed DB write removed the project from local state but it reappeared on refresh; now reverts optimistic update and surfaces the error
- Negative `estimated_hours` display — `type="number"` input accepted negative entry; fixed with `min="0"` on input and `Math.abs()` in all display and group sum paths
- Broken image thumbnail — no `onError` on project card `<img>`; invalid storage URLs showed the broken image icon; now hides silently via inline `style.display = "none"`

## Infrastructure

- Migration 010 — `project_images` table (photo/schematic type column, `storage_path`, RLS mirroring projects access model); `projects.status` CHECK constraint expanded to include `backlog` and `duplicate`
- Migrations 011, 012 — schematic image type and additional column additions applied

## Lessons

- Supabase optimistic updates without `{ error }` check create ghost state — UI shows success, failed write reverts on next load; always destructure `error` from mutations and revert local state on failure
- `type="number"` inputs accept negative values regardless of semantic context — add `min="0"` and normalize display with `Math.abs()` for any field where negative is invalid

## TODO

- PI-5 Bug 1 — `saveProject()` in `ProjectIntakeOverlay.tsx` never inserts `project_resources`; steps, materials, and tools save correctly; resources don't
- PI-5 Bug 2 — research service may not be surfacing PDFs (results come back as `search`/`video` type); hit Taproot API directly to diagnose before writing code
- n8n timezone check — CT 102 likely running UTC; verify cron schedule alignment with local time (`date` on CT 102)
