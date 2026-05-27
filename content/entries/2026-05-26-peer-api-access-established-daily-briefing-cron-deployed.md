---
date: "2026-05-26"
project: taproot
session: "Peer API access established — daily briefing cron deployed"
tags: [infrastructure, tooling]
type: session
---

## Features

- Programmatic access to peer infrastructure established — projects API (X-API-Key) and Gitea API (token) verified and stored in `~/Projects/peer/.env`
- Daily briefing script built — pulls projects touched in last 2 days, last 3 session log entries, and active RESUME HERE threads from peer Gitea memory file
- `peer-reference.md` rebuilt — full project inventory with internal name mappings, Memory MCP architecture, IRC bridge, Gitea org structure, and API schema contract documented

## Infrastructure

- Taproot cron configured: `0 12 * * * cd /opt/peer-briefing && python3 briefing.py` — writes markdown briefing to `/opt/peer-briefing/briefings/YYYY-MM-DD.md`
- `~/Projects/peer/.env` stores API key and Gitea token; `.gitignore` created alongside
- Field Notes peer sync brief at `~/.claude/plans/field-notes-peer-sync-brief.md` — ready to drive the Field Notes integration session

## Lessons

- Python's default `Python-urllib/X.X` User-Agent is blocked by Cloudflare-proxied endpoints — scripts must set a browser-like User-Agent explicitly
- `/schedule` skill creates Anthropic CCR remote agents, not local cron jobs — CCR agents cannot read `~/.claude/` or `~/Projects/` or write local paths; Taproot cron is the correct pattern for personal homelab automation
