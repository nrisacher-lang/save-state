---
date: "2026-05-27"
project: codec
session: "Layer 1 shipped — comp library, coaching view, and live deployment"
tags: [feature, launch, infrastructure]
type: session
---

## Features

- Comp Library (Step 4) live — filter bar (playstyle, rating, emblem trait, archived toggle), CompCard with channel numbers, tags, difficulty bars, star rating; 3-step AddComp wizard
- Comp Detail + Coaching View (Step 5) live — unit roster grouped by FRONT / MID / BACK rows, CORE vs FLEX badge, per-unit items and coaching notes
- INTEL BRIEF accordion — one panel per note type (general → adaptation), all panels open by default when content exists; `adaptation` panel uses amber accent to flag game-critical notes
- Inline note editing — pencil icon per panel, textarea replaces content on click, optimistic update reverts on server error
- Client-side filtering — `useMemo` over full comp set; `show_archived: true` on initial fetch so archive toggle works without refetch
- App deployed at `codec.understorylabs.co` — Google OAuth working, all routes protected, user data isolated via Supabase RLS

## Bug Fixes

- Next.js 16 proxy convention: initial deploy used `middleware.ts` with `export function middleware()` — produced deprecation warning in Vercel build; fixed by creating `proxy.ts` with `export async function proxy()` and deleting `middleware.ts`
- React 18 click-through on modal open: backdrop click handler and open trigger processed in same synchronous flush — modal opened and immediately closed; fixed with `setTimeout(() => setIsModalOpen(true), 0)`
- OAuth redirect to `localhost:5173` on live deployment: caused by Supabase shared project having only localhost in Redirect URLs; fixed by adding `https://codec.understorylabs.co/auth/callback` to Redirect URLs (Site URL unchanged)

## Infrastructure

- GitHub repo created at `nrisacher-lang/codec` — private; `git remote set-url` required after initial remote conflict
- Vercel project configured — three env vars set, auto-deploy on push to main
- `codec.understorylabs.co` CNAME routes through Cloudflare (DNS-only) to Vercel

## Lessons

- Next.js 16 prints a clear deprecation warning when `middleware.ts` is present — the message says "use proxy instead," which is exact; reading Vercel build output catches this immediately
- Supabase shared projects (multiple apps on one instance): Redirect URLs is additive — add the new app's callback URL without touching Site URL; changing Site URL re-routes all apps sharing that project
- Tailwind v4 CSS variable colors require inline `style` props for opacity variants — `bg-my-color/80` silently outputs full opaque color when the token is a CSS variable; `color-mix()` is the fix
- Optimistic UI with server actions: update local state and clear edit mode before awaiting the action, revert in catch — this keeps the UI snappy while preserving correctness on failure
