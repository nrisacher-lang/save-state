# Save State

## Purpose

The Understory Labs homepage — a living, dynamic portfolio and changelog. Shows what's been built, how projects have evolved, and surfaces patterns across all active projects. Serves two audiences: the builder (daily driver, mission control view) and the visitor (portfolio, case studies, technical narrative).

## Stack

- Next.js 16 (App Router, dynamic SSR on Vercel — no longer static export)
- TypeScript
- Tailwind CSS v4
- Supabase — projects and features tables (public read, RLS enabled)
- gray-matter + unified/remark/rehype — markdown entry pipeline
- @supabase/supabase-js

## Project Structure

- `src/app/` — Next.js App Router pages and root layout
- `src/components/` — UI components (Card, Header, Nav, ProjectFilter, EntryCard, EntryList, HeroSection, ProjectCard, ProjectGrid, RecentActivity, FeatureList, AmbientCanvas); analytics components in `src/components/analytics/`
- `src/lib/` — content engine (`entries.ts`), Supabase queries (`projects.ts`), analytics computation (`analytics.ts`), types
- `content/entries/` — markdown changelog entries (source of truth for all content)
- `scripts/` — CLI scaffolder (`new-entry.ts`)
- `references/` — voice profile and reference documents for AI-generated content

## Commands

- Dev: `npm run dev`
- Build: `npm run build` (dynamic SSR — deployed via Vercel)
- New entry: `npm run new-entry`

## Conventions

- Entry files: `YYYY-MM-DD-<slug>.md` in `content/entries/`
- Project IDs: kebab-case identifiers — sourced dynamically from Supabase. No hardcoded list. Adding a project requires a Supabase insert, not a code change.
- Entry frontmatter includes a `type` field: `session` (default), `ship` (feature shipped), `debut` (new project). Existing entries without `type` default to `session` at read time.
- Design system lives in `globals.css` as CSS custom properties — never hardcode colors or fonts
- Three-font rule:
  - **JetBrains Mono 700** (`var(--font-jetbrains)`) — title, dates, counts
  - **Share Tech Mono** (`var(--font-share-tech)`) — labels, badges, section headers (ALL CAPS, `letter-spacing: 0.06em`)
  - **DM Sans** (`var(--font-dm-sans)`) — body content, session titles, entry prose
- Markdown content in `.entry-content` div gets styled via globals.css (h2, ul, li, code, p)
- Server components read entries at build time; client components handle filter state
- Layout is full-width fluid — `px-6 md:px-10 lg:px-16` responsive padding on all pages, no max-width cap. Text-heavy sections (lists, prose) use a `max-w-prose` wrapper.
- Project grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Any page fetching from Supabase at request time needs `export const dynamic = "force-dynamic"` — otherwise Next.js attempts static prerender at build time and fails
- CSS-only visualizations — no charting libraries. Proportional bars use `style={{ width: \`${pct}%\` }}`with a minimum width (4-6%) so small values are visible. Heatmap uses CSS grid with`grid-auto-flow: column`and`grid-template-rows: repeat(7, Npx)` to fill week-by-week.
- Accessibility pattern — all visualization containers get `aria-label`; charts get a `sr-only` text summary; color-encoded elements always have a secondary encoding (icon, border, or size variation); `prefers-reduced-motion` block lives in `globals.css` and kills all transitions site-wide.
- Analytics components live in `src/components/analytics/` (subdirectory, not flat in `src/components/`).
- Data display — lead with raw counts as the primary label on charts; defer percentages until the dataset exceeds ~20 entries to avoid implying false precision.

## Aesthetic Direction

**Understory Labs identity** — Cybernetic Nature. Forest floor at night: polygon/geometric leaf forms, mycelium networks, root systems, bioluminescent amber and green. Tech running through organic forms. Not a copy of Current OS — its own palette (deep forest floor base `#0e1710`, electric amber `#d4a574`, bioluminescent green `#6db87c`).

**Current ambient canvas approach:** Hand-coded canvas 2D — canopy (polygon leaves, dark green), undergrowth (mycelium nodes/strands), root system (amber branching). Works but limited visual quality ceiling.

**Deferred visual options to revisit** (when the hand-coded approach feels insufficient):

| Option                                  | What it is                                          | Best for                                                                    |
| --------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------- |
| **Lottie** (`lottie-react`)             | Pre-animated vector JSON files from LottieFiles     | Quick win — find a botanical asset, embed in one component                  |
| **Spline** (`@splinetool/react-spline`) | 3D scene editor with a web runtime                  | Highest visual quality, interactive 3D organic environments, ~800KB runtime |
| **SVG + GSAP**                          | Botanical SVG assets animated with the GSAP library | Most control, very performant, but requires sourcing SVG assets             |

## Do Not Touch

- `content/entries/` files are source of truth — don't rename or reformat for cosmetic reasons
- `.next/` and `out/` are generated — never edit
- `AGENTS.md` is Next.js agent guidance — leave in place

## Data Lifecycle

- **Session-end:** run `/wrap` to save memory and generate a voice-matched changelog entry for approval. Supersedes `/log` for session-end use.
- **Feature milestone:** `/ship` (Step 4 of data lifecycle plan) marks features as shipped in Supabase and generates celebration/debut entries.
- **Voice profile:** `references/voice-profile.md` — loaded by `/wrap` and `/ship` when drafting entries. Edit this file to tune the writing style.
- **Active plan:** `~/.claude/plans/save-state-data-lifecycle.md` — Steps 1–3 complete, Steps 4–6 remaining.

## Deferred Features

- **Project Network Graph** — projects as nodes connected by shared tech stack / tags (maps to the mycelium network brand metaphor). Revisit when 6+ projects exist and tag/entry data is richer.

## Integrations

- Vercel (dynamic SSR deployment)
- Supabase — `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` and Vercel dashboard. Supabase now labels these "publishable" (anon) and "secret" (service_role) in the dashboard — functionally identical, just renamed.
