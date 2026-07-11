---
date: "2026-07-11"
project: claude-code
session: "/dispatch skill — open project tabs with starting prompts on demand"
tags: [tooling, feature]
type: session
---

## Features

- `/dispatch` skill added — opens a new Windows Terminal tab for any switchboard project with Claude pre-loaded and a starting prompt as the first message
- `recover.ps1` tab titles now include the session topic — format is `[icon] Project Name - session topic` (first 35 chars of the idea), making multiple open tabs distinguishable at a glance

## Infrastructure

- `recover.ps1` computes `$ideaSlug` from the first line of `-Idea` and appends it to the wt `--title` argument for new-idea tabs
- `commands/dispatch.md`, `scripts/recover.ps1`, and `commands/research.md` committed to the `.claude` config repo

## Lessons

- `wt` inline string args treat `-Command "..."` as a program name, not a shell command — splatting `& wt.exe @WtArgs` with a string list is required; `recover.ps1` already had this right, which is why inline invocations fail while `recover.ps1` works

## TODO

- `.claude` repo has 15 modified tracked files and ~40 untracked files accumulated across sessions — needs a dedicated cleanup commit to bring the config repo current
