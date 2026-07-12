---
date: "2026-07-11"
project: taproot
session: "Supabase Kong health monitor — correct endpoint discovered and wired"
tags: [infrastructure, tooling]
type: session
---

## Features

- Uptime Kuma monitor added for `supa.rootstack.dev` — watches full outage path: Cloudflare tunnel → Kong → GoTrue every 60 seconds
- Monitor confirmed [Up] 200 - OK — endpoint: `https://supa.rootstack.dev/auth/v1/health`, header: `apikey: <anon_key>`, accepted: 200-299 only

## Infrastructure

- Discord notifications deferred — webhook URL needed; to-do logged to `content/wiki/taproot/plan.mdx` Next Steps

## Lessons

- Kong's global key-auth plugin applies to **all** routes — no health bypass at the route level; every request needs the `apikey` header
- `/rest/v1/` (PostgREST schema root) returns 403 for anon role regardless of valid key — not usable as a health check despite being the obvious candidate
- GoTrue `/auth/v1/health` is the correct Supabase health endpoint — returns `{"status":"ok"}` 200 when apikey header is valid
- Uptime Kuma is Vue.js — direct `.value =` assignment on form fields is silently ignored; native `HTMLInputElement` setter + `dispatchEvent('input')` required for browser automation
