---
date: "2026-06-27"
project: claude-code
session: "Multi-session launcher — recover and launch commands built"
tags: [infrastructure, tooling]
type: session
---

## Features

- `recover` command built — reads `switchboard.json`, prints a triage briefing with compact summaries,
  then opens one Windows Terminal tab per interrupted session running `claude --resume <id>`
- `launch` command built — skips the recovery briefing, opens fresh Claude sessions for specific
  projects by switchboard project ID; accepts multiple IDs at once
- Tab appearance auto-configured from switchboard — emoji icon prefix (codicon → emoji mapping),
  `--tabColor` from VS Code ANSI color name, project `cwd` as working directory
- PowerShell profile exposes both commands as thin wrappers; tracked in claude-config repo so the
  setup is portable to fresh machines
- `how-to-use.mdx` added to the claude-code wiki slot — prerequisites, both commands with usage
  examples, project ID reference table, how sessions survive power loss, key files, and Switchboard

## Infrastructure

- `~/.claude/scripts/recover.ps1` — core script; `-LaunchOnly` switch skips interrupted session
  scan for `launch` mode; `$DefaultNewIdeas` configures the default new-idea tabs
- `~/.claude/Microsoft.PowerShell_profile.ps1` — tracked in claude-config repo; restore to
  `$PROFILE` path on a fresh machine
- `toolkit.md` updated with `recover.ps1` and profile file locations
- `content/wiki/claude-code/switchboard.mdx` removed — was orphaned (not a recognized MDX slot,
  never rendered by the page router); content consolidated into `how-to-use.mdx`

## Lessons

- Wiki MDX files must match a recognized slot name (`architecture`, `decisions`, `vision-brief`,
  `plan`, `how-to-use`) — any other filename silently goes unrendered; the router never errors
- Windows folder redirection makes `$PROFILE` resolve to an OneDrive path even on machines not
  actively using OneDrive — track the profile in version control to survive fresh machine setups
- `wt.exe` in PowerShell requires `";"` as a discrete element in the argument array between
  `new-tab` segments — it cannot be embedded in a separator-joined string
- Interrupted session detection works correctly on power loss (`ended_at` stays null); a test
  "found nothing" because the Switchboard close hook had already fired and set `ended_at` during
  the live test conversation — the real scenario (abrupt shutdown) leaves sessions null as expected
