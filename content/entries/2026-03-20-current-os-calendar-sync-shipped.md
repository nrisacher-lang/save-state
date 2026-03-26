---
date: "2026-03-20"
project: current-os
session: "Calendar sync — Google Calendar integration shipped"
tags: [feature, infrastructure]
type: ship
---

## Features

- Calendar sync ships — two-way Google Calendar integration live in Current OS
- Events read from Google Calendar at sync time and written into the Supabase events table
- Lifecycle pipeline picks up new events on sync — normalization and correction run automatically on ingest
- Changes made in Current OS propagate back to Google Calendar — source of truth stays synchronized

## Lessons

- Two-way sync requires deciding which side wins on conflict — making Current OS the write layer (with Google as display) simplified the mental model considerably
- Sync as an event trigger (not a cron job) means the pipeline runs when data arrives, not on a schedule indifferent to activity
