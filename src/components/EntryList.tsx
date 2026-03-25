"use client";

import { useState } from "react";
import type { Entry, ProjectSummary } from "@/lib/types";
import ProjectFilter from "./ProjectFilter";
import EntryCard from "./EntryCard";

interface EntryListProps {
  entries: Entry[];
  projects: ProjectSummary[];
}

function formatDateLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function EntryList({ entries, projects }: EntryListProps) {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const projectNames = Object.fromEntries(projects.map((p) => [p.id, p.displayName]));

  const filtered =
    activeProject === null
      ? entries
      : entries.filter((e) => e.frontmatter.project === activeProject);

  // Group by date
  const grouped = filtered.reduce<Record<string, Entry[]>>((acc, entry) => {
    const date = entry.frontmatter.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => (a > b ? -1 : 1));

  return (
    <>
      <ProjectFilter
        projects={projects}
        activeProject={activeProject}
        onSelect={setActiveProject}
        filteredCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <p
          className="text-sm"
          style={{
            fontFamily: "var(--font-share-tech), monospace",
            color: "var(--text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          NO ENTRIES
        </p>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((date) => (
            <div key={date}>
              <div
                className="text-xs tracking-widest uppercase mb-3"
                style={{
                  fontFamily: "var(--font-share-tech), monospace",
                  color: "var(--text-muted)",
                }}
              >
                {formatDateLabel(date)}
              </div>
              <div className="space-y-3">
                {grouped[date].map((entry) => (
                  <EntryCard
                    key={entry.slug}
                    entry={entry}
                    animationDelay={filtered.indexOf(entry) * 80}
                    projectDisplayName={projectNames[entry.frontmatter.project]}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
