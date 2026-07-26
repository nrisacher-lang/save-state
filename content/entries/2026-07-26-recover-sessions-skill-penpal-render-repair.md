---
date: "2026-07-26"
project: claude-code
session: "Recover-sessions skill + penpal render repair — recovery hardened by fire"
tags: [tooling, infrastructure, bug]
type: session
---

## Features

- `/recover-sessions` skill built — two modes: Mode A rebuilds a whole workspace after a power loss by reading transcript mtime on disk, Mode B restarts a single accidentally-closed tab by matching running processes
- `/recover-sessions` reconstructs each resume prompt from the dropped session's own transcript — original task plus where it left off, so a tab that drifted resumes its last activity, not its opening prompt
- `/switchboard clear` rebuilt — classifies null-ended sessions as live or stale by transcript write time and confirms before closing, instead of blind-closing every `ended_at: null`
- `/penpal-send` hardened — safe UTF-8 content loading, corrected reader URL to `understorylabs.co/intel`, and a post-publish render-verification step
- Technical writeup published to Nathan's penpal feed and verified rendering end-to-end — table, code blocks, em-dashes all clean

## Bug Fixes

- Penpal post crashed the reader (`e.replace is not a function`) then rendered blank — stored `block.body` was a `{value, PSPath, ...}` object, not a string, from PowerShell file-object metadata leaking through `ConvertTo-Json`
- Em-dashes stored as mojibake (`—` became `â€"`) — `Get-Content -Raw` read the UTF-8 no-BOM file as Windows-1252
- `preprocessCitations` in `understory-labs-site` made code-aware and null-safe — it was rewriting `[n]` markers inside code blocks (mangling `$matches[1]`) and throwing on non-string bodies
- `/dispatch` tab launches truncated at the first `;` — prompts now stage to a temp file read via `Get-Content`, keeping semicolons out of `wt.exe`'s parser

## Infrastructure

- Taproot Postgres data repair — unwrapped the object-wrapped `block.body` in place, then re-stored clean content via `base64` to `decode` to `convert_from(..., 'UTF8')` to avoid shell re-encoding
- Citation fix committed to `understory-labs-site` `master` — the project deploys manually, not on push, so it rides the next intentional deploy

## Lessons

- `ended_at: null` in `switchboard.json` never means "open" — the Stop hook stamps it on every response, so a live idle tab has a real timestamp and a fresh tab is the null one; liveness comes from transcript mtime, not the registry field
- Process-matching (a tab's `resume-<key>.txt` in the live `powershell.exe` command lines) distinguishes a closed tab from an idle one, which mtime alone cannot
- `Get-Content -Raw` decorates its string with ETS metadata, so `ConvertTo-Json` serializes it as `{value, PSPath, ...}` — cast `[string]`; and PS 5.1 reads UTF-8 no-BOM as Windows-1252 — pass `-Encoding UTF8`
- `session-compact-log.tmp` is one global file every tab appends to — `/wrap` cannot treat it as this-session's log or clear it without checking whose compactions it holds
- A regex capturing `[a-z0-9]+` silently drops at the hyphen in `field-notes`, falsely reporting a second dropped tab — match `[a-z0-9-]+`
- `git push` in a repo carrying another session's unpushed commits deploys their work too — isolate a hotfix by cherry-picking onto a branch from `origin/master`, not pushing `master` wholesale

## TODO

- Deploy the `preprocessCitations` fix to `understory-labs-site` — until then `$matches[1]` renders as a stray superscript citation in the penpal post
