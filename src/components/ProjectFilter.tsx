"use client";

import type { ProjectSummary } from "@/lib/types";

interface ProjectFilterProps {
  projects: ProjectSummary[];
  activeProject: string | null;
  onSelect: (projectId: string | null) => void;
  filteredCount: number;
}

export default function ProjectFilter({
  projects,
  activeProject,
  onSelect,
  filteredCount,
}: ProjectFilterProps) {
  return (
    <div className="mb-8">
      <div className="flex gap-2 flex-wrap mb-3">
        <button
          onClick={() => onSelect(null)}
          className="px-3 py-1 rounded-full text-xs border transition-colors duration-150 cursor-pointer"
          style={{
            fontFamily: "var(--font-share-tech), monospace",
            letterSpacing: "0.06em",
            background: activeProject === null ? "var(--accent)" : "transparent",
            color: activeProject === null ? "var(--bg-base)" : "var(--text-muted)",
            borderColor: activeProject === null ? "var(--accent)" : "var(--border)",
          }}
        >
          ALL
        </button>
        {projects.map((project) => {
          const isActive = activeProject === project.id;
          return (
            <button
              key={project.id}
              onClick={() => onSelect(project.id)}
              className="px-3 py-1 rounded-full text-xs border transition-colors duration-150 cursor-pointer"
              style={{
                fontFamily: "var(--font-share-tech), monospace",
                letterSpacing: "0.06em",
                background: isActive ? `var(--project-${project.id})` : "transparent",
                color: isActive ? "var(--bg-base)" : "var(--text-muted)",
                borderColor: isActive ? `var(--project-${project.id})` : "var(--border)",
              }}
            >
              {project.displayName.toUpperCase()}
            </button>
          );
        })}
      </div>
      {activeProject !== null && (
        <p
          className="text-xs"
          style={{
            fontFamily: "var(--font-share-tech), monospace",
            color: "var(--text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          {filteredCount} {filteredCount === 1 ? "ENTRY" : "ENTRIES"}
        </p>
      )}
    </div>
  );
}
