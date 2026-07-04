---
date: "2026-07-04"
project: current-os
session: "Research dispatch — Field Station form + CaptureOverlay tab"
tags: [feature, ai, infrastructure]
type: session
---

## Features

- Research dispatch form ships in Field Station — ◎ DISPATCH button in the intel header opens a modal to submit a new research topic, context, and urgency directly from `/intel` (understory-labs-site)
- Dispatch button now visible on all Field Station source views — previously gated to the Research view; `isResearchView` condition removed from `IntelShell`
- Research dispatch tab added to CaptureOverlay — Capture | Research switcher in the capture card; topic, context, urgency, and ◎ Dispatch flow wired end-to-end, dispatching cross-origin to understory-labs-site
- Field Station wiki guide expanded with before-click annotated screenshots — sidebar navigation and DISPATCH button location shown before each result screenshot, not just after

## Bug Fixes

- CaptureOverlay research dispatch routed to `https://understorylabs.co/api/research/submit` after hitting the Hobby plan 12-function limit on life-automation
- `.vercelignore` corrected to exclude only `api/notes/` — first version also excluded `src/notes/`, breaking the TypeScript import of `MarginPage` in `App.tsx`

## Infrastructure

- CORS added to `/api/research/submit` in understory-labs-site — allows `https://life-automation.vercel.app` to POST directly; `FIELD_NOTES_CRON_SECRET` stays server-side in understory-labs-site
- `FIELD_NOTES_CRON_SECRET` propagated to life-automation Vercel env via `vercel env add`
- `.vercelignore` added to life-automation — excludes `api/notes/` from Vercel deployments to stay under the 12-function Hobby plan limit

## Lessons

- life-automation is at exactly 12 serverless functions — Hobby plan ceiling. Any new `api/*.ts` fails deployment. CORS on an existing endpoint in another Vercel project is the right pattern when the function budget is full.
- `vercel env pull` without `--environment=production` silently misses production-only secrets — the file looks complete but the keys aren't there.
- `api/notes/` and `src/notes/` look symmetric in a `.vercelignore` but have completely different consequences: one is dead serverless functions, the other is a live TypeScript import.
- Before-click screenshots make how-to-use guides dramatically more useful — showing where to find a button is often harder than recognizing the result page.
