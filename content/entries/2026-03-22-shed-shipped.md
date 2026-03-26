---
date: "2026-03-22"
project: current-os
session: "Shed — AI home project tracker shipped"
tags: [feature, ai, projects]
type: ship
---

## Features

- Shed ships — AI-powered home project tracker operational inside Current OS
- Natural-language intake: describe a project in plain terms, Claude structures it into category, phase, materials, and priority
- Projects overlay surfaces active work with status and last-updated indicators — no digging through lists
- AI scheduling integration active from day one — projects surface in the prioritization engine context at intake

## Lessons

- Naming matters: "Shed" (not just "projects") creates a mental namespace that keeps feature scope clear inside a large app
- Building for AI context at intake pays off immediately — fields added for Claude's use proved useful in the first scheduling run before the feature shipped
- The AI-aware data model pattern: design the schema around what AI needs to be useful, not only what humans need to enter
