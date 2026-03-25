/**
 * Seed script — populates Supabase projects and features tables.
 *
 * Run with: npx tsx scripts/seed-projects.ts
 *
 * Uses the service role key (bypasses RLS) — never run in a browser context.
 * Safe to re-run: uses upsert, so existing rows are updated, not duplicated.
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

// ─── Project data ──────────────────────────────────────────────────────────

const projects = [
  {
    id: "current-os",
    display_name: "Current OS",
    tagline: "AI-powered personal operating system",
    description: `Current OS is an AI-powered personal operating system — a Next.js web app that coordinates the moving parts of daily life. Built on Supabase with a TypeScript frontend, it uses Claude to bring intelligence to tasks most tools treat as form fields.

The first module is **Shed**, a home project tracker that turns natural-language descriptions into structured, actionable records. Tell it "the basement has been leaking near the south wall" and it figures out the category, urgency, and next steps — no dropdowns, no form filling.

The **Intelligence Foundation** connects to your calendar and applies lifecycle management to events — correcting stale data, flagging conflicts, and surfacing what actually needs attention vs what can wait. **Predictive scheduling** is in progress: an AI-driven optimization layer that proposes schedule changes based on patterns, priorities, and context.`,
    tech_stack: ["Next.js", "Supabase", "TypeScript", "Claude API"],
    status: "active",
    color: "#c47a5a",
    url: "https://life-automation.vercel.app",
    repo_url: "https://github.com/nrisacher-lang/life-automation",
    icon: "⚙",
    sort_order: 1,
  },
  {
    id: "bark",
    display_name: "Bark",
    tagline: "Discord soundbite bot with Claude-powered intelligence",
    description: `Bark is a Discord soundbite bot with an AI brain. When someone says something that matches a configured trigger phrase, the bot plays a matching audio clip in the voice channel — but with a layer of Claude-powered intelligence deciding whether the moment is right.

**Smart Brain** is the core differentiator: rather than simple string matching, Bark routes messages through Claude for contextual analysis. It understands intent, not just keywords — reducing false positives and making playback feel earned rather than mechanical.

Two quality-of-life features make it usable in real servers: **Better Ears** lets you tune the detection sensitivity per trigger (no more false fires on partial matches), and **cooldown logic** prevents the same clip from playing twice in quick succession. The whole thing runs as a Windows service via NSSM, auto-starting on boot without a terminal window.`,
    tech_stack: ["Node.js", "TypeScript", "Discord.js", "Claude API", "NSSM"],
    status: "active",
    color: "#7baa8f",
    url: null,
    repo_url: "https://github.com/nrisacher-lang/discord-soundbite-bot",
    icon: "◈",
    sort_order: 2,
  },
  {
    id: "save-state",
    display_name: "Save State",
    tagline: "Understory Labs homepage and project portfolio",
    description: `Save State is the Understory Labs homepage — a living record of everything being built. It started as a static changelog (deployed March 2026) and is evolving into a dynamic portfolio site that serves two audiences: the builder who wants a mission control view, and the visitor who wants to understand what's being made and how.

The **content engine** reads markdown entry files at request time, parsing frontmatter and converting to HTML via a unified/remark/rehype pipeline. A global \`/log\` skill makes it frictionless to record a session from any project directory — one command, no context switching.

**Phase 2** adds server infrastructure (Uptime Kuma for health monitoring, ClaudeVault for persistent AI memory) on a self-hosted second computer, exposing services via Cloudflare Tunnel. The boundary is clean: Supabase handles content and analytics, the server handles operations.`,
    tech_stack: ["Next.js", "Supabase", "TypeScript", "Tailwind CSS", "Vercel"],
    status: "active",
    color: "#d4a574",
    url: "https://save-state-two.vercel.app",
    repo_url: "https://github.com/nrisacher-lang/save-state",
    icon: "▣",
    sort_order: 3,
  },
  {
    id: "claude-code",
    display_name: "Claude Code Setup",
    tagline: "Power user environment for AI-assisted development",
    description: `Claude Code Setup is the personal development environment for AI-assisted engineering at Understory Labs. It's not a project with a URL — it's the infrastructure layer that everything else runs on top of.

The core is a library of **25+ global skills**: reusable Claude Code commands that codify workflow patterns (\`/plan\`, \`/brainstorm\`, \`/commit\`, \`/log\`, \`/debug\`, \`/review\`, and more). Combined with MCP servers (GitHub integration, Context7 documentation lookup) and hooks (git event handlers, environment protection), it creates an environment where common operations are single commands.

The **opusplan model profile** is a key architectural detail: Opus during planning and architecture sessions, Sonnet during execution — so the most capable model is used where reasoning depth matters, and the faster model handles implementation. This setup is the scaffold for every other project in Understory Labs.`,
    tech_stack: ["Claude Code", "TypeScript", "Bash", "GitHub MCP", "Context7 MCP"],
    status: "active",
    color: "#8a7bc4",
    url: null,
    repo_url: "https://github.com/nrisacher-lang/claude-config",
    icon: "◇",
    sort_order: 4,
  },
];

// ─── Feature data ──────────────────────────────────────────────────────────

const features: Array<{
  project_id: string;
  name: string;
  description: string | null;
  status: "shipped" | "in-progress" | "planned";
  shipped_date: string | null;
  sort_order: number;
}> = [
  // Current OS
  {
    project_id: "current-os",
    name: "Shed — AI-powered home project tracker",
    description:
      "Natural-language input → structured records with category, urgency, and next steps via Claude",
    status: "shipped",
    shipped_date: "2026-03-22",
    sort_order: 1,
  },
  {
    project_id: "current-os",
    name: "Intelligence Foundation — event lifecycle pipeline",
    description: "Corrects stale calendar events, flags conflicts, surfaces what needs attention",
    status: "shipped",
    shipped_date: "2026-03-15",
    sort_order: 2,
  },
  {
    project_id: "current-os",
    name: "Calendar sync — Google Calendar integration",
    description: "Two-way sync between the app and Google Calendar",
    status: "shipped",
    shipped_date: "2026-03-20",
    sort_order: 3,
  },
  {
    project_id: "current-os",
    name: "Predictive scheduling — AI-driven schedule optimization",
    description: "Proposes schedule changes based on patterns, priorities, and context",
    status: "in-progress",
    shipped_date: null,
    sort_order: 4,
  },

  // Bark
  {
    project_id: "bark",
    name: "Smart Brain — Claude-powered contextual analysis",
    description:
      "Routes messages through Claude before triggering — understands intent, not just keywords",
    status: "shipped",
    shipped_date: "2026-03-01",
    sort_order: 1,
  },
  {
    project_id: "bark",
    name: "Better Ears — configurable detection sensitivity",
    description: "Per-trigger threshold tuning to reduce false positives",
    status: "shipped",
    shipped_date: "2026-03-01",
    sort_order: 2,
  },
  {
    project_id: "bark",
    name: "Cooldown logic — rapid-fire prevention",
    description: "Prevents the same clip from playing twice in quick succession",
    status: "shipped",
    shipped_date: "2026-03-01",
    sort_order: 3,
  },
  {
    project_id: "bark",
    name: "Windows service — NSSM auto-start on boot",
    description: "Runs as a background Windows service, survives reboots without a terminal window",
    status: "shipped",
    shipped_date: "2026-03-01",
    sort_order: 4,
  },

  // Save State
  {
    project_id: "save-state",
    name: "Changelog — filterable session log",
    description:
      "Markdown-driven entry list with client-side project filtering and staggered animations",
    status: "shipped",
    shipped_date: "2026-03-23",
    sort_order: 1,
  },
  {
    project_id: "save-state",
    name: "Content engine — markdown-to-HTML pipeline",
    description: "gray-matter + unified/remark/rehype pipeline reads entries at request time",
    status: "shipped",
    shipped_date: "2026-03-23",
    sort_order: 2,
  },
  {
    project_id: "save-state",
    name: "/log skill — cross-project entry authoring",
    description:
      "Global Claude Code skill — writes entries to this repo from any project directory",
    status: "shipped",
    shipped_date: "2026-03-23",
    sort_order: 3,
  },
  {
    project_id: "save-state",
    name: "Dynamic site — Supabase-backed portfolio",
    description: "Project deep-dives, landing page, analytics dashboard powered by Supabase",
    status: "in-progress",
    shipped_date: null,
    sort_order: 4,
  },
  {
    project_id: "save-state",
    name: "Analytics dashboard — cross-project work patterns",
    description:
      "Recharts visualizations: entries over time, by project, tag distribution, timeline",
    status: "planned",
    shipped_date: null,
    sort_order: 5,
  },
  {
    project_id: "save-state",
    name: "Health monitoring — live service status",
    description: "Uptime Kuma integration via self-hosted server (Phase 2)",
    status: "planned",
    shipped_date: null,
    sort_order: 6,
  },

  // Claude Code Setup
  {
    project_id: "claude-code",
    name: "25+ global skills — /plan, /brainstorm, /commit, /log, and more",
    description: "Reusable Claude Code commands codifying common engineering workflow patterns",
    status: "shipped",
    shipped_date: "2026-03-15",
    sort_order: 1,
  },
  {
    project_id: "claude-code",
    name: "MCP servers — GitHub and Context7",
    description:
      "GitHub integration for PR/issue management; Context7 for live documentation lookup",
    status: "shipped",
    shipped_date: "2026-03-10",
    sort_order: 2,
  },
  {
    project_id: "claude-code",
    name: "Hooks — git and environment event handlers",
    description: "Pre/post tool hooks: .env protection, git integration, session events",
    status: "shipped",
    shipped_date: "2026-03-10",
    sort_order: 3,
  },
  {
    project_id: "claude-code",
    name: "opusplan model profile — tiered model selection",
    description: "Opus for planning sessions, Sonnet for execution — configured in settings.json",
    status: "shipped",
    shipped_date: "2026-03-12",
    sort_order: 4,
  },
];

// ─── Seed ──────────────────────────────────────────────────────────────────

async function seed() {
  // Clear features first (FK dependency), then projects
  console.log("Clearing existing data...");
  const { error: clearFeaturesError } = await supabase
    .from("features")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (clearFeaturesError) {
    console.error("Clear features failed:", clearFeaturesError.message);
    process.exit(1);
  }
  const { error: clearProjectsError } = await supabase.from("projects").delete().neq("id", "");
  if (clearProjectsError) {
    console.error("Clear projects failed:", clearProjectsError.message);
    process.exit(1);
  }

  console.log("Seeding projects...");
  const { error: projectsError } = await supabase.from("projects").insert(projects);
  if (projectsError) {
    console.error("Projects seed failed:", projectsError.message);
    process.exit(1);
  }
  console.log(`  ✓ ${projects.length} projects inserted`);

  console.log("Seeding features...");
  const { error: featuresError } = await supabase.from("features").insert(features);
  if (featuresError) {
    console.error("Features seed failed:", featuresError.message);
    process.exit(1);
  }
  console.log(`  ✓ ${features.length} features inserted`);

  console.log("\nDone. Seed complete.");
}

seed();
