---
date: "2026-04-30"
project: understory-labs
session: "Design System, Pages, and Ecosystem Visual — Steps 2 and 3 complete"
tags: [feature, brand, infrastructure]
type: session
---

## Features

- Design system built — Cybernetic Nature palette as CSS custom properties, Tailwind v4 `@theme inline` tokens, 3-tier font system (JetBrains Mono / Share Tech Mono / DM Sans) via `next/font`
- Component library shipped: `Heading`, `Label`, `Body`, `Section`, `GlowCard`, `ElectricAccent`, `Nav`, `Footer`, `PageTransition`
- GlowCard bioluminescent effect — two cross-fading border glow layers (crystal teal ↔ accent green) using opposite-phase opacity animation; no color animation, no repaints
- ElectricAccent — traveling pulse built on Framer Motion `left` animation inside `overflow: hidden`; 3s duration, 1.5s repeat delay
- Nav — Framer Motion `layoutId` animated underline slides between active desktop links; mobile hamburger opens `AnimatePresence` full-screen drawer
- PageTransition — Framer Motion fade + 8px drift keyed to `usePathname`, fires on every route change
- All pages built with real content and structure: `/projects` (GlowCards with descriptions, tech tags, links), `/infra` (service status cards, container table), `/changelog` (timeline spine with color-coded entry types), `/wiki` (public/internal two-column split with amber auth badge)
- Ecosystem Flow diagram — 4-column SVG (INFRASTRUCTURE → SERVICES → APPLICATIONS → DATA) with 7 rect nodes, HUD corner bracket decoration, and 7 animated electric current connections; `electric-flow` CSS keyframe on `stroke-dashoffset`
- Home page: TreeHero + Ecosystem section below fold; "Explore" scroll hint now meaningful

## Bug Fixes

- Hero title colliding with crystal node labels on hover — removed labels from tree nodes entirely; title repositioned from `top: 55%` to `top: 35%`
- `.tree-hero-content` and `.tree-hero-scroll` changed from `position: fixed` to `position: absolute` — were bleeding over ecosystem section on scroll
- Lore incorrectly placed in DATA column of ecosystem map — moved to APPLICATIONS column; Save State is now the sole DATA node
- `useEffect(() => setMenuOpen(false), [pathname])` in Nav — react-hooks lint error; replaced with `onClick` on each mobile drawer link

## Infrastructure

- Framer Motion 12.x added as primary animation library
- 5 unused Create Next App scaffold SVGs deleted from `public/`
- `Card.tsx` deleted — superseded by `GlowCard`
- Three ecosystem variants (Flow, Tree, Radial) built and presented via in-browser switcher; Tree and Radial deleted after Flow selected

## Lessons

- Building all three ecosystem options as live toggleable components let the user make a real visual decision rather than describing from descriptions — faster than mockups and zero ambiguity
- Bioluminescent color-shift via two border layers at opposite animation phases achieves the effect without animating color values — GPU-composited and performant
- `position: fixed` on hero content elements works fine for single-page heroes but breaks the moment anything is below the fold — establish correct positioning before adding scroll content
- Verify hardware facts before writing copy — "Dell hardware" was wrong for Taproot (custom-built)

## TODO

- Step 4: Deploy Taproot status API to docker-host (`192.168.1.153`) — Express endpoints for `/status`, `/containers`, `/uptime`; Cloudflare Worker proxy at `api.understorylabs.co`
- Commit all session work before next session (nothing committed this session)
- docker-host IP is DHCP — consider setting a static lease in router
