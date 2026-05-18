/**
 * Add, update, or remove a single connection entry for a project.
 *
 * Update an existing service's vault path:
 *   npx tsx scripts/update-connection.ts --project-id=bud --service="Gmail OAuth" --vault-path="Bud / Google OAuth"
 *
 * Add a new service:
 *   npx tsx scripts/update-connection.ts \
 *     --project-id=bud --service="Stripe" --type="api" \
 *     --vault-path="Bud / Stripe" --notes="payment processing" --url="https://dashboard.stripe.com"
 *
 * Remove a service:
 *   npx tsx scripts/update-connection.ts --project-id=bud --service="OldService" --remove
 *
 * Check current state (no writes):
 *   npx tsx scripts/update-connection.ts --project-id=bud --check
 *
 * Matching is case-insensitive substring on service name within the project.
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

// ─── Types ────────────────────────────────────────────────────────────────────

interface Connection {
  service: string;
  type: string;
  url: string | null;
  vault_path: string | null;
  notes: string | null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const projectId = requireArg("project-id");
  const serviceName = requireArg("service");
  const isRemove = process.argv.includes("--remove");
  const isCheck = process.argv.includes("--check");

  // Fetch current connections
  const { data, error } = await supabase
    .from("projects")
    .select("display_name, connections")
    .eq("id", projectId)
    .single();

  if (error || !data) {
    console.error(`Project not found: ${projectId}`);
    process.exit(1);
  }

  const connections: Connection[] = (data.connections as Connection[]) ?? [];
  const matchIndex = connections.findIndex((c) =>
    c.service.toLowerCase().includes(serviceName.toLowerCase())
  );
  const match = matchIndex >= 0 ? connections[matchIndex] : null;

  // ── Check mode ──────────────────────────────────────────────────────────────
  if (isCheck) {
    console.log(`\n${data.display_name} — connections (${connections.length})\n`);
    if (connections.length === 0) {
      console.log("  (none)");
    } else {
      connections.forEach((c, i) => {
        const isMatch = c.service.toLowerCase().includes(serviceName.toLowerCase());
        const prefix = isMatch ? "→ " : "  ";
        console.log(`${prefix}[${i}] ${c.service} (${c.type})`);
        if (c.vault_path) console.log(`       vault: ${c.vault_path}`);
        if (c.notes) console.log(`       notes: ${c.notes}`);
        if (c.url) console.log(`       url:   ${c.url}`);
      });
    }

    if (!match) {
      console.log(
        `\nNo connection matched "${serviceName}" — would insert if run without --check.`
      );
    } else {
      console.log(`\nMatched: "${match.service}" at index ${matchIndex}`);
    }
    return;
  }

  // ── Remove mode ─────────────────────────────────────────────────────────────
  if (isRemove) {
    if (!match) {
      console.error(`No connection matched "${serviceName}" in ${projectId}`);
      process.exit(1);
    }

    const updated = connections.filter((_, i) => i !== matchIndex);

    const { error: writeError } = await supabase
      .from("projects")
      .update({ connections: updated })
      .eq("id", projectId);

    if (writeError) {
      console.error(`Update failed: ${writeError.message}`);
      process.exit(1);
    }

    console.log(`\nRemoved "${match.service}" from ${data.display_name}`);
    return;
  }

  // ── Add / update mode ───────────────────────────────────────────────────────
  const newVaultPath = getArg("vault-path") ?? match?.vault_path ?? null;
  const newUrl = getArg("url") ?? match?.url ?? null;
  const newNotes = getArg("notes") ?? match?.notes ?? null;
  const newType = getArg("type") ?? match?.type ?? "api";

  if (match) {
    // Update existing entry
    const before = { ...match };
    connections[matchIndex] = {
      service: match.service,
      type: newType,
      url: newUrl,
      vault_path: newVaultPath,
      notes: newNotes,
    };

    console.log(`\nUpdating "${match.service}" in ${data.display_name}:`);
    if (before.vault_path !== newVaultPath)
      console.log(`  vault_path: ${before.vault_path ?? "(none)"} → ${newVaultPath ?? "(none)"}`);
    if (before.url !== newUrl)
      console.log(`  url:        ${before.url ?? "(none)"} → ${newUrl ?? "(none)"}`);
    if (before.notes !== newNotes)
      console.log(`  notes:      ${before.notes ?? "(none)"} → ${newNotes ?? "(none)"}`);
    if (before.type !== newType) console.log(`  type:       ${before.type} → ${newType}`);
  } else {
    // Insert new entry
    const entry: Connection = {
      service: serviceName,
      type: newType,
      url: newUrl,
      vault_path: newVaultPath,
      notes: newNotes,
    };
    connections.push(entry);
    console.log(`\nAdding new connection "${serviceName}" to ${data.display_name}:`);
    console.log(`  type:       ${newType}`);
    if (newVaultPath) console.log(`  vault_path: ${newVaultPath}`);
    if (newUrl) console.log(`  url:        ${newUrl}`);
    if (newNotes) console.log(`  notes:      ${newNotes}`);
  }

  const { error: writeError } = await supabase
    .from("projects")
    .update({ connections })
    .eq("id", projectId);

  if (writeError) {
    console.error(`\nUpdate failed: ${writeError.message}`);
    process.exit(1);
  }

  console.log(`\n✓ Done — view at /wiki/${projectId}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
