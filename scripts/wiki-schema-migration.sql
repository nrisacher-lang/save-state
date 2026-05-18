-- Wiki Schema Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- Safe to re-run — uses IF NOT EXISTS throughout

-- ─── New table: project_activity ─────────────────────────────────────────────
-- Stores all activity signals across projects: commits, session starts, ships,
-- plan step changes. The source of truth for the wiki's activity timeline
-- and "last active" timestamps — independent of /wrap running.

CREATE TABLE IF NOT EXISTS project_activity (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id   text        NOT NULL,
  activity_type text       NOT NULL CHECK (activity_type IN ('commit', 'session_start', 'ship', 'plan_step_change')),
  summary      text,
  metadata     jsonb       DEFAULT '{}',
  created_at   timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_activity_project_id  ON project_activity(project_id);
CREATE INDEX IF NOT EXISTS idx_project_activity_created_at  ON project_activity(created_at DESC);

ALTER TABLE project_activity ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'project_activity' AND policyname = 'anon can read project_activity'
  ) THEN
    CREATE POLICY "anon can read project_activity" ON project_activity
      FOR SELECT TO anon USING (true);
  END IF;
END $$;


-- ─── New table: release_notes ─────────────────────────────────────────────────
-- Stores structured release notes per project. Written by /ship (auto-drafted,
-- user-approved). Rendered in the wiki and eventually on a public releases page.

CREATE TABLE IF NOT EXISTS release_notes (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id   text        NOT NULL,
  version      text        NOT NULL,
  title        text        NOT NULL,
  content      text        NOT NULL,  -- markdown: What's New, Improvements, Fixes, Infra, Breaking, What's Next
  published_at timestamptz NOT NULL,
  created_at   timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_release_notes_project_id   ON release_notes(project_id);
CREATE INDEX IF NOT EXISTS idx_release_notes_published_at ON release_notes(published_at DESC);

ALTER TABLE release_notes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'release_notes' AND policyname = 'anon can read release_notes'
  ) THEN
    CREATE POLICY "anon can read release_notes" ON release_notes
      FOR SELECT TO anon USING (true);
  END IF;
END $$;


-- ─── New table: project_state ─────────────────────────────────────────────────
-- One row per project. Updated by n8n workflows and local scripts.
-- Tracks current plan step, last git activity, active branch, checklist.
-- The wiki reads this for the "At a Glance" section — never stale by more than 30min.

CREATE TABLE IF NOT EXISTS project_state (
  id                   uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id           text        UNIQUE NOT NULL,
  current_step         text,
  total_steps          int,
  step_number          int,
  plan_path            text,
  active_branch        text,
  last_activity_at     timestamptz,
  last_commit_message  text,
  checklist            jsonb       DEFAULT '[]',  -- [{item: string, done: boolean}]
  updated_at           timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_state_project_id    ON project_state(project_id);
CREATE INDEX IF NOT EXISTS idx_project_state_last_activity ON project_state(last_activity_at DESC);

ALTER TABLE project_state ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'project_state' AND policyname = 'anon can read project_state'
  ) THEN
    CREATE POLICY "anon can read project_state" ON project_state
      FOR SELECT TO anon USING (true);
  END IF;
END $$;


-- ─── Extend existing: projects table ─────────────────────────────────────────
-- Adding wiki-specific operational columns.
-- Note: repo_url and url (live URL) already exist — not duplicated here.

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS vault_path       text,
  ADD COLUMN IF NOT EXISTS quick_start      text,
  ADD COLUMN IF NOT EXISTS related_projects text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS connections      jsonb  DEFAULT '[]';

-- connections shape (per element):
-- {
--   "service":    string,               -- display name, e.g. "Supabase"
--   "type":       string,               -- database | ai | hosting | api | auth | automation | vcs | infra
--   "url":        string | null,        -- link to service dashboard
--   "vault_path": string | null,        -- path within Vaultwarden, e.g. "Life Automation / Supabase"
--   "notes":      string | null         -- one-line usage description
-- }
