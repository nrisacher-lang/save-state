---
date: "2026-07-11"
project: field-notes
session: "Em-dash encoding and modal slug fixed — two intake bugs traced and closed"
tags: [bug]
type: session
---

## Bug Fixes

- Em-dash and en-dash in research titles corrupted to `?` (U+FFFD) on save — PowerShell 5.1
  `Invoke-RestMethod -Body <string>` encodes using `[System.Text.Encoding]::Default`
  (Windows-1252), where em-dash is byte `0x97`; Node.js decodes as UTF-8 and rejects it;
  fixed by wrapping the body in `[System.Text.Encoding]::UTF8.GetBytes()` in the
  `/research` skill
- Freshly-submitted research cards linked to `/intel/<UUID>` instead of `/intel/<slug>` —
  `ResearchIntakeModal` typed the API response without `slug` and hardcoded `slug: null`
  on the optimistic item; the field-notes intake API was already returning `slug`; fixed
  by adding `slug: string | null` to the type cast and reading `data.slug ?? null`
- ISSUE-028 confirmed resolved — ad-hoc sources no longer appear in the SOURCES sidebar;
  all research items visible under AD-HOC views

## Lessons

- PowerShell 5.1 `Invoke-RestMethod -Body <string>` uses Windows-1252 by default —
  em-dashes corrupt silently; pass `[System.Text.Encoding]::UTF8.GetBytes($body)` and
  set `-ContentType 'application/json; charset=utf-8'` to guarantee UTF-8 on the wire
- An optimistic UI item must read every field from the API response, not just the IDs —
  `slug: null` hardcoded in the local item was invisible until the card rendered a UUID link
