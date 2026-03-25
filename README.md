# Save State — Onboarding Guide

## What This Is

Save State is the Understory Labs portfolio and changelog — a living site that documents what's been built, how projects evolve, and surfaces patterns across all active projects. It's part public-facing portfolio, part personal mission control. Entries are written in markdown, stored in `content/entries/`, and rendered dynamically via Next.js. Project metadata lives in Supabase. The analytics dashboard is built entirely from CSS — no charting libraries.

## Prerequisites

- Node.js (v20+)
- A Supabase project with `projects` and `features` tables and RLS enabled
- A Vercel account (if deploying)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env.local  # or create manually

# 3. Add Supabase credentials to .env.local
NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# 4. Run the dev server
npm run dev
```

Open `http://localhost:3000`.

## Project Structure

```
content/entries/            Markdown changelog entries — source of truth for all content
scripts/                    CLI tools (new-entry.ts, seed-projects.ts)
src/app/                    Next.js App Router — pages (/, /changelog, /projects, /analytics)
src/components/             UI components
src/components/analytics/   Analytics-specific components (keep separate from flat components)
src/lib/                    Data layer — entries.ts, projects.ts, analytics.ts, types.ts, supabase.ts
public/                     Static assets
```

## Available Commands

| Command             | What it does                                       |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Start local dev server at `http://localhost:3000`  |
| `npm run build`     | Production build (dynamic SSR — not static export) |
| `npm run start`     | Serve the production build locally                 |
| `npm run lint`      | Run ESLint                                         |
| `npm run new-entry` | Interactive CLI to scaffold a new changelog entry  |

## How It Works

Changelog entries are markdown files in `content/entries/` with YAML frontmatter (`date`, `project`, `session`, `tags`). `src/lib/entries.ts` reads and parses these at request time. Project metadata (`projects`, `features` tables) lives in Supabase and is queried via `src/lib/projects.ts`. The analytics page computes everything from entries in `src/lib/analytics.ts` — no external data service. Pages that hit Supabase need `export const dynamic = "force-dynamic"` to prevent Next.js from trying to static-prerender them at build time.

Deployment: push to the tracked branch and the global git `pre-push` hook auto-deploys to Vercel (any project with a `.vercel/` directory).

## Common Tasks

**Add a new changelog entry:**

```bash
npm run new-entry
# Prompts: project, session title, tags
# Creates: content/entries/YYYY-MM-DD-<slug>.md
# Fill in ## Features and ## Lessons sections, then commit and push
```

Valid project IDs: `current-os`, `save-state`, `bark`, `claude-code`

**Add a new project to Supabase:**

- Insert a row into the `projects` table with a kebab-case `id`
- Optionally run `scripts/seed-projects.ts` if seeding in bulk

**Add a new page or feature:**

- Add the route under `src/app/`
- If it fetches from Supabase, add `export const dynamic = "force-dynamic"` at the top
- New components go in `src/components/` (analytics-specific go in `src/components/analytics/`)

**Deploy:**

```bash
git push  # pre-push hook triggers Vercel deployment automatically
```

## Known Quirks

- **Supabase labels changed** — what used to be "anon key" is now labeled "publishable" in the Supabase dashboard. Same key, different label.
- **`out/` directory exists** — leftover from an earlier static export setup. The project now uses dynamic SSR; `out/` is safe to ignore but not deleted.
- **`new-entry.ts` hardcodes project IDs** — adding a new project requires updating the `PROJECT_NAMES` map in `scripts/new-entry.ts` manually. Known maintenance burden.
- **No charting libraries** — all visualizations are CSS-only (proportional bars, grid-based heatmap). Don't reach for Chart.js — work within the existing pattern.
- **Design system is in `globals.css`** — never hardcode colors or fonts. All values are CSS custom properties.
- **Three-font rule** — JetBrains Mono 700 for titles/dates/counts, Share Tech Mono for labels/badges (ALL CAPS, `letter-spacing: 0.06em`), DM Sans for body. Don't mix them up.
