---
date: "2026-03-23"
project: save-state
session: "Save State — initial launch shipped"
tags: [launch, feature, tooling]
type: ship
---

## Features

- Save State ships — Understory Labs homepage live at save-state-two.vercel.app
- Content engine operational: markdown files in `content/entries/` parse to HTML via gray-matter + unified/remark/rehype at request time
- Changelog filterable by project with instant client-side response — no API calls, zero filter latency
- `/log` skill installed globally — writes changelog entries to this repo from any project directory, making Save State infrastructure, not just a site

## Lessons

- Static export plus client-side filtering is the right architecture for a changelog — simple, fast, zero infrastructure cost
- Building the design system first (not as a polish pass) means every component looks right from first render
- The `/log` skill as a cross-project concern is the key insight — a changelog that requires opening the right project first won't get used
