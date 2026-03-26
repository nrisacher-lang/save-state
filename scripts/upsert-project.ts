/**
 * Upsert a project to Supabase and add a CSS variable for its color to globals.css.
 *
 * Usage (pipe JSON):
 *   echo '{"id":"my-project","display_name":"My Project",...}' | npx tsx scripts/upsert-project.ts
 *
 * Usage (inline flag):
 *   npx tsx scripts/upsert-project.ts --json='{"id":"my-project",...}'
 *
 * Usage (from file):
 *   npx tsx scripts/upsert-project.ts --json-file=/tmp/project.json
 *
 * Required JSON fields: id, display_name, tagline, description, tech_stack, status, color, sort_order
 * Optional: url, repo_url, icon
 *
 * Uses service role key (bypasses RLS). Safe to re-run (upsert on conflict).
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
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

// ─── Input parsing ─────────────────────────────────────────────────────────────

async function readJson(): Promise<string> {
  // --json='...' flag
  const jsonFlag = process.argv.find((a) => a.startsWith("--json="));
  if (jsonFlag) return jsonFlag.slice("--json=".length);

  // --json-file=/path flag
  const fileFlag = process.argv.find((a) => a.startsWith("--json-file="));
  if (fileFlag) {
    const filePath = fileFlag.slice("--json-file=".length);
    return fs.readFileSync(filePath, "utf8").trim();
  }

  // stdin
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => {
      process.stdin.destroy();
      resolve(data.trim());
    });
    process.stdin.on("error", reject);
  });
}

// ─── CSS variable helper ───────────────────────────────────────────────────────

function ensureCssVariable(projectId: string, color: string): void {
  const cssPath = path.resolve(__dirname, "../src/app/globals.css");
  const content = fs.readFileSync(cssPath, "utf8");
  const varName = `--project-${projectId}`;

  if (content.includes(varName)) {
    console.log(`  CSS var ${varName} already exists — no change`);
    return;
  }

  // Find the last --project-* line and insert immediately after it
  const projectVarRegex = /[ \t]*--project-[a-z0-9-]+:\s*[^;]+;/g;
  let lastMatch: RegExpExecArray | null = null;
  let m: RegExpExecArray | null;
  while ((m = projectVarRegex.exec(content)) !== null) {
    lastMatch = m;
  }

  if (lastMatch) {
    const insertPos = lastMatch.index + lastMatch[0].length;
    const indent = lastMatch[0].match(/^([ \t]*)/)![1];
    const newContent =
      content.slice(0, insertPos) + `\n${indent}${varName}: ${color};` + content.slice(insertPos);
    fs.writeFileSync(cssPath, newContent, "utf8");
    console.log(`  Added CSS var: ${varName}: ${color};`);
  } else {
    console.warn(
      `  Could not find insertion point in globals.css — add manually: ${varName}: ${color};`
    );
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const raw = await readJson();

  if (!raw) {
    console.error("No input. Pipe JSON, use --json='...', or use --json-file=/path/to/file.json");
    process.exit(1);
  }

  let project: Record<string, unknown>;
  try {
    project = JSON.parse(raw);
  } catch {
    console.error("Failed to parse JSON:", raw);
    process.exit(1);
  }

  if (!project.id || typeof project.id !== "string") {
    console.error("JSON must include an 'id' field (string).");
    process.exit(1);
  }

  console.log(`Upserting project: ${project.id}`);

  const { error } = await supabase.from("projects").upsert(project, { onConflict: "id" });
  if (error) {
    console.error("Upsert failed:", error.message);
    process.exit(1);
  }
  console.log(`  ✓ Project '${project.id}' upserted`);

  if (project.color && typeof project.color === "string") {
    ensureCssVariable(project.id, project.color);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
