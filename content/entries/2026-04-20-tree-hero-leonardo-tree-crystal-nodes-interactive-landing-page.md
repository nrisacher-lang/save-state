---
date: "2026-04-20"
project: understory-labs
session: "Tree Hero — Leonardo tree, crystal nodes, interactive landing page"
tags: [feature, brand]
type: session
---

## Features

- Landing page hero built — full-viewport Leonardo AI tree illustration with 7 interactive crystal nodes positioned over the bark
- Crystal node system: CSS breathing glow (`crystal-breathe`) and expanding ring pulse (`crystal-ring`) keep nodes visible at rest, intensify on hover
- Node map covers the full Understory ecosystem — Bark, Shed, Bud, Taproot, Current OS, Rootstack/Save State, Lore — each linking to its destination (internal routes or external domains)
- Debug coordinate mode: click-to-log x/y positioning tool for placing nodes precisely over the tree image
- Tagline backing: subtle dark pill behind "We build beneath the canopy." for readability against bark texture
- Tree image container uses `aspect-ratio: 2400/3616` so crystal positions stay relative to the image regardless of viewport width

## Infrastructure

- Taproot Status API code complete — Express service (CommonJS, Node 20) with `/health`, `/status`, `/containers`, `/uptime` endpoints; Cloudflare Worker proxy with caching and CORS; deployment guide written. Awaiting deployment to Taproot.
- Cloudflare DNS records configured — A `@` → `76.76.21.21`, CNAME `os` and `log` → `cname.vercel-dns.com` (DNS only). Old Porkbun records deleted.

## Lessons

- Hybrid approach — Leonardo for organic complexity, CSS for electric interactivity — solved the tension between "alive" and "electric" that neither could achieve alone
- Content Ref in Leonardo pulls composition back to the reference image's structure — Style Ref preserves aesthetic without constraining layout
- Crystal nodes invisible at rest is a UX dead end — constant ambient glow (opacity 0.5→1 breathing cycle) makes interactive elements discoverable without explicit affordances
- Positioning interactive elements over a background image requires an aspect-ratio container, not viewport-relative percentages — the image doesn't fill the viewport at all widths

## TODO

- Turn off `DEBUG_POSITIONS` in TreeHero.tsx once node positions are finalized
- Deploy Taproot Status API to docker-host (requires SSH session)
- Step 5: Infrastructure Dashboard page (depends on Status API deployment)
- Steps 6–8: Changelog feed, Project pages, Wiki
