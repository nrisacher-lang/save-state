---
date: "2026-05-31"
project: understory-labs-site
session: "Field Notes pipeline complete — all 5 steps, end-to-end live"
tags: [feature, ai, infrastructure]
type: session
---

## Features

- Field Notes pipeline end-to-end operational — GitHub Trending scan → enrichment → Field Station review → implementation
- Enrichment trigger live (`trig_01S3L3aKyThqy4aKPTyMVgUq`) — Monday 10am EDT, reads unprocessed items, runs three-lens analysis, writes to `fn_enrichments`
- Implementation trigger live (`trig_01CZNzNJAwgZQynAhUu7EL4s`) — daily 8am EDT, reads approved items, generates implementation artifacts in `action_details` JSONB
- Field Station intelligence dashboard shipped — see ship entry for full detail

## Infrastructure

- CCR trigger prompts include explicit `CRON_SECRET` header and Supabase URL — remote agents have zero local env access, all context must be in the prompt
- Implementation trigger v1 stores note content in `action_details` JSONB rather than committed files — CCR can clone the repo but cannot push without a GitHub PAT configured in the trigger prompt

## Lessons

- CCR agents run in a fully isolated cloud environment — they can read the cloned repo but `git push` fails without a PAT explicitly embedded in the trigger prompt; design around this constraint rather than assuming git write access
