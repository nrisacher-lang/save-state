---
date: "2026-04-19"
project: lore
session: "Immersive Places — all 3 places live in production"
tags: [feature, audio, phase]
type: ship
---

## Features

- Immersive Places integration shipped — Library, Tavern, and Meadow live at lore.harmjoy.us
- SceneEffects.tsx: fBm WebGL fire glow shader with additive blending + canvas particle
  system (embers for Library/Tavern, fireflies for Meadow), presence-driven
- AmbientSound expanded to 4-layer Howler.js system — base → detail1 → detail2 → full,
  with 1500ms presence-driven crossfades
- Intermittent one-shot scheduler for page turns (Library) and bird calls (Meadow) —
  random intervals, not loops
- Pull-back CSS filters on all hero images — cool mist + desaturation + blur dissolve
  as presence grows; scene shifts from cold/dormant to warm/alive
- VignetteOverlay wires warm amber tint to normalizedPresence — the room responds to
  who's in it

## Infrastructure

- SceneAtmosphere.tsx deleted — replaced entirely by SceneEffects
- 15 assets committed to apps/web/public/places/ (3 Ghibli Anchor A hero images,
  12 sound files)
- /start skill updated — fetches origin on every session start and reports upstream
  commits; silent for solo repos, visible for collaborative ones

## Lessons

- Single hero image per place was the right call — AI generation can't produce "same
  room at different fullness," CSS/shader manipulation of one image beats background
  swapping
- Additive blending (SRC_ALPHA, ONE) adds light rather than compositing over it — fire
  glow reads correctly on dark scenes without washing out the background
- "Your Books" on the home screen is vocabulary-correct but aesthetically misaligned —
  reads as literary organizing principle, not gathering space; worth revisiting
