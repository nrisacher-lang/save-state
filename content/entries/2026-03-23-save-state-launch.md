---
date: "2026-03-23"
project: save-state
session: "Save State — built and deployed"
tags: [launch, infrastructure, tooling]
---

## Features

- Save State shipped — deployed static changelog at save-state-two.vercel.app
- Project filter works client-side with instant response — no API calls, zero latency
- Three-tier typography system implemented — JetBrains Mono titles, Share Tech Mono labels, DM Sans body
- Entry fade-in animation with 80ms stagger on load and on filter change

## Infrastructure

- Next.js 16 static export — builds to flat HTML/CSS/JS, no server required
- Content engine reads markdown at build time via gray-matter + unified/remark/rehype pipeline
- Vercel deployment connected to GitHub — pushes to master trigger automatic redeploys
- `/log` skill installed globally — writes entries to this repo from any project directory
- `npm run new-entry` CLI scaffolder for manual entries without Claude present

## Lessons

- Static export + client-side filtering is the right architecture for a changelog — simple, fast, zero infrastructure cost
- Baking the design system in Step 1 (not as a polish pass at the end) meant every component looked right from first render
- The `/log` skill as a cross-project concern (writing to save-state from any directory) is the right model — the changelog is infrastructure, not just another feature
- Naming the naming convention step in `/new-project` means future projects start with the right frame
