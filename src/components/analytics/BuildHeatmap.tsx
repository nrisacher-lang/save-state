// Cell size + gap = effective column width
const CELL_PX = 10;
const GAP_PX = 2;
const COL_WIDTH = CELL_PX + GAP_PX; // 12px per week column
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

interface Day {
  date: string;
  hasEntry: boolean;
  isFuture: boolean;
}

function generateGrid(weeksToShow: number, entrySet: Set<string>): Day[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Walk back N weeks, then snap to the preceding Sunday
  const start = new Date(today);
  start.setDate(today.getDate() - weeksToShow * 7);
  start.setDate(start.getDate() - start.getDay());

  const weeks: Day[][] = [];
  const cursor = new Date(start);

  for (let w = 0; w < weeksToShow; w++) {
    const week: Day[] = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = cursor.toISOString().slice(0, 10);
      week.push({
        date: dateStr,
        hasEntry: entrySet.has(dateStr),
        isFuture: cursor.getTime() > today.getTime(),
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

function getMonthLabels(weeks: Day[][]): { weekIndex: number; label: string }[] {
  const labels: { weekIndex: number; label: string }[] = [];
  let lastMonth = "";

  weeks.forEach((week, i) => {
    const month = new Date(week[0].date + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
    });
    if (month !== lastMonth) {
      labels.push({ weekIndex: i, label: month.toUpperCase() });
      lastMonth = month;
    }
  });

  return labels;
}

function HeatmapGrid({ weeks, className = "" }: { weeks: Day[][]; className?: string }) {
  const monthLabels = getMonthLabels(weeks);
  const allDays = weeks.flatMap((week) => week);
  const gridWidth = weeks.length * COL_WIDTH - GAP_PX;
  const totalCount = allDays.filter((d) => d.hasEntry).length;
  const firstEntry = allDays.find((d) => d.hasEntry);
  const lastEntry = [...allDays].reverse().find((d) => d.hasEntry);

  return (
    <div className={className}>
      {/* Screen reader summary */}
      <p className="sr-only">
        Build activity heatmap: {totalCount} entries logged
        {firstEntry && lastEntry
          ? ` between ${firstEntry.date} and ${lastEntry.date}`
          : totalCount === 0
            ? " — no entries yet"
            : ""}
        .
      </p>

      {/* Outer container: month labels + grid side by side with day labels */}
      <div className="flex gap-1.5">
        {/* Day-of-week labels */}
        <div
          className="flex flex-col shrink-0"
          aria-hidden="true"
          style={{ gap: GAP_PX, marginTop: 18 }}
        >
          {DAY_LABELS.map((label, i) => (
            <div
              key={i}
              style={{
                height: CELL_PX,
                width: 10,
                fontFamily: "var(--font-share-tech), monospace",
                fontSize: 8,
                color: "var(--text-muted)",
                lineHeight: `${CELL_PX}px`,
                textAlign: "right",
              }}
            >
              {i % 2 === 0 ? label : ""}
            </div>
          ))}
        </div>

        {/* Heatmap: month labels above, grid below */}
        <div style={{ position: "relative", width: gridWidth }}>
          {/* Month labels */}
          <div aria-hidden="true" style={{ position: "relative", height: 16, marginBottom: 2 }}>
            {monthLabels.map(({ weekIndex, label }) => (
              <span
                key={`${weekIndex}-${label}`}
                style={{
                  position: "absolute",
                  left: weekIndex * COL_WIDTH,
                  fontFamily: "var(--font-share-tech), monospace",
                  fontSize: 9,
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Cell grid — grid-auto-flow: column fills week by week */}
          <div
            role="img"
            aria-hidden="true"
            style={{
              display: "grid",
              gridTemplateRows: `repeat(7, ${CELL_PX}px)`,
              gridAutoFlow: "column",
              gap: GAP_PX,
            }}
          >
            {allDays.map((day) => (
              <div
                key={day.date}
                title={day.isFuture ? "" : day.hasEntry ? `${day.date} — entry logged` : day.date}
                style={{
                  width: CELL_PX,
                  height: CELL_PX,
                  borderRadius: 2,
                  background: day.isFuture
                    ? "transparent"
                    : day.hasEntry
                      ? "var(--accent-secondary)"
                      : "var(--bg-elevated)",
                  // Non-color encoding: entry cells get a slightly brighter border
                  border: day.hasEntry
                    ? "1px solid var(--accent-secondary)"
                    : day.isFuture
                      ? "none"
                      : "1px solid var(--border)",
                  opacity: day.isFuture ? 0 : 1,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {totalCount === 0 && (
        <p
          className="mt-3 text-xs"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "var(--text-muted)",
          }}
        >
          No entries logged yet.
        </p>
      )}
    </div>
  );
}

interface BuildHeatmapProps {
  entryDates: string[];
}

export default function BuildHeatmap({ entryDates }: BuildHeatmapProps) {
  const entrySet = new Set(entryDates);
  const fullYear = generateGrid(52, entrySet);
  const quarter = generateGrid(13, entrySet);

  return (
    <>
      {/* Full year — desktop only */}
      <HeatmapGrid weeks={fullYear} className="hidden md:block overflow-x-auto" />
      {/* Quarter view — mobile only */}
      <HeatmapGrid weeks={quarter} className="block md:hidden overflow-x-auto" />
    </>
  );
}
