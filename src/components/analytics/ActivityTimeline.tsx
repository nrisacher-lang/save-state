interface ActivityTimelineProps {
  entriesByMonth: { month: string; count: number }[];
}

function formatMonth(month: string): string {
  // month is "YYYY-MM"
  const [year, m] = month.split("-");
  const date = new Date(Number(year), Number(m) - 1, 1);
  return date
    .toLocaleDateString("en-US", { month: "short", year: "2-digit" })
    .toUpperCase()
    .replace(" ", " '");
}

export default function ActivityTimeline({ entriesByMonth }: ActivityTimelineProps) {
  if (entriesByMonth.length === 0) {
    return (
      <p
        className="text-xs"
        style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "var(--text-muted)" }}
      >
        No entries logged yet.
      </p>
    );
  }

  const maxCount = Math.max(...entriesByMonth.map((m) => m.count));

  return (
    <div
      className="space-y-2 max-w-prose"
      role="img"
      aria-label={`Activity timeline: ${entriesByMonth.length} months with entries`}
    >
      {/* Screen reader summary */}
      <p className="sr-only">
        Monthly activity:{" "}
        {entriesByMonth.map((m) => `${formatMonth(m.month)}: ${m.count} entries`).join(", ")}.
      </p>

      {entriesByMonth.map(({ month, count }) => {
        const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
        // Minimum 6% so a 1-entry month still renders a visible bar
        const width = Math.max(pct, 6);

        return (
          <div key={month} className="flex items-center gap-3">
            <span
              className="text-xs tracking-widest shrink-0 w-14"
              style={{
                fontFamily: "var(--font-share-tech), monospace",
                color: "var(--text-muted)",
              }}
            >
              {formatMonth(month)}
            </span>
            <div className="flex-1 flex items-center gap-2">
              <div
                style={{
                  width: `${width}%`,
                  height: 12,
                  background: "var(--accent-secondary)",
                  borderRadius: 2,
                  transition: "width 0.3s ease",
                  // prefers-reduced-motion handled in globals.css
                }}
                aria-hidden="true"
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
