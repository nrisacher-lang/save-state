---
date: "2026-03-28"
project: current-os
session: "Mode separation, RLS cleanup, issue sweep"
tags: [bug, infrastructure]
type: session
---

## Bug Fixes

- ISSUE-006 confirmed resolved — committed items not surfacing in TaskListWidget was caused by RLS infinite recursion on the `projects` SELECT policy, fixed in a prior session
- ISSUE-007 confirmed resolved — work tasks disappearing after mode switch was the same root cause: `fetchTasks` joins `items → projects(title)`, triggering the same recursion; optimistic insert appeared to succeed but every re-query returned null, making persistence look broken
- ISSUE-008 (sub-problems 1 + 3) — `DailyBriefWidget` lacked mode awareness entirely; weekday tasks query had no `mode` filter, leaking work tasks into the Online brief
- Brief cache key was `current-os-facts-{date}` — shared across modes; switching Online → Work reused cached Online facts; key is now `current-os-facts-{mode}-{date}`
- "Work availability" label in the AI context string renamed to "Available time" — was mode-biased in Online brief context

## Infrastructure

- `DailyBriefWidget` now uses `useMode()` — tasks query always filters by mode, AI context hint is mode + weekend aware across four combinations
- ISSUE-009 resolved — four "Project member reads X" SELECT policies in live DB updated via Supabase SQL Editor to use `is_project_collaborator()` instead of inline subquery; migration file synced to match

## Lessons

- A single circular RLS policy (`projects → project_collaborators → projects`) silently killed every query that joined to `projects` — the join itself was the trigger, not the query result; two distinct-looking bugs shared one root cause
- Mode awareness needs to be explicit at every data boundary — a missing `useMode()` import left the brief entirely uninformed about which context it was writing for
- DDL statements in Supabase (DROP POLICY / CREATE POLICY) return "no rows" on success — expected behavior, not an error

## TODO

- ISSUE-008 sub-problem 2 remains: planning overlay work block reservation (8am–5pm M–F in Online mode) — requires `reserveWorkBlock` flag in `computeDayContext` so `freeHours` reflects evening/morning personal time on weekdays
