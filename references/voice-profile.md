# Save State — Voice Profile

Used by `/wrap` and `/ship` when generating changelog entries. Load this file before drafting any entry.

---

## Tone

- Confident, not boastful. Technical precision without jargon barriers.
- Celebrates outcomes without fanfare — "feature complete" not "excited to ship"
- No first person. No "we." No hedging ("might," "could," "potentially").
- No filler ("also," "additionally," "furthermore," "in order to").
- Reads like dispatch from someone who knows exactly what they built and why.

---

## Structure Rules

- **Em-dashes are the primary connector** — links "what" to "so what": "Intelligence Foundation phase complete — AI scheduling layer operational"
- **Feature name leads the bullet**, then what it does or why it matters
- **Declarative, present tense** for capabilities: "events now carry state" not "events were updated to carry state"
- **Parenthetical asides** for inline context that would break flow as a clause: "(Shed, not just 'projects')"
- **Code references in backticks**: `` `lifecycle_state` ``, `` `shipped_date` ``
- **Lessons start with the insight**, not the context: "Naming is a design decision, not an afterthought" not "We learned that naming..."
- **Root causes stated plainly** in bug fixes: "caused by unhandled promise rejection on Claude API timeout"
- Each bullet earns its place. One idea, one sentence.

---

## Sections

Use only sections that have content. Never include an empty section.

| Section             | When to use                                                                   |
| ------------------- | ----------------------------------------------------------------------------- |
| `## Features`       | Always — new functionality, shipped capabilities                              |
| `## Bug Fixes`      | Only when bugs were resolved                                                  |
| `## Infrastructure` | Only when tooling, config, CI, deployment, or schema work was done            |
| `## Lessons`        | Always — insights, decisions, non-obvious realizations                        |
| `## TODO`           | Sparingly — unfinished threads, follow-up items identified during the session |

Order: Features → Bug Fixes → Infrastructure → Lessons → TODO

---

## Frontmatter

```markdown
---
date: "YYYY-MM-DD"
project: project-id
session: "Human-readable session title"
tags: [tag1, tag2]
type: session
---
```

- `type`: `session` (default), `ship` (feature shipped), `debut` (new project)
- Tags: 1–3 lowercase words from: `feature`, `bug`, `infrastructure`, `ai`, `refactor`, `launch`, `tooling`, `brainstorm`, `naming`, `brand`, `phase`, `audio`, `projects`
- Session title: short, outcome-focused. What was accomplished, not just what was worked on.

---

## Entry Type: `ship`

Used when a named feature reaches shipped status. The entry celebrates the moment — more presence than a regular session log.

- First bullet names the feature explicitly and declares it shipped
- Subsequent bullets describe the capability, the differentiator, and the practical outcome
- Lessons reflect on the design decisions that made it work (or almost didn't)
- Tone is direct and earned — not humble, not hyperbolic

## Entry Type: `debut`

Used when a new project is registered for the first time. The entry introduces the project — its name, purpose, and what distinguishes it.

- First bullet states what the project is and does
- Second bullet describes the core differentiator or design principle
- Third bullet describes the first working piece or current state
- Lessons reflect on the decision to build it, or the insight that shaped the initial design
- Description (in Supabase) should be 3 paragraphs: what it is, the core differentiator, and current state. Match the depth and prose style of existing project descriptions.

---

## Few-Shot Examples

### Example 1 — session entry (project: bark)

```markdown
---
date: "2026-03-21"
project: bark
session: "Better Ears + Smart Brain — Claude-powered audio intelligence"
tags: [feature, ai, audio, claude]
type: session
---

## Features

- Claude integration added to Bark — bot now understands context around sound triggers
- Smart Brain mode: Claude analyzes recent activity before deciding whether to play a sound
- Better Ears: audio detection sensitivity tuned with configurable threshold
- Cooldown logic added to prevent rapid-fire repeat plays after a trigger

## Bug Fixes

- Fixed race condition where two overlapping audio events would both trigger playback
- Resolved NSSM service restart loop caused by unhandled promise rejection on Claude API timeout

## Infrastructure

- Claude API key stored in `.env` and loaded via dotenv — not hardcoded
- NSSM service updated to use new entry point after refactor

## Lessons

- Wrapping AI calls in try/catch with graceful fallback (play sound anyway) prevents service crashes
- Claude's response latency is noticeable in real-time audio contexts — async fire-and-forget works better than blocking
```

### Example 2 — session entry (project: current-os)

```markdown
---
date: "2026-03-08"
project: current-os
session: "Intelligence Foundation — corrections, lifecycle, normalization"
tags: [infrastructure, ai, phase]
type: session
---

## Features

- Intelligence Foundation phase complete — AI scheduling layer operational
- Event correction pipeline: Claude reviews raw calendar events and normalizes titles, durations, and categories
- Lifecycle tracking: events now carry state (raw, normalized, scheduled, completed)
- Normalization runs on ingest — events are clean before they hit the scheduling engine

## Infrastructure

- Supabase schema extended with `lifecycle_state` and `normalized_at` columns
- Correction pipeline runs as a server action triggered by calendar sync
- Idempotent design — re-running normalization on already-normalized events is safe

## Lessons

- Treating AI output as a suggestion layer (not a replacement for original data) made corrections reversible
- `lifecycle_state` as an enum column gave clearer audit trails than boolean flags
- The hardest part of AI pipeline design is deciding what "done" looks like for a given event — encoding that as a state machine helped
```

### Example 3 — session entry (project: save-state)

```markdown
---
date: "2026-03-23"
project: save-state
session: "Save State — brainstorm and naming"
tags: [brainstorm, naming, brand]
type: session
---

## Features

- Understory Labs brand identity locked — warm organic names with layered meaning
- Save State vision brief completed — purpose, audience, aesthetic direction confirmed
- Plan finalized — 6 steps, two checkpoints, weekend-scope build

## Lessons

- Naming is a design decision, not an afterthought — the name shapes how you build
- "Save State" works on three layers: game checkpoint, session preservation, project record
- The Understory metaphor earns its keep — light filtering through canopy, warmth in the dark
- Building a changelog for your own projects creates a forcing function for reflective practice
```
