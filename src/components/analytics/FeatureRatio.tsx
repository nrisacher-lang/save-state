interface ProjectRow {
  projectId: string;
  displayName: string;
  color: string;
  shipped: number;
  inProgress: number;
  planned: number;
  entryCount: number;
}

interface FeatureRatioProps {
  featuresByProject: ProjectRow[];
}

export default function FeatureRatio({ featuresByProject }: FeatureRatioProps) {
  if (featuresByProject.length === 0) return null;

  return (
    <div className="space-y-4 max-w-prose" aria-label="Features vs entries by project">
      {featuresByProject.map((p) => {
        const totalFeatures = p.shipped + p.inProgress + p.planned;
        const maxVal = Math.max(totalFeatures, p.entryCount, 1);

        return (
          <div key={p.projectId}>
            <p
              className="text-xs tracking-widest mb-2"
              style={{
                fontFamily: "var(--font-share-tech), monospace",
                color: "var(--text-muted)",
              }}
            >
              {p.displayName.toUpperCase()}
            </p>

            {/* Features bar */}
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs w-16 shrink-0"
                style={{
                  fontFamily: "var(--font-share-tech), monospace",
                  color: "var(--text-muted)",
                }}
              >
                FEATURES
              </span>
              <div
                aria-hidden="true"
                style={{
                  width: `${Math.max((totalFeatures / maxVal) * 60, 4)}%`,
                  height: 8,
                  background: p.color,
                  borderRadius: 2,
                }}
              />
              <span
                className="text-xs shrink-0"
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  color: "var(--text-muted)",
                }}
              >
                {totalFeatures}
              </span>
            </div>

            {/* Entries bar */}
            <div className="flex items-center gap-2">
              <span
                className="text-xs w-16 shrink-0"
                style={{
                  fontFamily: "var(--font-share-tech), monospace",
                  color: "var(--text-muted)",
                }}
              >
                ENTRIES
              </span>
              <div
                aria-hidden="true"
                style={{
                  width: `${Math.max((p.entryCount / maxVal) * 60, p.entryCount > 0 ? 4 : 0)}%`,
                  height: 8,
                  background: "var(--text-muted)",
                  borderRadius: 2,
                  opacity: 0.4,
                }}
              />
              <span
                className="text-xs shrink-0"
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  color: "var(--text-muted)",
                }}
              >
                {p.entryCount}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
