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
