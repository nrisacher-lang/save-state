---
date: "2026-04-12"
project: lore
session: "Usability overhaul complete — all 8 steps shipped"
tags: [feature, infrastructure, phase]
type: session
---

## Features

- Gathering vocabulary applied across all UI strings — Passage, Fireside, Section, Echoes, Whispers, The Circle, Gathered/Resting/Gone, Keeper/Elder/Guide replace the full literary terminology set
- TopBar component with labeled navigation — BookShelf, home, and DMs all discoverable without icon hunting
- Home screen Books grid with empty state — replaces blank loading screen with actionable landing point
- Google OAuth wired end-to-end — `/auth/google` + `/auth/google/callback` handle consent, code exchange, profile fetch, and upsert by googleId → email → create; login and register pages gain "Continue with Google"
- Onboarding overlay added — 4-step AnimatePresence flow with expanding dot progress, skip button, and idempotent `POST /users/@me/onboarded` endpoint; shows once on first sign-in, never again
- Landing page replaces redirect spinner — SceneLayer at low presence, frosted glass hero, feature tiles, footer; authenticated users redirect to `/app`; copy is lorem ipsum placeholder pending Opus brainstorm
- Presence wiring complete — `useServerPresenceCount` hook cross-references `presenceMap` against `server.memberIds[]`; SceneLayer `presence` prop is now live data

## Bug Fixes

- Fantasy theme contrast fixed — `--lore-text` and `--lore-muted` darkened to readable contrast ratios on light parchment surfaces
- Password change route guards against null `passwordHash` — OAuth-only users get a clear error instead of a crash

## Infrastructure

- Schema: `googleId` (nullable, unique), `passwordHash` (nullable for OAuth-only users), `onboardedAt` (nullable timestamp) — two migration files created manually without a local DB
- `memberIds: string[]` added to server list API response — presence hook uses it to scope `presenceMap` to current server's members
- `loginWithTokens()` action added to auth store — reads `access_token`/`refresh_token` from URL params on `/auth/callback`, stores and hydrates session
- `NEXT_STEPS_FOR_NATHAN.md` written — migration commands, env vars, Google OAuth app setup, Docker rebuild steps, CORS note
- Branch `feature/usability-overhaul` pushed to Gitea; Vercel production deploy triggered and succeeded

## Lessons

- Landing page copy is a writing problem, not a code problem — deferring to a dedicated Opus brainstorm session was the right call; lorem ipsum commits cleanly and doesn't block the PR
- Manual Prisma migrations (no local DB) are viable as long as they match the schema diff exactly — TypeScript catches anything that doesn't line up after `prisma generate`
- OAuth without extra packages is cleaner than it looks — native fetch handles token exchange and profile fetch in ~50 lines with full control over the redirect flow

## TODO

- Nathan: run `pnpm db:migrate`, add Google OAuth env vars, create Google OAuth app, `docker compose up -d --build api`
- Landing page copy — Opus brainstorm session, reference `docs/plans/2026-04-12-usability-overhaul-vision-brief.md`
- CORS: Nathan adds `lore-drab.vercel.app` to `EXTRA_ORIGINS` to enable end-to-end testing from Vercel preview
- Open PR on Gitea — requires logging into `git.harmjoy.us` as Nicole first
