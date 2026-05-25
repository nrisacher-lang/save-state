/**
 * Seed wiki data for life-automation (project_state + projects wiki columns).
 *
 * Run AFTER wiki-schema-migration.sql has been applied.
 *
 * Usage:
 *   npx tsx scripts/seed-wiki-life-automation.ts
 *
 * Uses service role key (bypasses RLS). Safe to re-run (upsert).
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
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

async function main() {
  console.log("Seeding wiki data for life-automation...\n");

  // ── project_state ──────────────────────────────────────────────────────────
  // Current state: Kitchen Module plan, KM-5 complete, working toward KM-6
  const { error: stateError } = await supabase.from("project_state").upsert(
    {
      project_id: "current-os",
      current_step: "KM-6 — Mobile /shop route + Costco lookup",
      total_steps: 8,
      step_number: 6,
      plan_path: "~/.claude/plans/life-automation-kitchen-module-plan.md",
      active_branch: "main",
      last_activity_at: new Date().toISOString(),
      last_commit_message:
        "log: Kitchen Module KM-1 — recipe foundation, URL import, conversational intake",
      checklist: [
        { item: "Kroger price API integrated", done: true },
        { item: "Aisle data lookup working", done: true },
        { item: "Costco lookup", done: false },
        { item: "/shop mobile route complete", done: false },
        { item: "Unit tests passing", done: false },
      ],
      updated_at: new Date().toISOString(),
    },
    { onConflict: "project_id" }
  );

  if (stateError) {
    console.error("project_state upsert failed:", stateError.message);
    process.exit(1);
  }
  console.log("✓ project_state seeded for current-os");

  // ── projects wiki columns ──────────────────────────────────────────────────
  const { error: projectError } = await supabase
    .from("projects")
    .update({
      vault_path: "life-automation/",
      quick_start: [
        "cd ~/Projects/life-automation",
        "npm run dev",
        "Check current branch and Kitchen Module plan:",
        "  ~/.claude/plans/life-automation-kitchen-module-plan.md",
        "Companion API runs separately — see homelab/CLAUDE.md for Taproot services.",
      ].join("\n"),
      related_projects: ["save-state", "taproot", "bud"],
    })
    .eq("id", "current-os");

  if (projectError) {
    console.error("projects update failed:", projectError.message);
    process.exit(1);
  }
  console.log("✓ projects wiki columns seeded for current-os");

  // ── project_activity — seed one session_start event as smoke test ──────────
  const { error: activityError } = await supabase.from("project_activity").insert({
    project_id: "current-os",
    activity_type: "session_start",
    summary: "Wiki schema seeded — initial activity event",
    metadata: { source: "seed-script" },
    created_at: new Date().toISOString(),
  });

  if (activityError) {
    console.error("project_activity insert failed:", activityError.message);
    process.exit(1);
  }
  console.log("✓ project_activity smoke-test event inserted");

  console.log("\nDone. Verify in Supabase dashboard → Table Editor.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
