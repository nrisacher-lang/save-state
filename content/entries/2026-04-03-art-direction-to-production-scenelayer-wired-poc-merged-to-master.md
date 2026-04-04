---
date: "2026-04-03"
project: lore
session: "Art Direction to Production — SceneLayer wired, POC merged to master"
tags: [feature, infrastructure, phase]
type: session
---

## Features

- POC branch merged to master — place-based themes (The Library, The Tavern, The Meadow) now in the main codebase
- `SceneLayer` threaded behind the authenticated app shell — photorealistic backgrounds render beneath all UI
- Frosted glass pattern applied to all three chat UI panels: `BookShelf`, `ChapterSidebar`, `ReaderList`, channel header — `color-mix()` inline styles replace opaque surfaces
- Scene is hardcoded to `the-library` pending theme system bridge (Step 3)

## Bug Fixes

- `@types/react` duplicate resolved — pnpm installed React 18 types (for Expo) and React 19 types (for web) as separate physical copies; TypeScript surfaced them as incompatible `ReactNode` types even in `.tsx` source files; fixed with `pnpm.overrides` forcing `^19.0.0` across the monorepo

## Infrastructure

- `vercel.json` added at repo root — `framework`, `installCommand`, `buildCommand` only; `rootDirectory` lives as a permanent Vercel project setting (not in config file)
- `.vercel/` added to `.gitignore`

## Lessons

- Tailwind v3 opacity modifiers (`bg-lore-surface/80`) don't work with CSS custom property colors — `color-mix(in srgb, var(--color) 80%, transparent)` in inline styles is the correct pattern
- `skipLibCheck: true` doesn't protect against duplicate `@types/react` in source `.tsx` files — the TypeScript checker still sees both `ReactNode` shapes when resolving JSX; the fix is at the package resolution layer, not the compiler
- Book spines preserved by design — each Book is a portal to a place; pulling a spine takes you into that world; the gathering vocabulary (Grounds, Passages, Firesides) applies inside, not at the server list level

## TODO

- Step 3: theme system bridge — `placeTheme` field in Prisma schema, ThemeContext reading PlaceThemeRegistry, server creation/settings UI
- Step 4: presence wiring — `useServerPresenceCount(serverId)` feeding real online count into SceneLayer
- Step 5: terminology rename — PassagesSidebar, GatheringArea, CircleList, flame icon channel prefix
- Step 6: root CLAUDE.md from merged draft
- Ambient sound: deferred brainstorm item
