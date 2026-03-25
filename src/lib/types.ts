export interface EntryFrontmatter {
  date: string; // YYYY-MM-DD
  project: string; // kebab-case project identifier
  session: string; // human-readable session title
  tags: string[]; // e.g., ["infrastructure", "launch"]
}

export interface Entry {
  frontmatter: EntryFrontmatter;
  slug: string; // filename without .md
  content: string; // rendered HTML
}

export interface ProjectSummary {
  id: string; // kebab-case
  displayName: string; // human-readable
  entryCount: number;
  lastActive: string; // date of most recent entry
}

// Supabase-backed types

export interface Project {
  id: string; // kebab-case, matches entry frontmatter project IDs
  displayName: string;
  tagline: string;
  description: string; // markdown — rendered on project page
  techStack: string[];
  status: "active" | "planned" | "archived";
  color: string; // hex
  url: string | null;
  repoUrl: string | null;
  icon: string | null;
  sortOrder: number;
}

export interface Feature {
  id: string;
  projectId: string; // FK → projects.id
  name: string;
  description: string | null;
  status: "shipped" | "in-progress" | "planned";
  shippedDate: string | null; // YYYY-MM-DD
  sortOrder: number;
}
