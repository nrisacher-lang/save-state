---
date: "2026-03-29"
project: current-os
session: "Work block reservation — weekday personal time now realistic"
tags: [bug, feature]
type: session
---

## Features

- `/start` skill now surfaces the full unworked feature backlog at session open — deferred candidates, wishlist items, and open design questions pulled from memory and design-notes
- Backlog section grouped into "Ready to plan" and "Wishlist" with a pointer to `/scope` for details

## Bug Fixes

- Online mode on weekdays no longer reports 8am–5pm as personal free time — `reserveWorkBlock` parameter added to `computeDayContext` in the context engine
- DailyBriefWidget, RadarWidget, and the AI context string all respect the work block — eligible items, day weight, and suggestions now reflect morning/evening availability only
- RadarWidget now mode-aware via `useMode()` — eligibility recomputes on mode switch
- ISSUE-008 closed — all three sub-items resolved across two sessions

## Lessons

- The context engine grid (8am–6pm) only sees 1 hour of personal free time after a 9-hour work block — the heuristic naturally suppresses discretionary items on weekdays, which is the right behavior
- A default parameter (`reserveWorkBlock = false`) kept the change backward-compatible without touching every existing call site
