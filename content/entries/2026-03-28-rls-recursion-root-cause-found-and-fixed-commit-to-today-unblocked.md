---
date: "2026-03-28"
project: current-os
session: "RLS recursion root cause found and fixed — commit-to-today unblocked"
tags: [bug, infrastructure]
type: session
---

## Bug Fixes

- Half-screen scroll restored — `overflow-hidden` on `<main>` was clipping the stage at ~540px; replaced with `overflow-y-auto` and added `minHeight: 640px` to the grid wrapper so `fr` rows have a usable definite height
- Stale closure in `TaskListWidget` `items-changed` handler fixed — handler was capturing a stale `loadTasks` reference; `useRef` + `useCallback` pattern ensures the latest version is always called
- RLS infinite recursion (`42P17`) resolved — `projects` SELECT policy queried `project_collaborators`, whose policy queried `projects`, creating a deadlock loop on any query joining `projects` (e.g., items → `projects(title)`)
- Fix: `is_project_collaborator()` SECURITY DEFINER function queries `project_collaborators` directly, bypassing its RLS and breaking the cycle; `projects` SELECT policy updated to use it

## Infrastructure

- Diagnostic logging added to `commitToToday` and `TaskListWidget` committed items SELECT to surface silent failures during investigation
- `supabase/schema.sql` synced to match live RLS fix — `is_project_collaborator()` function and updated project table policies now reflected in source of truth
- Committed items moved above regular tasks in render order — visible without scrolling

## Lessons

- RLS policies that reference each other's tables form recursion cycles invisible until a cross-table query hits them — `SECURITY DEFINER` functions break the loop by querying at the function owner's privilege level, not the caller's
- Silent `count=0` failures are harder to diagnose than errors — adding a read-back SELECT after an update immediately surfaces whether the write landed

## TODO

- Confirm ISSUE-006 fully resolved — RLS fix is applied, but committed items behavior not yet user-verified in live session
- ISSUE-007: work tasks disappear after mode round-trip
- ISSUE-008: work/personal data leaking between modes in daily brief + planning overlay
