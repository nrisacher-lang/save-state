import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";

const ENTRIES_DIR = path.join(process.cwd(), "content", "entries");

const PROJECT_NAMES: Record<string, string> = {
  "current-os": "Current OS",
  "save-state": "Save State",
  bark: "Bark",
  "claude-code": "Claude Code",
};

const PROJECT_IDS = Object.keys(PROJECT_NAMES);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function ask(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\nSave State — New Entry\n");

  // Project
  console.log(`Projects: ${PROJECT_IDS.join(" / ")}`);
  let project = "";
  while (!PROJECT_IDS.includes(project)) {
    project = (await ask(rl, "Project: ")).trim();
    if (!PROJECT_IDS.includes(project)) {
      console.log(`  Unknown project. Choose from: ${PROJECT_IDS.join(", ")}`);
    }
  }

  // Session title
  const session = (await ask(rl, "Session title: ")).trim();
  if (!session) {
    console.error("Session title is required.");
    rl.close();
    process.exit(1);
  }

  // Tags
  const tagsRaw = (await ask(rl, "Tags (comma-separated, or enter to skip): ")).trim();
  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  rl.close();

  // Build file
  const date = todayISO();
  const slug = slugify(session);
  const filename = `${date}-${slug}.md`;
  const filepath = path.join(ENTRIES_DIR, filename);

  const tagsYaml = tags.length > 0 ? `[${tags.join(", ")}]` : "[]";

  const content = `---
date: "${date}"
project: ${project}
session: "${session}"
tags: ${tagsYaml}
---

## Features

-

## Lessons

-
`;

  if (fs.existsSync(filepath)) {
    console.error(`\nFile already exists: ${filepath}`);
    process.exit(1);
  }

  fs.writeFileSync(filepath, content, "utf8");
  console.log(`\nCreated: content/entries/${filename}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
