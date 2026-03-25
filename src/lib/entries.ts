import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import type { Entry, EntryFrontmatter, ProjectSummary } from "./types";
import { getAllProjects } from "./projects";

const ENTRIES_DIR = path.join(process.cwd(), "content", "entries");

export async function markdownToHtml(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(content);
  return result.toString();
}

export async function getAllEntries(): Promise<Entry[]> {
  if (!fs.existsSync(ENTRIES_DIR)) {
    return [];
  }

  const filenames = fs.readdirSync(ENTRIES_DIR).filter((f) => f.endsWith(".md"));

  const entries = await Promise.all(
    filenames.map(async (filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fullPath = path.join(ENTRIES_DIR, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const html = await markdownToHtml(content);

      const frontmatter = data as EntryFrontmatter;
      if (!frontmatter.type) frontmatter.type = "session";

      return {
        frontmatter,
        slug,
        content: html,
      };
    })
  );

  return entries.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}

export async function getProjects(): Promise<ProjectSummary[]> {
  const [entries, supabaseProjects] = await Promise.all([getAllEntries(), getAllProjects()]);
  const nameMap = new Map(supabaseProjects.map((p) => [p.id, p.displayName]));

  const projectMap = new Map<string, { count: number; lastActive: string }>();

  for (const entry of entries) {
    const { project, date } = entry.frontmatter;
    const existing = projectMap.get(project);
    if (!existing) {
      projectMap.set(project, { count: 1, lastActive: date });
    } else {
      existing.count++;
      if (date > existing.lastActive) existing.lastActive = date;
    }
  }

  return Array.from(projectMap.entries()).map(([id, { count, lastActive }]) => ({
    id,
    displayName: nameMap.get(id) ?? id,
    entryCount: count,
    lastActive,
  }));
}

export async function getEntriesByProject(projectId: string): Promise<Entry[]> {
  const entries = await getAllEntries();
  return entries.filter((e) => e.frontmatter.project === projectId);
}
