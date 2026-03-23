---
date: "2026-03-21"
project: bark
session: "Better Ears + Smart Brain — Claude-powered audio intelligence"
tags: [feature, ai, audio, claude]
---

## Features

- Claude integration added to Bark — bot now understands context around sound triggers
- Smart Brain mode: Claude analyzes recent activity before deciding whether to play a sound
- Better Ears: audio detection sensitivity tuned with configurable threshold
- Cooldown logic added to prevent rapid-fire repeat plays after a trigger

## Bug Fixes

- Fixed race condition where two overlapping audio events would both trigger playback
- Resolved NSSM service restart loop caused by unhandled promise rejection on Claude API timeout

## Infrastructure

- Claude API key stored in `.env` and loaded via dotenv — not hardcoded
- NSSM service updated to use new entry point after refactor

## Lessons

- Wrapping AI calls in try/catch with graceful fallback (play sound anyway) prevents service crashes
- Claude's response latency is noticeable in real-time audio contexts — async fire-and-forget works better than blocking
