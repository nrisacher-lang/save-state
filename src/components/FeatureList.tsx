import type { Feature } from "@/lib/types";

interface FeatureListProps {
  shipped: Feature[];
  inProgress: Feature[];
  planned: Feature[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();
}

function FeatureGroup({
  label,
  features,
  icon,
  color,
}: {
  label: string;
  features: Feature[];
  icon: string;
  color: string;
}) {
  if (features.length === 0) return null;

  return (
    <div className="mb-6">
      <p
        className="text-xs tracking-widest mb-3"
        style={{
          fontFamily: "var(--font-share-tech), monospace",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </p>
      <ul className="space-y-3">
        {features.map((feature) => (
          <li key={feature.id} className="flex items-start gap-3">
            <span
              className="shrink-0 mt-0.5 text-sm"
              style={{ color, fontFamily: "var(--font-jetbrains), monospace" }}
            >
              {icon}
            </span>
            <div className="flex-1 min-w-0">
              <span
                className="text-sm"
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  color: "var(--text-primary)",
                }}
              >
                {feature.name}
              </span>
              {feature.description && (
                <p
                  className="text-xs mt-0.5"
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    color: "var(--text-secondary)",
                  }}
                >
                  {feature.description}
                </p>
              )}
            </div>
            {feature.shippedDate && (
              <span
                className="text-xs shrink-0"
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  color: "var(--text-muted)",
                }}
              >
                {formatDate(feature.shippedDate)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FeatureList({ shipped, inProgress, planned }: FeatureListProps) {
  return (
    <div className="max-w-prose">
      <FeatureGroup label="SHIPPED" features={shipped} icon="✓" color="var(--accent-secondary)" />
      <FeatureGroup label="IN PROGRESS" features={inProgress} icon="◎" color="var(--accent)" />
      <FeatureGroup label="PLANNED" features={planned} icon="○" color="var(--text-muted)" />
    </div>
  );
}
