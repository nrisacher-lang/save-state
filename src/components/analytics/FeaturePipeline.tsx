interface ProjectFeatureRow {
  projectId: string;
  displayName: string;
  color: string;
  shipped: number;
  inProgress: number;
  planned: number;
}

interface FeaturePipelineProps {
  shipped: number;
  inProgress: number;
  planned: number;
  byProject: ProjectFeatureRow[];
}

interface SegmentProps {
  count: number;
  total: number;
  color: string;
  label: string;
}

function PipelineSegment({ count, total, color, label }: SegmentProps) {
  if (count === 0) return null;
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div
      className="flex items-center gap-2 shrink-0"
      style={{ width: `${Math.max(pct, 8)}%` }}
      title={`${label}: ${count}`}
    >
      <div className="h-5 w-full rounded-sm" style={{ background: color }} aria-hidden="true" />
    </div>
  );
}

export default function FeaturePipeline({
  shipped,
  inProgress,
  planned,
  byProject,
}: FeaturePipelineProps) {
  const total = shipped + inProgress + planned;

  if (total === 0) {
    return (
      <p
        className="text-sm"
        style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "var(--text-muted)" }}
      >
        No features tracked yet.
      </p>
    );
  }

  return (
    <div>
      {/* Main stacked bar */}
      <div
        className="flex gap-1 h-5 w-full mb-3"
        role="img"
        aria-label={`Feature pipeline: ${shipped} shipped, ${inProgress} in progress, ${planned} planned`}
      >
        <PipelineSegment
          count={shipped}
          total={total}
          color="var(--accent-secondary)"
          label="Shipped"
        />
        <PipelineSegment
          count={inProgress}
          total={total}
          color="var(--accent)"
          label="In Progress"
        />
        <PipelineSegment count={planned} total={total} color="var(--text-muted)" label="Planned" />
      </div>

      {/* Text legend — color is not the only encoding */}
      <div className="flex flex-wrap gap-4 mb-6">
        {shipped > 0 && (
          <span
            className="text-xs tracking-widest"
            style={{
              fontFamily: "var(--font-share-tech), monospace",
              color: "var(--accent-secondary)",
            }}
          >
            ✓ {shipped} SHIPPED
          </span>
        )}
        {inProgress > 0 && (
          <span
            className="text-xs tracking-widest"
            style={{ fontFamily: "var(--font-share-tech), monospace", color: "var(--accent)" }}
          >
            ◎ {inProgress} IN PROGRESS
          </span>
        )}
        {planned > 0 && (
          <span
            className="text-xs tracking-widest"
            style={{
              fontFamily: "var(--font-share-tech), monospace",
              color: "var(--text-muted)",
            }}
          >
            ○ {planned} PLANNED
          </span>
        )}
      </div>

      {/* Per-project breakdown */}
      {byProject.length > 0 && (
        <div className="space-y-3">
          {byProject.map((p) => {
            const projectTotal = p.shipped + p.inProgress + p.planned;
            if (projectTotal === 0) return null;
            return (
              <div key={p.projectId}>
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className="text-xs tracking-widest w-28 shrink-0"
                    style={{
                      fontFamily: "var(--font-share-tech), monospace",
                      color: "var(--text-muted)",
                    }}
                  >
                    {p.displayName.toUpperCase()}
                  </span>
                  <div className="flex gap-0.5 h-3 flex-1" aria-hidden="true">
                    {p.shipped > 0 && (
                      <div
                        className="rounded-sm"
                        style={{
                          width: `${(p.shipped / projectTotal) * 100}%`,
                          background: "var(--accent-secondary)",
                        }}
                      />
                    )}
                    {p.inProgress > 0 && (
                      <div
                        className="rounded-sm"
                        style={{
                          width: `${(p.inProgress / projectTotal) * 100}%`,
                          background: "var(--accent)",
                        }}
                      />
                    )}
                    {p.planned > 0 && (
                      <div
                        className="rounded-sm"
                        style={{
                          width: `${(p.planned / projectTotal) * 100}%`,
                          background: "var(--bg-elevated)",
                          border: "1px solid var(--border)",
                        }}
                      />
                    )}
                  </div>
                  <span
                    className="text-xs shrink-0"
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      color: "var(--text-muted)",
                    }}
                  >
                    {p.shipped}·{p.inProgress}·{p.planned}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
