---
date: "2026-04-09"
project: current-os
session: "Fix project intake photo 413 error"
tags: [bug, infrastructure]
---

## Bug Fixes

- Compressed project intake photos client-side (max 1200px, JPEG 85%) before base64 encoding — full-res phone photos exceeded Vercel's 4.5MB serverless body limit, returning HTTP 413.

## Infrastructure

- Linked `.vercel` project config locally — pre-push deploy hook now works for life-automation on this machine.

## TODO

- `api/project-intake.ts` lines 426–444: pre-existing TypeScript errors — property access on `unknown` type from JSON parse. Not blocking (build deploys), but should be fixed.
