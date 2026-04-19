---
date: "2026-04-19"
project: claude-code
session: "understorylabs.co — domain, brief, plan, scaffold, and skill upgrades"
tags: [brand, tooling, launch]
type: session
---

## Features

- Understory Labs site identity locked — no self-description, work speaks for itself, Cybernetic Nature as the visual identity (not just a Current OS direction — the brand aesthetic)
- Vision brief complete — personal brand as project showcase, infra dashboard, changelog, wiki, and ecosystem visual at understorylabs.co
- 8-step build plan saved to `~/.claude/plans/understory-labs-site-plan.md` — The Hub architecture, Leonardo for visuals, Cloudflare Worker for status API, n8n for changelog curation
- understory-labs-site scaffolded at `~/Projects/understory-labs-site` — Next.js, Tailwind v4, Cybernetic Nature palette as CSS custom properties, JetBrains Mono + DM Sans font system
- Deployed to Vercel — three domains registered: `understorylabs.co`, `os.understorylabs.co` (Current OS), `log.understorylabs.co` (Save State)

## Infrastructure

- `understorylabs.co` purchased (Porkbun), DNS moved to Cloudflare — active and resolving
- Resource inventory memory created at `reference_resource_inventory.md` — subscriptions, domains, infra catalogued for future brainstorm/plan sessions
- `/brainstorm` updated — Phase 0 context inference (drafts answers from prior conversation instead of re-asking), resource inventory check added to Phase 4.5
- `/plan` updated — resource inventory check added to Step 1.5
- `/execute-plan` updated — parallel opportunity check added before execution and after each step
- `/wrap` updated — resource inventory update step added after `/save`

## Lessons

- Titles go stale — brand identity built on what you make and how you think, not what your job is called
- The Understory metaphor was never just an aesthetic — it's the site's architecture, its navigation metaphor, its proof of work
- A records map names to IPs directly; CNAMEs alias one name to another — use CNAMEs for subdomains so infrastructure changes don't require manual DNS updates
- Cloudflare proxying must be off (gray cloud) for Vercel-managed subdomains — proxying intercepts the TLS handshake Vercel needs to provision certificates

## TODO

- Add Cloudflare DNS records to complete Step 1: A `@` → `76.76.21.21`, CNAME `os` → `cname.vercel-dns.com`, CNAME `log` → `cname.vercel-dns.com` (DNS only)
- Delete old Porkbun A records from Cloudflare once new records are added
- Verify all three domains resolve before starting Step 2 (Design System)
