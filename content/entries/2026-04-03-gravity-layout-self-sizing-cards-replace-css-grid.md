---
date: "2026-04-03"
project: current-os
session: "Gravity Layout — self-sizing cards replace CSS grid"
tags: [feature, refactor, phase]
type: session
---

## Features

- Gravity layout system complete — cards size themselves by focus state, dashboard adapts to any height without manual resizing
- `GravityContext`: three card states (focused / resting / collapsed), max 2 focused per column, oldest-first demotion, 60s auto-focus cooldown, localStorage persistence
- `GravityCard` render-prop pattern: widgets receive `variant: 'focused' | 'resting'` and render purpose-built compact views at rest — not shrunken full views
- `GravityColumn`: `narrow` prop collapses dual-column layout to a single scrollable column below 900px
- NowPlaying pinned at top of right column — always visible, no title bar, no collapse
- Mode system simplified: `"online" | "offline"` + `workVisible` boolean replaces the three-mode system
- Work toggle: header pill swaps accent to teal without changing the environment — `data-mode="online-work"` inherits pine-forest base, overrides accent only
- `GravityWatcher`: auto-focus signals wire morning→brief, music starts→lyrics, item captured→tasks

## Bug Fixes

- `LyricsGravityCard` and `QueueGravityCard` never called `registerCard` — `focusCard("lyrics")` was a silent no-op, persistence and focus limits broken for both

## Infrastructure

- `DashboardShell` reduced from ~1094 lines to ~400 — all grid infrastructure (MODE_LAYOUTS, getRows, GridResizeOverlay, expandedCards, rowOverrides) removed
- `/gravity-test` route added for layout testing without auth

## Lessons

- Wrappers around non-GravityCard components need explicit `registerCard` in a `useEffect` — skipping it is a silent failure with no error, just no behavior
- Keeping the environment (pine-forest base) while swapping only the accent makes the work toggle feel like a lens over personal space, not a separate room
- `GravityProvider` must sit outside `key={mode}` — state reset on mode switch is the wrong default for a layout system
