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

export interface AnalyticsData {
  overview: {
    totalEntries: number;
    totalProjects: number;
    totalFeatures: number;
    shippedFeatures: number;
    inProgressFeatures: number;
    plannedFeatures: number;
    totalWords: number;
    daysSinceLastEntry: number;
    momentum: number; // 0-100
    momentumComponents: {
      recencyDays: number;
      recentShipCount: number;
      activeProjectCount: number;
    };
  };
  cadence: {
    avgDaysBetweenEntries: number;
    longestGapDays: number;
    currentStreakDays: number;
    firstEntryDate: string | null;
  };
  focusScore: number; // Herfindahl index 0-1
  focusLabel: string; // "DEEP FOCUS" | "BALANCED" | "BROAD SPREAD"
  entriesByProject: {
    projectId: string;
    displayName: string;
    color: string;
    count: number;
  }[];
  featuresByProject: {
    projectId: string;
    displayName: string;
    color: string;
    shipped: number;
    inProgress: number;
    planned: number;
    entryCount: number;
  }[];
  entriesByMonth: { month: string; count: number }[];
  entryDates: string[]; // YYYY-MM-DD, sorted ascending — raw input for heatmap
  currentlyBuilding: {
    name: string;
    projectId: string;
    projectName: string;
    projectColor: string;
  }[];
  whatsNext: {
    name: string;
    projectId: string;
    projectName: string;
    projectColor: string;
  }[];
  recentShipments: {
    name: string;
    projectId: string;
    projectName: string;
    projectColor: string;
    shippedDate: string;
  }[];
  tagFrequency: { tag: string; count: number }[];
  techStackFrequency: { tech: string; count: number }[];
  wordCountByEntry: {
    slug: string;
    session: string;
    project: string;
    words: number;
  }[];
}
