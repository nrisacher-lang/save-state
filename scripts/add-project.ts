import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

function getArg(name: string): string | null {
  const flag = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(flag));
  return arg ? arg.slice(flag.length) : null;
}

function requireArg(name: string): string {
  const val = getArg(name);
  if (!val) {
    console.error(`Missing required argument: --${name}=<value>`);
    process.exit(1);
  }
  return val;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  const id = requireArg("id");
  const displayName = requireArg("name");
  const tagline = requireArg("tagline");
  const description = requireArg("description");
  const techRaw = requireArg("tech");
  const color = requireArg("color");
  const status = (getArg("status") ?? "active") as "active" | "planned" | "archived";
  const projectUrl = getArg("url") ?? null;
  const repoUrl = getArg("repo-url") ?? null;
  const icon = getArg("icon") ?? null;

  const techStack = techRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // Auto-determine sort_order: max existing + 1
  const { data: existing } = await supabase
    .from("projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  const sortOrder = existing && existing.length > 0 ? (existing[0].sort_order as number) + 1 : 1;

  const { error } = await supabase.from("projects").insert({
    id,
    display_name: displayName,
    tagline,
    description,
    tech_stack: techStack,
    status,
    color,
    url: projectUrl,
    repo_url: repoUrl,
    icon,
    sort_order: sortOrder,
  });

  if (error) {
    console.error("Failed to insert project:", error.message);
    process.exit(1);
  }

  console.log(`Project '${id}' added to Supabase.`);

  // Write CSS variable to globals.css
  const cssPath = path.resolve(process.cwd(), "src/app/globals.css");
  const cssContent = fs.readFileSync(cssPath, "utf8");
  const varName = `--project-${id}`;
  if (cssContent.includes(varName)) {
    console.log(`CSS var ${varName} already exists — no change.`);
  } else {
    const projectVarRegex = /[ \t]*--project-[a-z0-9-]+:\s*[^;]+;/g;
    let lastMatch: RegExpExecArray | null = null;
    let m: RegExpExecArray | null;
    while ((m = projectVarRegex.exec(cssContent)) !== null) lastMatch = m;
    if (lastMatch) {
      const insertPos = lastMatch.index + lastMatch[0].length;
      const indent = lastMatch[0].match(/^([ \t]*)/)![1];
      const updated =
        cssContent.slice(0, insertPos) +
        `\n${indent}${varName}: ${color};` +
        cssContent.slice(insertPos);
      fs.writeFileSync(cssPath, updated, "utf8");
      console.log(`Added CSS var: ${varName}: ${color};`);
    } else {
      console.warn(
        `Could not find insertion point in globals.css — add manually: ${varName}: ${color};`
      );
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
