interface ProjectRow {
  projectId: string;
  displayName: string;
  color: string;
  count: number;
}

interface ProjectBreakdownProps {
  entriesByProject: ProjectRow[];
}

export default function ProjectBreakdown({ entriesByProject }: ProjectBreakdownProps) {
  if (entriesByProject.length === 0) {
    return (
      <p
        className="text-xs"
        style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "var(--text-muted)" }}
      >
        No entries yet.
      </p>
    );
  }

  const max = Math.max(...entriesByProject.map((p) => p.count));

  return (
    <div className="space-y-3 max-w-prose" role="img" aria-label="Entry distribution by project">
      {/* Screen reader summary */}
      <p className="sr-only">
        {entriesByProject.map((p) => `${p.displayName}: ${p.count} entries`).join(", ")}.
      </p>

      {entriesByProject.map((project) => {
        const width = max > 0 ? Math.max((project.count / max) * 100, 4) : 4;
        return (
          <div key={project.projectId} className="flex items-center gap-3">
            <span
              className="text-xs tracking-widest shrink-0 w-24"
              style={{
                fontFamily: "var(--font-share-tech), monospace",
                color: "var(--text-muted)",
              }}
            >
              {project.displayName.toUpperCase()}
            </span>
            <div className="flex-1 flex items-center gap-2">
              <div
                aria-hidden="true"
                style={{
                  width: `${width}%`,
                  height: 10,
                  background: project.color,
                  borderRadius: 2,
                  transition: "width 0.3s ease",
                }}
              />
              <span
                className="text-xs shrink-0"
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  color: "var(--text-muted)",
                }}
              >
                {project.count} {project.count === 1 ? "entry" : "entries"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
