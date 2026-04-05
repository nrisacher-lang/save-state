---
date: "2026-04-04"
project: lore
session: "Place Theme System — atmosphere picker, SceneLayer bridge, full aesthetic"
tags: [feature, infrastructure, launch]
type: session
---

## Features

- Place theme system shipped end-to-end — each Book now has an atmosphere (the-library, the-tavern, the-meadow) independent of genre
- `PlaceThemePicker` component renders color swatches, name, and description for each place — wired into Create Book and Book Settings modals
- ThemeContext bridge: active server's `placeTheme` drives SceneLayer and CSS variables app-wide, with 160ms opacity crossfade when switching servers
- Auth pages (login, register) moved to `(auth)` route group — SceneLayer background and frosted glass card on both
- Invite page and 404 page get library scene background — every public URL now has the aesthetic
- Root redirect page updated from plain spinner to SceneLayer-backed loading state

## Infrastructure

- `placeTheme String @default("the-library")` added to Server model — Prisma migration applied to production DB
- API validates `placeTheme` on POST and PATCH `/servers` against enum of three valid place IDs
- `PlaceThemeId` type and `PLACE_THEMES` array added to `@lore/types`
- Merge conflict resolved with Nathan's commits — adopted his `animationKey` improvement (coarse key groups channels by server, not per-channel) and `getStatus` voice fix in ReaderList
- PR opened and merged on Gitea — branch protection on master confirmed active

## Lessons

- Scoping CSS variables as inline `style` on a container element overrides root vars set by ThemeProvider — clean way to isolate palette without fighting the context
- Tailwind opacity modifiers silently fail on CSS variable colors — `color-mix(in srgb, var(--color) 80%, transparent)` is the fix
- `lore.harmjoy.us` is the right QA target — Nathan's production is VPS-deployed, not Vercel; `lore-drab.vercel.app` is Nicole's preview and isn't in `EXTRA_ORIGINS`
- Nathan needs to pull and rebuild Docker on VM108 for changes to appear on his production URL — auto-deploy not set up yet

## TODO

- Ask Nathan to set up Gitea Actions runner for auto-deploy on merge to master
- `lore-drab.vercel.app` CORS: Nathan adds it to `EXTRA_ORIGINS` if Vercel URL needs to work against live API
