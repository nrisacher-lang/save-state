interface TechStackChartProps {
  techStackFrequency: { tech: string; count: number }[];
}

export default function TechStackChart({ techStackFrequency }: TechStackChartProps) {
  if (techStackFrequency.length === 0) {
    return (
      <p
        className="text-xs"
        style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "var(--text-muted)" }}
      >
        No tech stack data yet.
      </p>
    );
  }

  const max = techStackFrequency[0].count; // already sorted descending

  return (
    <div className="space-y-2 max-w-prose" role="img" aria-label="Tech stack usage across projects">
      <p className="sr-only">
        {techStackFrequency
          .map((t) => `${t.tech}: ${t.count} project${t.count !== 1 ? "s" : ""}`)
          .join(", ")}
        .
      </p>

      {techStackFrequency.map(({ tech, count }) => {
        const width = Math.max((count / max) * 100, 6);
        return (
          <div key={tech} className="flex items-center gap-3">
            <span
              className="text-xs tracking-widest shrink-0 w-28"
              style={{
                fontFamily: "var(--font-share-tech), monospace",
                color: "var(--text-muted)",
              }}
            >
              {tech.toUpperCase()}
            </span>
            <div className="flex-1 flex items-center gap-2">
              <div
                aria-hidden="true"
                style={{
                  width: `${width}%`,
                  height: 8,
                  background: "var(--accent)",
                  borderRadius: 2,
                  opacity: 0.7,
                }}
              />
              <span
                className="text-xs shrink-0"
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  color: "var(--text-muted)",
                }}
              >
                {count}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
