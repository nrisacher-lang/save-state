# Save State

## Purpose

Public changelog and portfolio tracker for Understory Labs projects — static site listing shipped work, sessions, and lessons learned across all active projects.

## Stack

- Next.js 16 (App Router, static export via `output: 'export'`)
- TypeScript
- Tailwind CSS v4
- gray-matter (frontmatter parsing)
- unified / remark / rehype pipeline (markdown to HTML)

## Project Structure

- `src/app/` — Next.js App Router pages and root layout
- `src/components/` — UI components (Card, Header, ProjectFilter, EntryCard, EntryList)
- `src/lib/` — content engine (`entries.ts`), types, config
- `content/entries/` — markdown changelog entries (source of truth for all content)
- `scripts/` — CLI scaffolder (`new-entry.ts`)

## Commands

- Dev: `npm run dev`
- Build: `npm run build` (outputs to `out/` for static hosting)
- New entry: `npm run new-entry`

## Conventions

- Entry files: `YYYY-MM-DD-<slug>.md` in `content/entries/`
- Project IDs: kebab-case identifiers — `current-os`, `save-state`, `bark`, `claude-code`
- Design system lives in `globals.css` as CSS custom properties — never hardcode colors or fonts
- Three-font rule:
  - **JetBrains Mono 700** (`var(--font-jetbrains)`) — title, dates, counts
  - **Share Tech Mono** (`var(--font-share-tech)`) — labels, badges, section headers (ALL CAPS, `letter-spacing: 0.06em`)
  - **DM Sans** (`var(--font-dm-sans)`) — body content, session titles, entry prose
- Markdown content in `.entry-content` div gets styled via globals.css (h2, ul, li, code, p)
- Server components read entries at build time; client components handle filter state

## Do Not Touch

- `content/entries/` files are source of truth — don't rename or reformat for cosmetic reasons
- `.next/` and `out/` are generated — never edit
- `AGENTS.md` is Next.js agent guidance — leave in place

## Integrations

- Vercel (static export deployment — no backend, no API keys, no environment variables)
