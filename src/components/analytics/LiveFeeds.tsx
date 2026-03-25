interface FeedItem {
  name: string;
  projectName: string;
  projectColor: string;
  date?: string; // only for recent shipments
}

interface FeedSectionProps {
  heading: string;
  icon: string;
  items: FeedItem[];
  emptyMessage: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

function FeedSection({ heading, icon, items, emptyMessage }: FeedSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <p
        className="text-xs tracking-widest"
        style={{
          fontFamily: "var(--font-share-tech), monospace",
          color: "var(--text-muted)",
        }}
      >
        {icon} {heading}
      </p>

      {items.length === 0 ? (
        <p
          className="text-xs"
          style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "var(--text-muted)" }}
        >
          {emptyMessage}
        </p>
      ) : (
        <ul className="space-y-3" aria-label={heading}>
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 min-w-0">
              {/* Project color badge */}
              <span
                className="text-xs tracking-widest shrink-0 px-1.5 py-0.5 rounded-sm leading-tight"
                style={{
                  fontFamily: "var(--font-share-tech), monospace",
                  color: item.projectColor,
                  background: "var(--bg-elevated)",
                  border: `1px solid ${item.projectColor}`,
                  opacity: 0.9,
                }}
              >
                {item.projectName.toUpperCase()}
              </span>

              <div className="flex-1 min-w-0">
                <span
                  className="text-sm leading-snug block truncate"
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    color: "var(--text-primary)",
                  }}
                >
                  {item.name}
                </span>
                {item.date && (
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      color: "var(--text-muted)",
                    }}
                  >
                    {formatDate(item.date)}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Exported components ──────────────────────────────────────────────────────

interface CurrentlyBuildingProps {
  items: { name: string; projectId: string; projectName: string; projectColor: string }[];
}

export function CurrentlyBuilding({ items }: CurrentlyBuildingProps) {
  return (
    <FeedSection
      heading="CURRENTLY BUILDING"
      icon="◎"
      items={items}
      emptyMessage="Nothing in progress right now."
    />
  );
}

interface WhatsNextProps {
  items: { name: string; projectId: string; projectName: string; projectColor: string }[];
}

export function WhatsNext({ items }: WhatsNextProps) {
  return (
    <FeedSection heading="WHAT'S NEXT" icon="○" items={items} emptyMessage="Nothing planned yet." />
  );
}

interface RecentShipmentsProps {
  items: {
    name: string;
    projectId: string;
    projectName: string;
    projectColor: string;
    shippedDate: string;
  }[];
}

export function RecentShipments({ items }: RecentShipmentsProps) {
  return (
    <FeedSection
      heading="RECENTLY SHIPPED"
      icon="✓"
      items={items.map((item) => ({ ...item, date: item.shippedDate }))}
      emptyMessage="No shipped features yet."
    />
  );
}
