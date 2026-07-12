---
date: "2026-07-11"
project: field-notes
session: "Pipeline wiki live — fact-check wired, product-researcher CCR deployed"
tags: [feature, ai, infrastructure]
type: session
---

## Features

- Product-researcher CCR deployed — `field-notes-product-researcher` routine live at
  claude.ai/code/scheduled (`trig_01DTP3MHZJ9E75PYypYUxU69`), daily 10am EDT, field-notes
  cloud env; `scripts/run-product-researcher.ps1` is the prompt source-of-truth
- Fact-check briefing type confirmed end-to-end — `FactCheckIntakeModal` (green `#7ec8a0`),
  IntelShell AD-HOC "Fact Check" view, `VERDICT_STYLES` map on `ItemCard`
  (TRUE/FALSE/MISLEADING/MIXED/UNVERIFIABLE); frontend was completed in a prior wiki session
  that ran out of context before it could be verified
- Pipeline wiki docs live at understorylabs.co/wiki/field-notes — `pipelines.mdx` covers
  all 6 pipelines with Quick Reference table, ASCII decision tree, per-pipeline intake fields,
  example JSON submissions, analysis descriptions, and verdict vocabulary

## Bug Fixes

- Wiki MDX tables now render as HTML — `remarkGfm` wired to all 6 `MDXRemote` calls via
  `options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}`; tables appeared as pipe-delimited
  raw text because the plugin was imported and the const defined, but no call had the prop

## Infrastructure

- `FIELD_NOTES_CRON_SECRET` added to understory-labs-site `.env.local` — the
  `/api/fact-check/submit` proxy route requires it to forward to field-notes; it existed in
  Vercel production already but was absent locally

## Lessons

- Importing `remarkGfm` and defining a const is not enough — each `MDXRemote` call needs the
  `options` prop individually; the `mdxOptions` wrapper key is correct for `next-mdx-remote/rsc`
  v6, not just the non-RSC serialize path
- Explore agent audits in multi-session work are unreliable — the agent reported
  `getFactCheckBriefings()`, the itemType union, and `FactCheckIntakeModal` as missing when all
  were already present; read the actual files before acting on an audit after a context switch
- `git diff --stat` is the reliable truth check; `git status --short` showed files as modified
  that had no actual changes — misleading in context-switched sessions

## TODO

- Fact-check CCR (`field-notes-fact-checker` cloud routine) — items queue at intake but no
  enrichment fires; CCR setup is in a separate session
- Financial summaries briefing type — early exploration done: 39 purchase rows in Bud, but
  `category` is mostly `"other"` or null (qwen2.5:3b categorization is poor); plan not yet drafted
