/**
 * Backfill historical git commits into project_activity for the wiki.
 *
 * The regular sync-wiki-state.ts only tracks the latest commit.
 * This script reads the full git log for each project and inserts
 * every commit as a historical activity event (skipping duplicates).
 *
 * Usage:
 *   cd ~/Projects/save-state
 *   npx tsx scripts/backfill-wiki-activity.ts                          # all projects
 *   npx tsx scripts/backfill-wiki-activity.ts --project-id=bark        # one project
 *   npx tsx scripts/backfill-wiki-activity.ts --dry-run                # preview
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

const PROJECT_PATHS: Record<string, string> = {
  "current-os": "C:/Users/nrisa/Projects/life-automation",
  "save-state": "C:/Users/nrisa/Projects/save-state",
  bark: "C:/Users/nrisa/Projects/discord-soundbite-bot",
  bud: "C:/Users/nrisa/Projects/bud",
  taproot: "C:/Users/nrisa/Projects/homelab",
  lore: "C:/Users/nrisa/Projects/lore",
  "understory-labs-site": "C:/Users/nrisa/Projects/understory-labs-site",
};

function getArg(name: string): string | undefined {
  const flag = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(flag));
  return arg ? arg.slice(flag.length) : undefined;
}

const targetProjectId = getArg("project-id");
const dryRun = process.argv.includes("--dry-run");

interface CommitInfo {
  hash: string;
  message: string;
  timestamp: string;
}

function getAllCommits(repoPath: string): CommitInfo[] {
  if (!existsSync(repoPath)) return [];

  try {
    const output = execSync(`git -C "${repoPath}" log --format="%H|%s|%cI" --reverse`, {
      encoding: "utf-8",
      stdio: "pipe",
      maxBuffer: 10 * 1024 * 1024,
    }).trim();

    if (!output) return [];

    return output.split("\n").map((line) => {
      const [hash, message, timestamp] = line.split("|");
      return { hash, message, timestamp };
    });
  } catch {
    return [];
  }
}

async function backfillProject(projectId: string): Promise<number> {
  const repoPath = PROJECT_PATHS[projectId];
  if (!repoPath) {
    console.log(`  [${projectId}] No path mapping — skipping`);
    return 0;
  }

  const commits = getAllCommits(repoPath);
  if (commits.length === 0) {
    console.log(`  [${projectId}] No commits found — skipping`);
    return 0;
  }

  console.log(`  [${projectId}] Found ${commits.length} commits`);

  // Fetch existing activity to avoid duplicates (match on summary + project_id)
  const { data: existing } = await supabase
    .from("project_activity")
    .select("summary")
    .eq("project_id", projectId)
    .eq("activity_type", "commit");

  const existingSummaries = new Set((existing ?? []).map((e) => e.summary));

  const newCommits = commits.filter((c) => !existingSummaries.has(c.message));

  if (newCommits.length === 0) {
    console.log(`    → All commits already in database`);
    return 0;
  }

  console.log(`    → ${newCommits.length} new commits to insert`);

  if (dryRun) {
    for (const c of newCommits) {
      console.log(`    [dry] ${c.timestamp.slice(0, 10)} — ${c.message}`);
    }
    return newCommits.length;
  }

  // Insert in batches of 50
  let inserted = 0;
  for (let i = 0; i < newCommits.length; i += 50) {
    const batch = newCommits.slice(i, i + 50).map((c) => ({
      project_id: projectId,
      activity_type: "commit",
      summary: c.message,
      created_at: c.timestamp,
    }));

    const { error } = await supabase.from("project_activity").insert(batch);

    if (error) {
      console.error(`    ! Batch insert failed: ${error.message}`);
    } else {
      inserted += batch.length;
    }
  }

  // Update project_state with the latest commit info
  const latest = commits[commits.length - 1];
  const branch = (() => {
    try {
      return execSync(`git -C "${repoPath}" rev-parse --abbrev-ref HEAD`, {
        encoding: "utf-8",
        stdio: "pipe",
      }).trim();
    } catch {
      return "main";
    }
  })();

  await supabase.from("project_state").upsert(
    {
      project_id: projectId,
      last_commit_message: latest.message,
      last_activity_at: latest.timestamp,
      active_branch: branch,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "project_id" }
  );

  console.log(`    ✓ ${inserted} events inserted, project_state updated`);
  return inserted;
}

async function main() {
  const projectIds = targetProjectId ? [targetProjectId] : Object.keys(PROJECT_PATHS);

  console.log(`\nWiki activity backfill — ${projectIds.length} project(s)`);
  if (dryRun) console.log("DRY RUN — no writes will be made.");
  console.log();

  let total = 0;
  for (const id of projectIds) {
    total += await backfillProject(id);
  }

  console.log(`\nDone. ${total} events ${dryRun ? "would be" : ""} inserted.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
