---
date: "2026-04-18"
project: current-os
session: "WeekWidget fix + Bud brainstorm — inbox intelligence named and scoped"
tags: [brainstorm, naming, bug]
type: session
---

## Features

- **Bud** vision brief complete — inbox intelligence system powered by n8n on Taproot with six handler types: purchase, coupon, delivery, appointment, reference, triage
- Cross-agent orchestration scoped — Bud feeds Current OS (tasks, radar, triage), Shed (project materials), Research API (product intelligence), Google Calendar, and a financial dashboard
- Name locked: Bud — dormant potential waiting to open, "nip it in the bud" for early problem detection, BUD inside BUDGET, buddy personality
- Standalone project — own repo, own LXC on Taproot, financial dashboard linked from Current OS under a broader domain TBD

## Bug Fixes

- ISSUE-011: WeekWidget "This Week" card now auto-focuses when Work toggle activates — `GravityWatcher` gained a `workVisible` transition watcher that calls `focusCard("week")` on the `false → true` edge

## Lessons

- Brainstorms should surface established self-hostable tools (n8n, Node-RED) before custom-build options — n8n was the obvious fit for email orchestration but had to be raised by the user
- Naming requires the design brief as input — two rounds failed before consulting the redwood forest ecosystem aesthetic
- Humble name for sophisticated tech (Shed, Bark, Bud) is the Understory Labs signature — the contrast IS the brand

## TODO

- `/plan` on Bud — purchase handler first, end-to-end through n8n
- Cross-agent protocol design — how Bud, Shed, and Research API communicate
- Confirm ISSUE-011 fix after testing
