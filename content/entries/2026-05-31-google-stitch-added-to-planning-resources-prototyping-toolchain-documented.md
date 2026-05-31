---
date: "2026-05-31"
project: claude-code
session: "Google Stitch added to planning resources — prototyping toolchain documented"
tags: [tooling, brainstorm]
type: session
---

## Features

- Google Stitch catalogued as a UI prototyping tool — new **Frontend Design & Prototyping** section added to `ai-resources.md`
- Decision rule documented: Stitch answers "what should this look like," `/frontend-design` answers "how should this be built" — Stitch is upstream of code generation, not a replacement for it
- Stitch surfaces during `/plan` and `/brainstorm` sessions as a candidate for visually novel layouts where prose description falls short (e.g., PlaceCanvas, new dashboard modes)

## Lessons

- Stitch and Leonardo AI are not in the same category — Leonardo generates raster image assets, Stitch generates functional HTML/CSS/React from natural language; comparing them only makes sense if you're mapping the full design toolchain
- `ai-resources.md` is the right home for tool-level knowledge that should surface during planning, not CLAUDE.md — CLAUDE.md already references it as the planning resource
