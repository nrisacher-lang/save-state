---
date: "2026-03-01"
project: claude-code
session: "Power user setup — Steps 1 through 8"
tags: [infrastructure, tooling, skills]
---

## Features

- Full Claude Code power user environment built across 8 steps
- 20+ skills installed globally — `/start`, `/plan`, `/brainstorm`, `/commit`, `/save`, `/tdd`, and more
- MCP servers configured: GitHub MCP for repo access, Context7 for live documentation
- Hooks configured for pre/post tool events
- CLAUDE.md updated with full work context, stack, and learning preferences

## Infrastructure

- Skills stored in `~/.claude/commands/` — available in all projects
- `toolkit.md` created as single-source inventory of all capabilities
- `power-user-setup.md` documents the step-by-step build history
- opusplan model profile set as default — Opus during planning, Sonnet during execution

## Lessons

- The skill system makes Claude Code dramatically more consistent across sessions
- CLAUDE.md is more valuable the more specific it is — vague instructions get ignored
- Model selection matters: Opus for architecture decisions, Sonnet for building, Haiku for quick lookups
- `/save` after every session is the habit that makes everything else work
