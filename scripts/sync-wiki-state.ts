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
  homelab: "C:/Users/nrisa/Projects/homelab",
  lore: "C:/Users/nrisa/Projects/lore",
  "understory-labs-site": "C:/Users/nrisa/Projects/understory-labs-site",
};

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

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const projectIds = targetProjectId ? [targetProjectId] : Object.keys(PROJECT_PATHS);

  console.log(`\nWiki state sync — ${projectIds.length} project(s)\n`);

  for (const id of projectIds) {
    await syncProject(id);
  }

  console.log(`\nDone.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
