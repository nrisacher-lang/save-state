---
date: "2026-06-28"
project: claude-code
session: "GitHub remote wired — credentials scrubbed, wiki guide now deployed"
tags: [infrastructure, tooling]
type: session
---

## Bug Fixes

- Wiki HOW TO USE section showing "No user guide yet." despite `how-to-use.mdx` being committed — root cause: no git remote configured, so the pre-push Vercel hook never fired; guide was local-only since it was written

## Infrastructure

- `github.com/nrisacher-lang/understory-labs-site` created (private) — first git remote for this project; future `git push` auto-deploys via pre-push hook
- `.claude/settings.local.json` removed from git tracking and added to `.gitignore` — file had a Supabase service role key embedded in approved Bash command strings; untracked before the first push to GitHub

## Lessons

- `.claude/settings.local.json` in project directories accumulates credential strings — every approved `printf '%s' '<key>'` Bash pattern lands in this file; it must be gitignored before any remote is configured
- A missing git remote means the pre-push Vercel deploy hook never fires — commits pile up locally but production stays frozen on whatever was last manually deployed
