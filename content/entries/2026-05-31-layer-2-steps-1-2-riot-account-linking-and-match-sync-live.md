---
date: "2026-05-31"
project: codec
session: "Layer 2 Steps 1+2 — Riot account linking and match sync live"
tags: [feature, infrastructure]
type: session
---

## Features

- Riot account linking live — /settings page accepts Riot ID (Name#TAG) + region, looks up PUUID via Account API, stores in `user_profiles`
- Match sync operational — `syncRecentMatches` pulls last 20 TFT games, parses participant data (units, traits, augments, placement, duration), upserts into `games` + `game_units`
- SyncButton component shows live feedback — new games synced count, already-stored count, error display
- Gear icon in comp library header navigates to settings — visible on all screens, minimal footprint

## Infrastructure

- `user_profiles` schema extended with `riot_puuid`, `riot_game_name`, `riot_tag_line` columns
- `lib/riot/client.ts` — Riot API utility: PUUID lookup, match history, match detail, region → routing value mapping, queue ID → mode string
- `RIOT_API_KEY` added to Vercel env via file redirect (pipe fails on this CLI version)

## Lessons

- Riot dev key expires every 24h by design — personal project application required for persistent access; submitted to developer portal, approval pending
- Vercel CLI `env add` requires file redirect (`< /tmp/file`), not pipe — pipe produces "Invalid number of arguments" on current CLI version
- Riot Account API uses routing values (`americas`, `europe`, `asia`, `sea`) for PUUID lookup — distinct from platform values (`NA1`, `EUW1`); using the wrong one returns 404
- TFT team planner codes changed format between Set 13 and Set 17 — old community spec (starts with `01`, 1 byte per champion) doesn't match current codes; text paste via Claude API is more reliable than binary format decoding

## TODO

- Personal Riot API key approval pending — replace dev key in `.env.local` and Vercel when received
- Layer 2 Step 3: fuzzy comp association — unit overlap + trait scoring → `similarity_score` + `matched_comp_id` on `games`
