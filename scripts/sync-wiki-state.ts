/**
 * Sync wiki state from local git repos to Supabase.
 *
 * For each known project → path mapping:
 *   1. Reads git log to get latest commit (hash, message, timestamp)
 *   2. Gets active branch
 *   3. Upserts project_state (last_commit_message, last_activity_at, active_branch)
 *   4. Inserts a project_activity event of type "commit" if the commit hash changed
 *
 * Usage:
 *   cd ~/Projects/save-state
 *   npx tsx scripts/sync-wiki-state.ts                          # all projects
 *   npx tsx scripts/sync-wiki-state.ts --project-id=current-os  # one project
 *   npx tsx scripts/sync-wiki-state.ts --dry-run                # preview, no writes
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import { execSync } from "child_process";
import { existsSync } from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// ─── Project → local path mapping ─────────────────────────────────────────────
// Update this map when new projects are added to Supabase.

const PROJECT_PATHS: Record<string, string> = {
  "current-os": "C:/Users/nrisa/Projects/life-automation",
  "save-state": "C:/Users/nrisa/Projects/save-state",
  bark: "C:/Users/nrisa/Projects/discord-soundbite-bot",
  bud: "C:/Users/nrisa/Projects/bud",
  codec: "C:/Users/nrisa/Projects/codec",
  taproot: "C:/Users/nrisa/Projects/homelab",
  lore: "C:/Users/nrisa/Projects/lore",
  "understory-labs-site": "C:/Users/nrisa/Projects/understory-labs-site",
  "claude-code": "C:/Users/nrisa/.claude",
  "field-notes": "C:/Users/nrisa/Projects/field-notes",
  peer: "C:/Users/nrisa/Projects/peer",
};

// Projects that inherit status from a parent rather than syncing their own git activity.
// Key: child project id, Value: parent project id.
const STATUS_INHERITS_FROM: Record<string, string> = {
  "kitchen-module": "current-os",
};

// ─── Guide drift config ───────────────────────────────────────────────────────

const WIKI_REPO_PATH = "C:/Users/nrisa/Projects/understory-labs-site";

// Project IDs that don't match their wiki directory name.
const WIKI_DIR_OVERRIDE: Record<string, string> = {
  "current-os": "life-automation",
};

// Commit message prefixes / keywords that indicate a user-facing feature change.
// These trigger the guide drift counter — bug fixes and chores do not.
const FEATURE_PREFIXES = [
  "feat:",
  "ui:",
  "design:",
  "ship:",
  "log:",
  "add:",
  "implement:",
  "build:",
];
const FEATURE_KEYWORDS = ["add ", "new ", "implement", "redesign", "overhaul", "ship"];
const NON_FEATURE_PREFIXES = ["fix:", "refactor:", "docs:", "chore:", "test:", "bump"];

function isFeatureCommit(message: string): boolean {
  const lower = message.toLowerCase();
  if (NON_FEATURE_PREFIXES.some((p) => lower.startsWith(p))) return false;
  if (FEATURE_PREFIXES.some((p) => lower.startsWith(p))) return true;
  return FEATURE_KEYWORDS.some((k) => lower.includes(k));
}

function getGuideLastUpdated(projectId: string): string | null {
  const wikiDir = WIKI_DIR_OVERRIDE[projectId] ?? projectId;
  const relPath = `content/wiki/${wikiDir}/how-to-use.mdx`;
  try {
    const result = execSync(
      `git -C "${WIKI_REPO_PATH}" log -1 --format="%cI" -- "${relPath}"`,
      GIT_OPTS
    ).trim();
    return result || null;
  } catch {
    return null;
  }
}

// ─── Arg parser ───────────────────────────────────────────────────────────────

function getArg(name: string): string | undefined {
  const flag = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(flag));
  return arg ? arg.slice(flag.length) : undefined;
}

const targetProjectId = getArg("project-id");
const dryRun = process.argv.includes("--dry-run");

if (dryRun) console.log("DRY RUN — no writes will be made.\n");

// ─── Git helpers ──────────────────────────────────────────────────────────────

interface GitInfo {
  hash: string;
  message: string;
  timestamp: string; // ISO
  branch: string;
}

const GIT_OPTS = { encoding: "utf-8" as const, stdio: "pipe" as const };

function getGitInfo(repoPath: string): GitInfo | null {
  if (!existsSync(repoPath)) return null;

  try {
    const logLine = execSync(`git -C "${repoPath}" log -1 --format="%H|%s|%cI"`, GIT_OPTS).trim();

    if (!logLine) return null;

    const [hash, message, timestamp] = logLine.split("|");

    const branch = execSync(`git -C "${repoPath}" rev-parse --abbrev-ref HEAD`, GIT_OPTS).trim();

    return { hash, message, branch, timestamp };
  } catch {
    return null;
  }
}

// ─── Sync one project ─────────────────────────────────────────────────────────

async function syncProject(projectId: string): Promise<void> {
  const repoPath = PROJECT_PATHS[projectId];
  if (!repoPath) {
    console.log(`  [${projectId}] No path mapping — skipping`);
    return;
  }

  const git = getGitInfo(repoPath);
  if (!git) {
    console.log(`  [${projectId}] Not a git repo or no commits — skipping`);
    return;
  }

  console.log(`  [${projectId}] ${git.branch} @ ${git.hash.slice(0, 7)} — ${git.message}`);

  // Fetch existing state to detect if commit changed
  const { data: existingState } = await supabase
    .from("project_state")
    .select("last_commit_message, active_branch")
    .eq("project_id", projectId)
    .maybeSingle();

  const commitChanged = !existingState || existingState.last_commit_message !== git.message;

  if (dryRun) {
    if (commitChanged) {
      console.log(`    → Would upsert state + insert commit event (new commit detected)`);
    } else {
      console.log(`    → Commit unchanged, would skip activity insert`);
    }
    return;
  }

  // Upsert project_state
  const { error: stateError } = await supabase.from("project_state").upsert(
    {
      project_id: projectId,
      last_commit_message: git.message,
      last_activity_at: git.timestamp,
      active_branch: git.branch,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "project_id" }
  );

  if (stateError) {
    console.error(`    ! State upsert failed: ${stateError.message}`);
    return;
  }

  // Insert activity event only if commit changed
  if (commitChanged) {
    const { error: actError } = await supabase.from("project_activity").insert({
      project_id: projectId,
      activity_type: "commit",
      summary: git.message,
      created_at: git.timestamp,
    });

    if (actError) {
      console.error(`    ! Activity insert failed: ${actError.message}`);
    } else {
      console.log(`    ✓ State updated + commit event inserted`);
    }
  } else {
    console.log(`    ✓ State updated (commit unchanged, no new event)`);
  }
}

// ─── Guide drift sync ─────────────────────────────────────────────────────────

async function syncGuideDrift(projectId: string): Promise<void> {
  const guideLastUpdated = getGuideLastUpdated(projectId);

  if (!guideLastUpdated) {
    // No guide exists — sentinel value -1
    if (!dryRun) {
      await supabase
        .from("project_state")
        .upsert(
          { project_id: projectId, guide_last_updated: null, guide_drift_count: -1 },
          { onConflict: "project_id" }
        );
    }
    console.log(`  [${projectId}] guide: no how-to-use.mdx`);
    return;
  }

  // Fetch commits to this project since the guide was last updated
  const { data: activities } = await supabase
    .from("project_activity")
    .select("summary")
    .eq("project_id", projectId)
    .eq("activity_type", "commit")
    .gt("created_at", guideLastUpdated);

  const driftCount = (activities ?? []).filter((a: { summary: string | null }) =>
    isFeatureCommit(a.summary ?? "")
  ).length;

  console.log(
    `  [${projectId}] guide: last updated ${guideLastUpdated.slice(0, 10)}, drift = ${driftCount} feature commit(s)`
  );

  if (!dryRun) {
    await supabase.from("project_state").upsert(
      {
        project_id: projectId,
        guide_last_updated: guideLastUpdated,
        guide_drift_count: driftCount,
      },
      { onConflict: "project_id" }
    );
  }
}

// ─── Status sync ──────────────────────────────────────────────────────────────
//
// Infers projects.status from project_state.last_activity_at.
// Rules:
//   - "complete" is never touched (manual-only designation)
//   - last_activity_at <= 30 days ago  → active
//   - last_activity_at >  30 days ago  → paused
//   - no project_state row             → planned
//   - child projects (STATUS_INHERITS_FROM) copy their parent's status

const ACTIVE_THRESHOLD_DAYS = 30;

async function syncStatuses(): Promise<void> {
  console.log("\nStatus sync\n");

  // Fetch all non-complete projects
  const { data: projects, error: projError } = await supabase
    .from("projects")
    .select("id, status, parent_id")
    .neq("status", "complete");

  if (projError || !projects) {
    console.error(`  ! Failed to fetch projects: ${projError?.message}`);
    return;
  }

  // Fetch all project_state rows
  const { data: states } = await supabase
    .from("project_state")
    .select("project_id, last_activity_at");

  const stateMap = new Map(
    (states ?? []).map((s: { project_id: string; last_activity_at: string | null }) => [
      s.project_id,
      s.last_activity_at,
    ])
  );

  const now = Date.now();
  const thresholdMs = ACTIVE_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;

  // First pass: resolve status for all synced projects (non-inheriting)
  const resolvedStatus = new Map<string, string>();

  for (const project of projects) {
    if (STATUS_INHERITS_FROM[project.id]) continue; // handled in second pass

    const lastActivity = stateMap.get(project.id);
    let newStatus: string;

    if (!lastActivity) {
      newStatus = "planned";
    } else {
      const age = now - new Date(lastActivity).getTime();
      newStatus = age <= thresholdMs ? "active" : "paused";
    }

    resolvedStatus.set(project.id, newStatus);

    if (newStatus !== project.status) {
      if (!dryRun) {
        const { error } = await supabase
          .from("projects")
          .update({ status: newStatus })
          .eq("id", project.id);
        if (error) {
          console.error(`  ! [${project.id}] Status update failed: ${error.message}`);
          continue;
        }
      }
      console.log(
        `  [${project.id}] ${project.status} → ${newStatus}${dryRun ? " (dry run)" : ""}`
      );
    } else {
      console.log(`  [${project.id}] ${project.status} (unchanged)`);
    }
  }

  // Second pass: children inherit from parent
  for (const [childId, parentId] of Object.entries(STATUS_INHERITS_FROM)) {
    const childProject = projects.find((p) => p.id === childId);
    if (!childProject) continue;

    const parentStatus = resolvedStatus.get(parentId);
    if (!parentStatus) {
      console.log(`  [${childId}] Parent ${parentId} not found or complete — skipping`);
      continue;
    }

    if (parentStatus !== childProject.status) {
      if (!dryRun) {
        const { error } = await supabase
          .from("projects")
          .update({ status: parentStatus })
          .eq("id", childId);
        if (error) {
          console.error(`  ! [${childId}] Status update failed: ${error.message}`);
          continue;
        }
      }
      console.log(
        `  [${childId}] ${childProject.status} → ${parentStatus} (inherited from ${parentId})${dryRun ? " (dry run)" : ""}`
      );
    } else {
      console.log(`  [${childId}] ${childProject.status} (inherited from ${parentId}, unchanged)`);
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const projectIds = targetProjectId ? [targetProjectId] : Object.keys(PROJECT_PATHS);

  console.log(`\nWiki state sync — ${projectIds.length} project(s)\n`);

  for (const id of projectIds) {
    await syncProject(id);
  }

  await syncStatuses();

  console.log(`\nGuide drift sync\n`);

  for (const id of projectIds) {
    await syncGuideDrift(id);
  }

  console.log(`\nDone.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
