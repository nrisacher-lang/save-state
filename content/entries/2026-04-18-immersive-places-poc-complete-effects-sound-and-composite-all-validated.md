---
date: "2026-04-18"
project: lore
session: "Immersive Places POC complete — effects, sound, and composite all validated"
tags: [feature, audio, phase]
type: session
---

## Features

- Effects POC validated with real Ghibli hero images — all 3 places render correctly behind frosted glass UI shell
- Particle colors made place-aware — tavern embers now gold-amber, meadow fireflies warm cream-gold instead of uniform orange
- Sound POC built — Howler.js 4-layer system (base → detail1 → detail2 → full ambient), each layer fading in as presence grows
- 12 ambient audio assets sourced from Freesound and configured per place — library fire, clock, pages, room tone; tavern hearth, dinner table, murmur, crowd; meadow wind, bird, rustle, chorus
- Intermittent sound model confirmed — pages and bird calls use scheduled one-shots with random intervals (12–35s, 10–30s), not loops
- Composite POC complete — WebGL shader, canvas particles, Howler.js audio, and full Lore UI shell (sidebars, header, input bar) unified in a single page across all 3 places
- Pipeline doc written (`docs/plans/2026-04-18-immersive-places-pipeline.md`) — integration plan mapped to existing `SceneLayer` / `PlaceSceneRenderer` / `AmbientSound` architecture, 10-step implementation order, asset manifest, per-place checklist

## Bug Fixes

- Clock volume capped at 25% — was audibly competing with fire base layer
- Tavern clink replaced with dinner table ambience (Mr_Alden, Freesound 365676) — crystal clink was too repetitive regardless of random-seek approach; looping ambient table activity reads more naturally

## Infrastructure

- Howler.js downloaded locally (`howler.min.js`) — CDN load blocked on `file://` protocol in Chrome
- `npx serve` established as the local POC test pattern — browser blocks audio loading from `file://` even with `html5: true`; must serve via HTTP

## Lessons

- Browser security blocks audio loading from `file://` regardless of Howler config — every audio POC needs a local HTTP server, not a double-click
- Intermittent detail sounds (page turns, bird calls) need random scheduling, not loops — a constant page-turning loop is immediately uncanny
- Sound variety matters more than volume — random-seek on a single-sample clink still sounds repetitive; an ambient file with natural variation (dinner table) solves it better than any seek strategy
- Windows hides file extensions by default — renaming `library.jpg` in Explorer silently produces `library.jpg.jpg`; turn on extensions before any rename workflow

## TODO

- Integration: create `SceneEffects.tsx` (port WebGL + canvas from POC), update `LibraryScene.tsx`, expand `AmbientSound.tsx` to 4-layer system — see pipeline doc for full order
