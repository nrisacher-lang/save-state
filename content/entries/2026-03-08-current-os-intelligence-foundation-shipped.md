---
date: "2026-03-08"
project: current-os
session: "Intelligence Foundation — AI scheduling layer shipped"
tags: [feature, ai, infrastructure]
type: ship
---

## Features

- Intelligence Foundation ships — AI scheduling layer operational, event lifecycle pipeline live
- Event correction pipeline: Claude reviews raw calendar events and normalizes titles, durations, and categories before they reach the scheduling engine
- Lifecycle tracking: events carry state (`raw`, `normalized`, `scheduled`, `completed`) — full audit trail from ingest to action
- Normalization runs on ingest — events are clean before they hit the scheduler, not after

## Lessons

- AI as suggestion layer (not replacement) keeps corrections reversible — original data is preserved, AI output sits alongside it
- `lifecycle_state` as an enum column gives clearer audit trails than boolean flags — state machines beat `is_processed` columns
- Defining "done" for an event is the hardest design decision in an AI pipeline — encoding it as a state machine forced that decision early
