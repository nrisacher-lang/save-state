---
date: "2026-06-01"
project: lore
session: "Rituals UI built — PATCH route, Hearth Calendar, push blocked on Gitea access"
tags: [feature, infrastructure]
type: session
---

## Features

- `PATCH /rituals/:id` added to the API — accepts `enabled`, `label`, `mood`, `cronExpr`; validates ownership using the same 404-covers-both pattern as DELETE; `updateSchema` defined at module scope alongside `createSchema`
- Ritual settings page (`/settings/rituals`) built — Hearth Calendar design: mood-accented left stripe (firepit/kitchen/den), large DOW + time display, label below, enabled toggle, delete on hover
- `AddRitualForm` complete — 7 DOW pills, HH:MM time input, 3 mood chips, label input, server dropdown hidden when user is in only one server
- Optimistic toggle (reverts on failure) and optimistic delete (re-fetches on failure) keep UI responsive without waiting on the API
- Rituals nav link added to settings sidebar with divider separator
- `Mood` type sourced from `@lore/types` rather than redefined locally — /simplify caught the duplication

## Infrastructure

- ISSUE-024 opened — push to `harmjoy/lore` blocked; Gitea returns "User permission denied for writing" from pre-receive hook despite valid token with write scope; repo-level collaborator access not set
- ISSUE-023 opened — `harmjoy/lorev2` is a separate older JavaScript codebase; easy to push to the wrong repo
- Penpal message sent (ID 13) to Nathan requesting Write access on `harmjoy/lore → Settings → Collaboration`
- Lore `CLAUDE.md` repository section corrected — harmjoy org, HTTPS-only, token-in-URL pattern for headless pushes documented
- Global CLAUDE.md gotchas table updated with pre-push hook TTY limitation

## Lessons

- `git credential reject` requires piped input — bare command fails with "refusing to work with credential missing host field"; correct form: `printf "protocol=https\nhost=<host>\n" | git credential reject`
- Gitea "User permission denied for writing" from the pre-receive hook is a repo-level collaborator permission issue, not a token scope issue — same error fires regardless of token; fix is `Settings → Collaboration`, not token regeneration
- Lore's Vercel pre-push hook runs a full ~2 min build before git contacts Gitea — GCM has no TTY to show a credential dialog; token must be embedded directly in the remote URL for headless pushes, then reset after
- `harmjoy/lorev2` and `harmjoy/lore` are completely different repos (JS vs TypeScript monorepo) — `git ls-remote` on both showed divergent commit hashes; don't assume repo name matches project name

## TODO

- Nathan to grant `nicole` Write access on `harmjoy/lore` (ISSUE-024) — then `git push origin feat/rituals-management` and open PR on Gitea
- Confirm with Nathan whether `harmjoy/lorev2` should be archived to avoid future confusion (ISSUE-023)
- Continue with Step 2 (place settings polish + arrival sound upload) once PR is unblocked
