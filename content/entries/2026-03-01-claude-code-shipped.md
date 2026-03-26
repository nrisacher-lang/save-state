---
date: "2026-03-01"
project: claude-code
session: "Claude Code Setup — power user environment shipped"
tags: [infrastructure, tooling, skills]
type: ship
---

## Features

- Claude Code power user environment ships — 20+ global skills, MCP servers, hooks, and model profile operational
- 20+ global skills installed: `/plan`, `/brainstorm`, `/commit`, `/save`, `/tdd`, `/debug`, `/review`, `/start`, `/log`, and more — common workflow patterns encoded as single commands
- GitHub MCP + Context7 MCP configured — repo access and live documentation lookup available in any conversation
- Hooks registered for git and file events — auto-format, lint, env protection, and toast notifications running silently in the background
- opusplan model profile set as default — Opus during planning sessions, Sonnet during execution, Haiku for quick lookups

## Lessons

- The skill system makes Claude Code consistent across sessions — without it, every session starts from scratch
- CLAUDE.md specificity is the multiplier: vague global instructions produce vague behavior; specific context produces specific output
- Model selection is a workflow decision, not just a cost tradeoff — Opus for architecture, Sonnet for building, Haiku for trivia
- `/save` as a closing habit is what makes everything else accumulate value over time
