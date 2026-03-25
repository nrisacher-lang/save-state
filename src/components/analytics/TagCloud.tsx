interface TagCloudProps {
  tagFrequency: { tag: string; count: number }[];
}

export default function TagCloud({ tagFrequency }: TagCloudProps) {
  if (tagFrequency.length === 0) {
    return (
      <p
        className="text-xs"
        style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "var(--text-muted)" }}
      >
        No tags yet.
      </p>
    );
  }

  const max = tagFrequency[0].count; // already sorted descending

  return (
    <div className="flex flex-wrap gap-2" role="list" aria-label="Tag frequency cloud">
      {tagFrequency.map(({ tag, count }) => {
        const isHigh = count === max;
        const isMid = count >= max * 0.5 && count < max;

        return (
          <span
            key={tag}
            role="listitem"
            title={`${count} ${count === 1 ? "entry" : "entries"}`}
            className="px-2 py-0.5 rounded-full tracking-widest"
            style={{
              fontFamily: "var(--font-share-tech), monospace",
              fontSize: isHigh ? 13 : isMid ? 11 : 10,
              color: isHigh
                ? "var(--accent)"
                : isMid
                  ? "var(--text-secondary)"
                  : "var(--text-muted)",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
            }}
          >
            {tag.toUpperCase()}
            {/* Count as visually-hidden text for screen readers */}
            <span className="sr-only"> ({count})</span>
          </span>
        );
      })}
    </div>
  );
}
