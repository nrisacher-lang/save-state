/**
 * Insert a release note into the Supabase release_notes table.
 *
 * Usage:
 *   npx tsx scripts/insert-release-note.ts \
 *     --project-id=current-os \
 *     --title="Kitchen Module — shipped" \
 *     [--version="v1.0"] \
 *     [--body="Short description of what shipped."]
 *
 * Uses service role key (bypasses RLS). Safe to run multiple times — each
 * call inserts a new row (release notes are not deduplicated by title).
 * Table schema: id, project_id, version, title, content (NOT NULL), published_at, created_at
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

function requireArg(name: string): string {
  const val = getArg(name);
  if (!val) {
    console.error(`Missing required argument: --${name}=`);
    process.exit(1);
  }
  return val;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const projectId = requireArg("project-id");
const title = requireArg("title");
const version = getArg("version") ?? null;
const content = getArg("body") ?? title; // content is NOT NULL — fall back to title if omitted

console.log(`\nInserting release note:`);
console.log(`  project:    ${projectId}`);
console.log(`  title:      ${title}`);
if (version) console.log(`  version:    ${version}`);
console.log(`  content:    ${content.slice(0, 80)}${content.length > 80 ? "…" : ""}`);

(async () => {
  const { data, error } = await supabase
    .from("release_notes")
    .insert({
      project_id: projectId,
      title,
      version,
      content,
      published_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error(`\nInsert failed: ${error.message}`);
    process.exit(1);
  }

  console.log(`\nInserted release note: ${data.id}`);
  console.log(`View at: /wiki/${projectId}/releases`);
})();
