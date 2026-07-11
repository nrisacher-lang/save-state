---
date: "2026-07-11"
project: field-notes
session: "field-notes wiki live — project registered, MDX crash fixed"
tags: [infrastructure, bug]
type: session
---

## Bug Fixes

- `/wiki/field-notes` was 500ing — MDX compiler crashed on `<10s` in the Risks table of `plan.mdx`; bare `<` triggers JSX tag parsing, `1` can't start a tag name; fixed with `&lt;10s`
- Error surfaced via `vercel logs --expand` — Cloudflare's "server error" page obscures the origin 500, and the Next.js error digest (`4279054907`) matched the log entry exactly

## Infrastructure

- field-notes registered in Supabase `projects` table — prior stub row existed (duplicate key on insert revealed it) but lacked `display_name`, `description`, `tech_stack`, and `color`; upserted full record with `#4ecdc4` (intel teal) matching the existing Field Station palette
- `/wiki/field-notes` now loads — project card in sidebar, recent activity from git, vision brief and build plan behind collapsible `<details>` elements

## Lessons

- MDX treats bare `<` as JSX — any `<N` pattern outside a code span or fenced block will crash the compiler with "Unexpected character before name"; use `&lt;` in prose and table cells
- `vercel logs --no-branch --expand` is the fastest path to the real error when Cloudflare is swallowing the 500
