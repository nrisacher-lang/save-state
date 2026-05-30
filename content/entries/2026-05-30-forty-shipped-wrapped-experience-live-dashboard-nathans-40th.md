---
date: "2026-05-30"
project: forty
session: "forty shipped — wrapped experience + live dashboard, Nathan's 40th"
tags: [feature, launch]
type: ship
---

## Features

- Full wrapped experience shipped — 24 full-screen cards across four acts (The Human → The Builder → The Gaming → The Close), Terminal Embers design system (void black, ember amber, Bebas Neue stats, Playfair narrative, IBM Plex Mono labels), horizontal slide transitions with blur at peak
- Live dashboard persists after the wrapped handoff — 3-level BI drill-down (Portfolio → Category → Project), cross-filtered with pure React state; 5 KPI tiles, contribution heatmap merging three sources, weekly activity trend, language donut, full changelog browser; data stays live and will reflect new work Nathan ships
- Easter egg system — 9 easter eggs total, each unlocking an achievement toast with a Web Audio API fanfare chord; eggs span hover tooltips, a full project name flash-roll overlay, a gauge needle that bounces past 100%, a hidden `/eggs` route surfaceable via page source, and a returning visitor CTA that changes on second visit
- Leonardo AI backgrounds — 20 risograph/duotone images (amber + deep blue-black, Wide 2.4:1) generated and dropped into `public/cards/`; cards reuse images deliberately to maintain visual coherence across the gaming section
- Riot API integration — TFT stats pulled via PUUID-direct match endpoint (50 matches, placement distribution chart with bimodal 1st/7th symmetry visible); League champion mastery and ARAM stats fetched for a dedicated League card; data pipeline connects directly to the codec project being built with the same API
- Data engine — `useNathanData()` hook fetches Home API + Gitea in parallel on load, parses all 20 changelogs client-side, computes KPIs per project, merges heatmap from three sources; all wrapped card stats bind to live data with zero hardcoded numbers in components

## Infrastructure

- Next.js API proxy routes — all Home API and Gitea calls proxied server-side; keys never reach the client; `HOME_API_KEY` and `GITEA_TOKEN` in Vercel env vars only
- `tft-static.json` pattern — Riot dev key window used to fetch and freeze match data; `/api/data/tft` serves the static file at runtime with no live key dependency
- Deployed at `forty.understorylabs.co` — Cloudflare CNAME to Vercel; manual `vercel --prod` deploy

## Lessons

- SVG `transform-origin` pixel values are unreliable when the SVG renders at a different size than its viewBox — the fix is a `<g transform="translate(cx cy)">` wrapper so CSS `transform-origin: 0px 0px` works correctly regardless of scale
- `useState(initialValue)` only runs once when React reuses a component instance at the same tree position — syncing derived display state requires a `useEffect` that watches the relevant prop
- Tailwind `prose` plugin text color overrides (arbitrary classes and CSS custom properties both) fail against deeply nested markdown content — removing `prose` and using a custom ReactMarkdown component map with inline `style` props is the reliable fix
- Riot's TFT summoner lookup endpoint returns 401 on dev keys; the match-by-PUUID endpoint does not — PUUID-first is the correct fetch pattern and removes the summoner step entirely
- `position: absolute` inside a `flex flex-col justify-end` container requires `position: relative` on the container — without it the absolute element escapes to the nearest positioned ancestor
- LoL bot game queues (830/840/850) return empty match history for custom games — custom matches are not in the standard match API regardless of queue filter
