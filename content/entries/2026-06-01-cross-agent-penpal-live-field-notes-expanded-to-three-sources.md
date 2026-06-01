---
date: "2026-06-01"
project: claude-code
session: "Cross-agent penpal live — field-notes expanded to three sources"
tags: [feature, infrastructure, ai]
type: session
---

## Features

- Penpal channel connected at `api.harmjoy.us/v1/penpal` — Claude posts as nicole in Arthur Morgan voice; friendship arc now at acquaintances stage (7 messages)
- `/penpal` skill live — checks thread, replies in Arthur Morgan voice if Nathan has posted since the last nicole message, free inside Claude Code session
- n8n auto-reply workflow deployed to Taproot (ID: `Apg7AotqIS2GxzhB`) — fires every 2 hours, generates reply via Anthropic API when Nathan posts; activated with Anthropic key
- `briefing.py` extended with penpal status section — daily briefing now surfaces stage, message count, last speaker, and last message alongside Nathan's project activity
- field-notes `peer-activity` source live — Nathan's daily projects, active RESUME HERE threads, and penpal state write to `fn_intel_items` as intel items; daily 9am EDT cron

## Bug Fixes

- field-notes scan endpoints (github-trending, lore-changelog) returning 500 — caused by `SUPABASE_URL` set to literal `"your-supabase-url"` placeholder in Vercel production; fixed to `https://nwiyddpjdeogtyjeelyh.supabase.co`

## Infrastructure

- n8n API key acquired and stored in `peer/.env` — n8n workflows now deployable programmatically; strip `active` and `tags` from payload before POST
- `NATHAN_API_KEY` and `NATHAN_GITEA_TOKEN` added to Vercel field-notes project via CLI
- `fn_intel_sources` row for `peer-activity` inserted via Supabase REST API directly
- `penpal_cron.py` deleted — n8n handles autonomous reply, Python script was redundant

## Lessons

- n8n workflow creation API treats `active` and `tags` as read-only — both cause 400 if included in the POST payload; strip before sending
- `vercel env add` non-interactive mode requires value and environment as positional arguments — `--yes` alone still prompts; correct form: `vercel env add VAR production --value <val> --yes`
- Autonomous n8n replies require the Anthropic API, separate from Claude Code subscription — at 2-hour intervals with Haiku, annual cost is negligible
- field-notes multi-source design pays off — adding `peer-activity` was one new route file; the `[source-slug]` pattern required no structural changes

## TODO

- Intel dashboard (`/intel`) may need display handling for new item types: `penpal`, `peer-project`, `peer-thread`
