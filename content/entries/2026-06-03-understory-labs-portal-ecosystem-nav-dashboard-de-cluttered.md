---
date: "2026-06-03"
project: current-os
session: "Understory Labs portal — ecosystem nav + dashboard de-cluttered"
tags: [feature, refactor]
type: session
---

## Features

- Understory Labs portal added — ⬡ header button (all modes) opens a centered overlay with 3×2 section tiles: Intel, Wiki, Infra, Log, Projects, Home; each opens `understorylabs.co` in a new tab
- Meal Plan and Shopping collapsed to FABs — removed from the left gravity column, reducing it to three cards (Brief, Tasks/Radar)
- Shed FAB (⌂) added to the bottom-right cluster — opens ProjectsOverlay directly; overlay header renamed PROJECTS → SHED to disambiguate from the Understory Labs /projects link in the portal
- Tasks card gains Radar as a second tab — standalone Radar/Projects gravity card removed; tab state persists to `localStorage("tasksTab")`
- FAB cluster order finalized: Shed | Shopping | Meal Plan | Recipes | Projects (intake) | Notes

## Infrastructure

- Vercel ETIMEDOUT on push-triggered deploy — `vercel deploy --prod` as manual fallback recovered without re-pushing

## Lessons

- "Projects" becomes a naming collision once it appears in two navigational contexts (dashboard overlay and ecosystem portal) — renaming to Shed resolves the ambiguity and makes each thing's purpose immediately clear
- Secondary features that are pure click-targets to overlays are FAB candidates, not gravity card candidates — the gravity column is for content-first widgets, not action launchers
- Tab-merging two single-purpose cards (Tasks + Radar) reduces cognitive load without losing access; the right test is whether both views share the same audience and use moment
