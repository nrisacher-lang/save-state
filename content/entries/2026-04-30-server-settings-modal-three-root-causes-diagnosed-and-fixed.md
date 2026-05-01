---
date: "2026-04-30"
project: lore
session: "Server settings modal — three root causes diagnosed and fixed"
tags: [bug, feature]
type: session
---

## Bug Fixes

- SceneLayer missing from channel page — dropped in Nathan's layout redesign merge (`dde6164`), wired back via useEffect + `PlaceThemeRegistry` side-effect imports in `ChannelPage`
- Server settings modal closes immediately on open — React 18 synchronous flush processes the backdrop click in the same tick; fixed with `setTimeout(() => setShowServerSettings(true), 0)`
- Server settings modal lost on channel navigation — local `useState` resets when `ChannelPage` remounts on route change; fixed by lifting to `useUIStore.serverSettingsServerId` in Zustand
- TOC header (server name) invisible — `absolute inset-0` texture overlay painted over the header div, which had no stacking context to escape; channel list visible because `overflow-y: auto` creates one; fixed with `z-index: 0` on overlay and `relative z-10` on header and footer

## Infrastructure

- `.vercelignore` at repo root: excludes `apps/web/public/places/*/sound/` (~640MB WAV) and `docs/poc/` (~320MB POC audio); Vercel CLI reads this from the invocation directory, not from `rootDirectory` in the dashboard — file at `apps/web/` had no effect
- Vercel deploy now succeeds — upload dropped from 641MB to 2.9KB after exclusions

## Lessons

- Three separate bugs shared one symptom (modal not accessible) — each required a different diagnosis: React timing, component lifecycle, CSS stacking order
- CSS stacking order is non-obvious when `overflow-y: auto` creates a stacking context for some children but not others — same overlay covers some siblings and not others depending on their CSS properties
- Local testing against a live API requires CORS allowance for the dev origin; without it, even token injection workarounds hit the 15-minute JWT expiry wall before anything can be verified
- Vercel `.vercelignore` placement is not documented prominently — it must live where `vercel deploy` is invoked, which differs from where `rootDirectory` is set in the dashboard

## TODO

- Nathan to review and merge `fix/server-settings-click-through` PR on Gitea
- Nathan to add `http://localhost:3002` to `EXTRA_ORIGINS` to unblock local testing
