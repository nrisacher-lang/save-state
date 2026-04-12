---
date: "2026-04-12"
project: bark
session: "Bug sweep — soundboard spinner, phrase match, error surfacing"
tags: [bug, ai, audio]
type: session
---

## Bug Fixes

- Soundboard "Add to Soundboard" spinner hung forever — root cause: `except RuntimeError`
  too narrow, leaving `FileNotFoundError` (expired temp file) and `discord.errors.Forbidden`
  unhandled before `followup.send()` was called; broadened to `except Exception`
- Public channel announcement failure masked as upload failure — upload and announcement
  now in independent try/except blocks; announcement errors silently ignored
- "Phrase Not Found — Failed to analyze transcript" on valid matches — Claude was generating
  `retry_suggestions` as a second JSON block instead of embedding it in the result object;
  rewrote prompt to show `retry_suggestions` inside each schema example
- `max_tokens` raised 512 → 1024 in phrase matcher — response truncation was cutting off
  JSON mid-object on longer explanations

## Infrastructure

- Parse error logging added to matcher fallback path — raw Claude response and exception
  now printed to `service-stdout.log` for diagnosis instead of silently swallowing

## Lessons

- Discord deferred interactions require `followup.send()` to resolve the spinner — any
  unhandled exception before that call leaves the spinner permanent and silent
- Claude prompt structure shapes response structure: a "in ALL cases, include X" instruction
  after the schema produces a second JSON block, not a merged one; shared fields belong
  inside every schema example
- `service-stdout.log` and `service-stderr.log` carry different signal — stdout gets Python
  `print()` output, stderr gets discord.py tracebacks; check both when debugging
