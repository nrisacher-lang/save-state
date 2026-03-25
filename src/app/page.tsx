export const dynamic = "force-dynamic";

import { getAllProjects } from "@/lib/projects";
import { getAllEntries } from "@/lib/entries";
import HeroSection from "@/components/HeroSection";
import ProjectGrid from "@/components/ProjectGrid";
import RecentActivity from "@/components/RecentActivity";

export default async function HomePage() {
  const [projects, entries] = await Promise.all([getAllProjects(), getAllEntries()]);

  // Build entry stats per project — entries are sorted newest-first, so the first
  // entry encountered for each project is already the most recent.
  const statsMap = new Map<string, { entryCount: number; lastActive: string }>();
  for (const entry of entries) {
    const pid = entry.frontmatter.project;
    const existing = statsMap.get(pid);
    if (!existing) {
      statsMap.set(pid, { entryCount: 1, lastActive: entry.frontmatter.date });
    } else {
      existing.entryCount++;
    }
  }

  const projectsWithStats = projects.map((p) => ({
    ...p,
    entryCount: statsMap.get(p.id)?.entryCount ?? 0,
    lastActive: statsMap.get(p.id)?.lastActive ?? null,
  }));

  const activeProjects = projects.filter((p) => p.status === "active");
  const recentEntries = entries.slice(0, 5);

  return (
    <main className="w-full px-6 md:px-10 lg:px-16 py-12 flex-1">
      <HeroSection projectCount={activeProjects.length} entryCount={entries.length} />

      <section className="mb-12">
        <h2
          className="glow-line text-xs tracking-widest mb-8"
          style={{
            fontFamily: "var(--font-share-tech), monospace",
            color: "var(--text-secondary)",
          }}
        >
          PROJECTS
        </h2>
        <ProjectGrid projects={projectsWithStats} />
      </section>

      {recentEntries.length > 0 && (
        <section>
          <h2
            className="glow-line text-xs tracking-widest mb-8"
            style={{
              fontFamily: "var(--font-share-tech), monospace",
              color: "var(--text-secondary)",
            }}
          >
            RECENT ACTIVITY
          </h2>
          <div className="max-w-prose">
            <RecentActivity entries={recentEntries} />
          </div>
        </section>
      )}
    </main>
  );
}
