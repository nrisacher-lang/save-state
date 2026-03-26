/**
 * Update or insert a feature in the Supabase features table.
 *
 * Check current state (no changes):
 *   npx tsx scripts/update-feature.ts --project-id=bark --name="smart brain" --check
 *
 * Update existing feature:
 *   npx tsx scripts/update-feature.ts --project-id=bark --name="smart brain" --status=shipped [--shipped-date=2026-03-25]
 *
 * Insert new feature:
 *   npx tsx scripts/update-feature.ts --project-id=bark --name="New Feature" --status=in-progress [--description="..."] [--sort-order=5]
 *
 * Feature matching: case-insensitive substring on name within the given project.
 * If no match is found, the script inserts a new row.
 * Uses service role key (bypasses RLS). Safe to re-run.
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

// ─── Arg parser ───────────────────────────────────────────────────────────────

function getArg(name: string): string | undefined {
  const flag = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(flag));
  return arg ? arg.slice(flag.length) : undefined;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const projectId = getArg("project-id");
  const name = getArg("name");
  const status = getArg("status") as "shipped" | "in-progress" | "planned" | undefined;
  const shippedDate = getArg("shipped-date");
  const description = getArg("description");
  const sortOrderRaw = getArg("sort-order");
  const checkOnly = hasFlag("check");

  if (!projectId || !name) {
    console.error("Required: --project-id=<id> --name=<feature name>");
    console.error(
      "Optional: --status=<shipped|in-progress|planned> --shipped-date=YYYY-MM-DD --description=<text> --sort-order=<n> --check"
    );
    process.exit(1);
  }

  if (status && !["shipped", "in-progress", "planned"].includes(status)) {
    console.error(`Invalid status: ${status}. Must be: shipped, in-progress, planned`);
    process.exit(1);
  }

  // Look up existing feature by project + name (case-insensitive substring)
  const { data: matches, error: queryError } = await supabase
    .from("features")
    .select("*")
    .eq("project_id", projectId)
    .ilike("name", `%${name}%`);

  if (queryError) {
    console.error("Query failed:", queryError.message);
    process.exit(1);
  }

  if (matches && matches.length > 1) {
    console.error(
      `Ambiguous — ${matches.length} features matched "${name}" in project "${projectId}":`
    );
    matches.forEach((f) => console.error(`  - ${f.name}`));
    console.error("Use a more specific name.");
    process.exit(1);
  }

  if (matches && matches.length === 1) {
    const existing = matches[0];

    if (checkOnly) {
      console.log(`Feature: "${existing.name}"`);
      console.log(`  project:      ${existing.project_id}`);
      console.log(`  status:       ${existing.status}`);
      console.log(`  shipped_date: ${existing.shipped_date ?? "(none)"}`);
      console.log(`  description:  ${existing.description ?? "(none)"}`);
      return;
    }

    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (shippedDate) {
      updates.shipped_date = shippedDate;
    } else if (status === "shipped") {
      updates.shipped_date = todayISO();
    }
    if (description) updates.description = description;

    if (Object.keys(updates).length === 0) {
      console.log(`No changes requested for "${existing.name}". Exiting.`);
      return;
    }

    const { error: updateError } = await supabase
      .from("features")
      .update(updates)
      .eq("id", existing.id);

    if (updateError) {
      console.error("Update failed:", updateError.message);
      process.exit(1);
    }

    console.log(`✓ Updated: "${existing.name}"`);
    Object.entries(updates).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
  } else {
    // No match — insert new feature
    if (checkOnly) {
      console.log(`No feature matched "${name}" in project "${projectId}".`);
      console.log("Would insert a new feature on run (without --check).");
      return;
    }

    console.log(`No match for "${name}" in "${projectId}" — inserting new feature.`);

    const newFeature: Record<string, unknown> = {
      project_id: projectId,
      name,
      status: status ?? "in-progress",
      shipped_date: status === "shipped" ? (shippedDate ?? todayISO()) : (shippedDate ?? null),
      description: description ?? null,
      sort_order: sortOrderRaw ? parseInt(sortOrderRaw, 10) : 99,
    };

    const { error: insertError } = await supabase.from("features").insert(newFeature);
    if (insertError) {
      console.error("Insert failed:", insertError.message);
      process.exit(1);
    }

    console.log(`✓ Inserted: "${name}"`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
