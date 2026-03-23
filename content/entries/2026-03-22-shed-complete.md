---
date: "2026-03-22"
project: current-os
session: "Shed — Home Projects feature shipped"
tags: [feature, ai, projects]
---

## Features

- Shed (Home Projects) feature complete — AI-powered home project tracker inside Current OS
- Project intake form with scope, phase, materials, and priority fields
- Projects overlay renders active projects with status and last-updated indicators
- AI scheduling integration — projects surface in prioritization context

## Bug Fixes

- Project intake overlay z-index conflict with calendar resolved
- Phase label display corrected for multi-phase projects

## Lessons

- Keeping features namespaced (Shed, not just "projects") helps maintain mental boundaries in a large app
- AI-aware data models pay off immediately — fields added for AI context during intake proved useful in first scheduling run
