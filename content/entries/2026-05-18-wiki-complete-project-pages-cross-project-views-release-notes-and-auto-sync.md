---
date: "2026-05-18"
project: understory-labs-site
session: "Wiki complete — project pages, cross-project views, release notes, and auto-sync"
tags: [feature, infrastructure, tooling]
type: session
---

## Features

- Per-project wiki pages live at `/wiki/[project-id]` — header with clickable vault link, at-a-glance stats grid, checklist with progress bar, activity feed, MDX slots for architecture and decision log, release notes preview
- Three cross-project views: Activity timeline (events grouped by recency), Infra Map (Taproot LXC container hierarchy + external services tier), Tech Radar (adopt/trial/assess/hold rings across 6 categories with project tags)
- Release notes system — full timeline at `/wiki/[project-id]/releases`, `insert-release-note.ts` script, `/ship` Step A3.5 wired to prompt on every feature shipped
- Connections panel on each project page — service name, type badge, usage note, and `⬡ vault_path` linking to `vault.rootstack.dev`; seeded for all 7 projects with service URLs and Vaultwarden paths
- `update-connection.ts` script — patches a single connection entry (add, update, or remove) by substring match without touching raw JSON; `/ship` Step A3.6 now prompts for vault path whenever new credentials are created

## Infrastructure

- `sync-wiki-state.ts` — reads `git log -1` from all 7 local repos, upserts `project_state` (branch, commit, timestamp), inserts commit activity events only when hash changes; `--dry-run` and `--project-id` flags supported
- `wiki-sync.js` PostToolUse hook — fires after `git commit` in Claude Code, spawns sync non-blocking and unref'd; registered in `settings.json` on `Bash(git commit:*)`
- `/start` skill updated to surface the sync command when wiki state may be stale after recent commits
- `connections` JSONB column added to `projects` table; SQL seed covers all 7 projects; `wiki.ts` SELECT queries updated in both `getAllWikiProjects` and `getWikiProject`

## Bug Fixes

- `2>/dev/null` in `execSync` git commands silently fails on Windows cmd — replaced with `stdio: ['pipe', 'pipe', 'pipe']` to suppress stderr cross-platform
- Top-level `await` in tsx script fails with "cjs output format" error — wrapped in `async function main()` + `main().catch()` to match the existing script pattern across the repo
- SQL apostrophe in `Nathan's` broke the connections seed — escaped to `Nathan''s`

## Lessons

- `2>/dev/null` does not suppress stderr from `execSync` on Windows cmd — `stdio: ['pipe', 'pipe', 'pipe']` is the cross-platform fix
- Top-level `await` in a tsx script throws "cjs output format" unless the package has `"type": "module"` — the `async function main()` + `main().catch()` pattern is required, not stylistic
- Supabase's "UPDATE without WHERE" safety warning fires on any query containing UPDATE, even when every statement has a WHERE clause — blanket check, not a smart one
- `next-mdx-remote/rsc` is the correct App Router import path — `next-mdx-remote` directly does not work in server components
