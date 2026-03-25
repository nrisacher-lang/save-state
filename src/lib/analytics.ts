import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllEntries } from "./entries";
import { getAllProjects, getAllFeatures } from "./projects";
import type { Project, AnalyticsData } from "./types";

const ENTRIES_DIR = path.join(process.cwd(), "content", "entries");

// Momentum formula weights — adjust here to tune the score
const MOMENTUM_WEIGHTS = { recency: 0.4, velocity: 0.35, activeProjects: 0.25 };
const RECENCY_WINDOW_DAYS = 30;
const VELOCITY_WINDOW_DAYS = 60;
const VELOCITY_MAX_SHIPS = 10; // ships in 60 days that maps to velocity score of 100

function countWords(markdown: string): number {
  return markdown.trim().split(/\s+/).filter(Boolean).length;
}

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA + "T00:00:00").getTime();
  const b = new Date(dateB + "T00:00:00").getTime();
  return Math.round(Math.abs(b - a) / (1000 * 60 * 60 * 24));
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const [entries, projects, features] = await Promise.all([
    getAllEntries(),
    getAllProjects(),
    getAllFeatures(),
  ]);

  const today = todayStr();
  const projectMap = new Map<string, Project>(projects.map((p) => [p.id, p]));

  // ── Word counts from raw markdown ──────────────────────────────────────
  // We read files directly here rather than using the HTML-rendered content
  // from getAllEntries(), since word counting needs the raw text, not HTML.
  const wordCountByEntry: AnalyticsData["wordCountByEntry"] = [];
  let totalWords = 0;

  if (fs.existsSync(ENTRIES_DIR)) {
    const filenames = fs.readdirSync(ENTRIES_DIR).filter((f) => f.endsWith(".md"));
    for (const filename of filenames) {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(ENTRIES_DIR, filename), "utf8");
      const { data, content } = matter(raw);
      const words = countWords(content);
      totalWords += words;
      wordCountByEntry.push({
        slug,
        session: (data.session as string) ?? slug,
        project: (data.project as string) ?? "",
        words,
      });
    }
    // Sort by date ascending (filename is YYYY-MM-DD-slug)
    wordCountByEntry.sort((a, b) => a.slug.localeCompare(b.slug));
  }

  // ── Dates, recency, cadence ─────────────────────────────────────────────
  const sortedDates = entries.map((e) => e.frontmatter.date).sort();
  const firstEntryDate = sortedDates[0] ?? null;
  const lastEntryDate = sortedDates[sortedDates.length - 1] ?? null;
  const daysSinceLastEntry = lastEntryDate ? daysBetween(lastEntryDate, today) : 999;

  // Gaps between consecutive entries (for avg and max)
  const gaps: number[] = [];
  for (let i = 1; i < sortedDates.length; i++) {
    gaps.push(daysBetween(sortedDates[i - 1], sortedDates[i]));
  }
  const avgDaysBetweenEntries =
    gaps.length > 0 ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : 0;
  const longestGapDays = gaps.length > 0 ? Math.max(...gaps) : 0;

  // Weekly streak: count consecutive 7-day windows going back from today
  // A window "counts" if it contains at least one entry.
  const entryDateSet = new Set(sortedDates);
  const msPerDay = 24 * 60 * 60 * 1000;
  let currentStreakDays = 0;
  let windowEnd = new Date(today + "T00:00:00");

  while (true) {
    const windowStart = new Date(windowEnd.getTime() - 7 * msPerDay);
    let hasEntry = false;
    for (let d = new Date(windowStart); d < windowEnd; d = new Date(d.getTime() + msPerDay)) {
      if (entryDateSet.has(d.toISOString().slice(0, 10))) {
        hasEntry = true;
        break;
      }
    }
    if (hasEntry) {
      currentStreakDays += 7;
      windowEnd = windowStart;
    } else {
      break;
    }
  }

  // ── Momentum (0-100) ────────────────────────────────────────────────────
  // Recency: decays linearly from 100 (entry today) to 0 (entry 30+ days ago)
  const recencyScore = Math.max(0, 1 - daysSinceLastEntry / RECENCY_WINDOW_DAYS) * 100;

  // Velocity: features shipped in last 60 days, normalized to VELOCITY_MAX_SHIPS = 100
  const velocityCutoff = new Date(
    new Date(today + "T00:00:00").getTime() - VELOCITY_WINDOW_DAYS * msPerDay
  );
  const recentShipCount = features.filter(
    (f) =>
      f.status === "shipped" &&
      f.shippedDate &&
      new Date(f.shippedDate + "T00:00:00") >= velocityCutoff
  ).length;
  const velocityScore = Math.min(100, (recentShipCount / VELOCITY_MAX_SHIPS) * 100);

  // Active projects: projects with at least one entry in the last 30 days
  const activeProjectIds = new Set(
    entries
      .filter((e) => daysBetween(e.frontmatter.date, today) <= RECENCY_WINDOW_DAYS)
      .map((e) => e.frontmatter.project)
  );
  const totalUniqueProjects = new Set(entries.map((e) => e.frontmatter.project)).size;
  const activeProjectCount = activeProjectIds.size;
  const activeProjectScore =
    totalUniqueProjects > 0 ? (activeProjectCount / totalUniqueProjects) * 100 : 0;

  const momentum = Math.round(
    recencyScore * MOMENTUM_WEIGHTS.recency +
      velocityScore * MOMENTUM_WEIGHTS.velocity +
      activeProjectScore * MOMENTUM_WEIGHTS.activeProjects
  );

  // ── Focus score (Herfindahl index) ─────────────────────────────────────
  // HHI = sum of squared market shares. Here "market" = total entries.
  // 1.0 = all entries in one project. 1/N = perfectly even across N projects.
  const entryCountByProject = new Map<string, number>();
  for (const entry of entries) {
    const pid = entry.frontmatter.project;
    entryCountByProject.set(pid, (entryCountByProject.get(pid) ?? 0) + 1);
  }
  const hhi =
    entries.length > 0
      ? Array.from(entryCountByProject.values()).reduce((sum, count) => {
          const share = count / entries.length;
          return sum + share * share;
        }, 0)
      : 0;
  const focusScore = Math.round(hhi * 100) / 100;
  const focusLabel =
    hhi > 0.5 ? "DEEP FOCUS" : hhi > 0.3 ? "BALANCED" : hhi > 0 ? "BROAD SPREAD" : "—";

  // ── Entries by project ──────────────────────────────────────────────────
  const entriesByProject: AnalyticsData["entriesByProject"] = Array.from(
    entryCountByProject.entries()
  )
    .map(([projectId, count]) => {
      const project = projectMap.get(projectId);
      return {
        projectId,
        displayName: project?.displayName ?? projectId,
        color: project?.color ?? "var(--text-muted)",
        count,
      };
    })
    .sort((a, b) => b.count - a.count);

  // ── Features by project ─────────────────────────────────────────────────
  const featuresByProject: AnalyticsData["featuresByProject"] = projects
    .map((project) => {
      const pf = features.filter((f) => f.projectId === project.id);
      return {
        projectId: project.id,
        displayName: project.displayName,
        color: project.color,
        shipped: pf.filter((f) => f.status === "shipped").length,
        inProgress: pf.filter((f) => f.status === "in-progress").length,
        planned: pf.filter((f) => f.status === "planned").length,
        entryCount: entryCountByProject.get(project.id) ?? 0,
      };
    })
    .filter((p) => p.shipped + p.inProgress + p.planned + p.entryCount > 0);

  // ── Entries by month ────────────────────────────────────────────────────
  const monthMap = new Map<string, number>();
  for (const entry of entries) {
    const month = entry.frontmatter.date.slice(0, 7);
    monthMap.set(month, (monthMap.get(month) ?? 0) + 1);
  }
  const entriesByMonth = Array.from(monthMap.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // ── Live feeds ──────────────────────────────────────────────────────────
  const currentlyBuilding: AnalyticsData["currentlyBuilding"] = features
    .filter((f) => f.status === "in-progress")
    .map((f) => {
      const project = projectMap.get(f.projectId);
      return {
        name: f.name,
        projectId: f.projectId,
        projectName: project?.displayName ?? f.projectId,
        projectColor: project?.color ?? "var(--text-muted)",
      };
    });

  const whatsNext: AnalyticsData["whatsNext"] = features
    .filter((f) => f.status === "planned")
    .map((f) => {
      const project = projectMap.get(f.projectId);
      return {
        name: f.name,
        projectId: f.projectId,
        projectName: project?.displayName ?? f.projectId,
        projectColor: project?.color ?? "var(--text-muted)",
      };
    });

  const recentShipments: AnalyticsData["recentShipments"] = features
    .filter((f) => f.status === "shipped" && f.shippedDate)
    .sort((a, b) => (b.shippedDate! > a.shippedDate! ? 1 : -1))
    .slice(0, 8)
    .map((f) => {
      const project = projectMap.get(f.projectId);
      return {
        name: f.name,
        projectId: f.projectId,
        projectName: project?.displayName ?? f.projectId,
        projectColor: project?.color ?? "var(--accent-secondary)",
        shippedDate: f.shippedDate!,
      };
    });

  // ── Tag frequency ────────────────────────────────────────────────────────
  const tagMap = new Map<string, number>();
  for (const entry of entries) {
    for (const tag of entry.frontmatter.tags ?? []) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }
  const tagFrequency = Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);

  // ── Tech stack frequency ─────────────────────────────────────────────────
  const techMap = new Map<string, number>();
  for (const project of projects) {
    for (const tech of project.techStack ?? []) {
      techMap.set(tech, (techMap.get(tech) ?? 0) + 1);
    }
  }
  const techStackFrequency = Array.from(techMap.entries())
    .map(([tech, count]) => ({ tech, count }))
    .sort((a, b) => b.count - a.count);

  return {
    overview: {
      totalEntries: entries.length,
      totalProjects: projects.length,
      totalFeatures: features.length,
      shippedFeatures: features.filter((f) => f.status === "shipped").length,
      inProgressFeatures: features.filter((f) => f.status === "in-progress").length,
      plannedFeatures: features.filter((f) => f.status === "planned").length,
      totalWords,
      daysSinceLastEntry,
      momentum,
      momentumComponents: {
        recencyDays: daysSinceLastEntry,
        recentShipCount,
        activeProjectCount,
      },
    },
    cadence: {
      avgDaysBetweenEntries,
      longestGapDays,
      currentStreakDays,
      firstEntryDate,
    },
    focusScore,
    focusLabel,
    entriesByProject,
    featuresByProject,
    entriesByMonth,
    entryDates: sortedDates,
    currentlyBuilding,
    whatsNext,
    recentShipments,
    tagFrequency,
    techStackFrequency,
    wordCountByEntry,
  };
}
