import Link from "next/link";
import Card from "./Card";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project & { entryCount: number; lastActive: string | null };
}

function formatLastActive(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();
}

const STATUS_LABELS: Record<Project["status"], string> = {
  active: "ACTIVE",
  planned: "PLANNED",
  archived: "ARCHIVED",
};

const STATUS_COLORS: Record<Project["status"], string> = {
  active: "var(--accent-secondary)",
  planned: "var(--accent)",
  archived: "var(--text-muted)",
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="block group h-full">
      <Card projectId={project.id} className="card-spark-shell flex flex-col h-full">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {project.icon && <span className="text-base leading-none">{project.icon}</span>}
            <span
              className="text-base font-bold leading-tight"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                color: "var(--text-primary)",
              }}
            >
              {project.displayName}
            </span>
          </div>
          <span
            className="text-xs tracking-widest shrink-0 pt-0.5"
            style={{
              fontFamily: "var(--font-share-tech), monospace",
              color: STATUS_COLORS[project.status],
            }}
          >
            {STATUS_LABELS[project.status]}
          </span>
        </div>

        {/* Tagline */}
        <p
          className="text-sm mb-4 leading-relaxed"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "var(--text-secondary)",
          }}
        >
          {project.tagline}
        </p>

        {/* Tech stack pills */}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  fontFamily: "var(--font-share-tech), monospace",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Footer stats */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          <span
            className="text-xs tracking-widest"
            style={{
              fontFamily: "var(--font-share-tech), monospace",
              color: "var(--text-muted)",
            }}
          >
            {project.entryCount > 0
              ? `${project.entryCount} ${project.entryCount === 1 ? "ENTRY" : "ENTRIES"}${project.lastActive ? ` · ${formatLastActive(project.lastActive)}` : ""}`
              : "NO ENTRIES YET"}
          </span>
          <span
            className="text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            style={{
              fontFamily: "var(--font-share-tech), monospace",
              color: "var(--accent)",
            }}
          >
            VIEW →
          </span>
        </div>
      </Card>
    </Link>
  );
}
