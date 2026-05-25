---
date: "2026-05-24"
project: understory-labs-site
session: "Wiki enrichment — MDX content, guest access, responsive layout redesign"
tags: [feature, infrastructure]
type: session
---

## Features

- Architecture and Decision Log MDX content written for all 7 remaining projects — save-state, bark, bud, taproot, lore, understory-labs-site, claude-code; every wiki project page now renders populated Architecture and Decision Log sections
- Guest password support added to wiki login — `WIKI_GUEST_PASSWORD` env var checked alongside `WIKI_PASSWORD`; both produce the same HMAC auth cookie
- Wiki project page layout redesigned — asymmetric two-column replaced with horizontal metadata card row (Operational, Connections, Related Projects) above full-width content sections capped at 700px for readable line length
- Wiki sidebar now sticky — `position: sticky; top: 0; height: 100vh` keeps navigation visible while content scrolls
- Content area centered on wide screens — layout wrapper handles centering via flexbox with 1100px max-width

## Bug Fixes

- Heredoc (`<<<`) appends trailing newline to Vercel env var values — guest password stored with `\n` suffix, silently failing login; fixed with `printf '%s' 'value' | vercel env add`

## Infrastructure

- Responsive CSS classes (`wiki-project-stats`, `wiki-card-row`, `wiki-landing-body`) replace inline grid styles — stats grid collapses to 2-col at 900px, 1-col at 500px; card row uses `auto-fill` for fluid adaptation
- Landing page layout (`/wiki`) uses dedicated `wiki-landing-body` two-column grid — Active Projects + Recent Activity have balanced content that suits side-by-side display, unlike the project detail page

## Lessons

- `<<<` (bash here-string) appends `\n` to piped values — invisible in shell output, breaks exact-match password comparisons; `printf '%s'` strips the newline
- Different page types need different layouts — the wiki landing page has balanced columns (projects + activity), but the project detail page has asymmetric content (2000px of MDX vs one small card); forcing one grid pattern on both creates dead space or buried content
- `overflowY: auto` on a container creates its own scroll context — `position: sticky` children inside it stick relative to that container, not the viewport; removing it restores expected sticky behavior
