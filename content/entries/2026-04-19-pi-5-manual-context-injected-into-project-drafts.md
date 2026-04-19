---
date: "2026-04-19"
project: current-os
session: "PI-5 — Manual context injected into project drafts"
tags: [feature, ai, bug]
type: session
---

## Features

- PI-5 complete — draft generation now injects ingested manual chunks into the intake prompt as a `## Manufacturer Instructions` block; steps from the manufacturer's sequence are labeled `(from manual)`, AI additions labeled `(AI-supplemented)`
- `api/_lib/taproot.ts` established as the shared Taproot client — `getChunks(projectId)` fetches all cached chunks with 8s timeout, returns `[]` on failure so Taproot downtime never blocks draft generation
- Generate Plan button is now disabled while any resource is ingesting — "wait for ✓ before generating" message appears below the button so the user can't race ahead of the chunk pipeline
- Owned materials now display `$0` in the price field instead of a strikethrough estimate — original price is preserved in state and restored if ownership is unchecked
- Validation product references updated throughout both PI plan files — Ring doorbell replaced with Aqara Video Doorbell G4, "pergola kit" replaced with Mirador 10x13 Louvered Pergola

## Bug Fixes

- Skip disclaimer only fired on one of two skip paths — `researchDecision === 'skipped'` (Skip before research runs) and `resourceApproval === 'skipped'` (Skip after resources are found) are separate state variables; both must be checked
- Vercel build failed with `TS2835` on the `_lib/taproot` import — `moduleResolution: nodenext` in Vercel's API tsconfig requires explicit `.js` extension on relative imports even when the source file is `.ts`
- `api/ingest.ts` was complete from a prior session but uncommitted — included in the PI-5 commit

## Infrastructure

- `api/_lib/taproot.ts` — new shared helper file; Vercel treats `_lib/` as private (no route exposure)
- `ingestProjectKey` threaded from `ProjectIntakeOverlay` into `api/project-intake.ts` request body — the temp UUID minted at resource-approval time is now the lookup key for chunk retrieval
- Chunk injection capped at 30 chunks with a truncation note to prevent prompt bloat on large manuals

## Lessons

- Vercel's API tsconfig uses `nodenext` module resolution, which requires `.js` on relative imports — `tsc --noEmit` locally won't surface this; it only fails in the Vercel build pipeline
- Two separate state variables controlling the same logical outcome (resource skip) is a footgun — a future refactor should unify them into a single `resourceDecision` enum
- Disabling the action button during async pre-work is strictly better than a post-hoc warning — the user can't accidentally proceed, and the system state is always coherent when the button re-enables

## TODO

- Validate PI-5 checkpoint against Aqara Video Doorbell G4 and Tuff Shed — steps should carry `(from manual)` labels and reference actual manual content
- PI-6: Build Companion API (`api/project-companion.ts`) + UI (Companion tab in ProjectsOverlay, FAB on mobile)
