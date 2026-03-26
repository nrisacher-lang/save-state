---
date: "2026-03-21"
project: bark
session: "Bark — AI feature suite shipped"
tags: [feature, ai, audio]
type: ship
---

## Features

- Bark ships AI feature suite — Smart Brain, Better Ears, Cooldown, and Windows service all live
- Smart Brain routes every trigger message through Claude before acting — intent-aware instead of pattern-aware, false positives drop to near zero on busy servers
- Better Ears adds per-trigger detection thresholds — sensitivity tunable without touching code
- Cooldown logic prevents rapid-fire repeat plays — same clip won't fire twice in quick succession
- NSSM service wraps the bot as a Windows background process — survives reboots, no terminal window required

## Lessons

- Async fire-and-forget for Claude calls is the right pattern in real-time audio contexts — blocking on AI response latency kills the moment
- Graceful fallback (play the sound anyway on Claude timeout) means the AI layer enhances reliability rather than introducing fragility
- The gap between keyword matching and contextual understanding is where the product lives — Smart Brain makes Bark feel designed rather than scripted
