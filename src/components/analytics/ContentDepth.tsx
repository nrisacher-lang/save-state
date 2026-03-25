interface EntryWordCount {
  slug: string;
  session: string;
  project: string;
  words: number;
}

interface ContentDepthProps {
  totalWords: number;
  wordCountByEntry: EntryWordCount[];
}

export default function ContentDepth({ totalWords, wordCountByEntry }: ContentDepthProps) {
  if (wordCountByEntry.length === 0) return null;

  const avgWords = Math.round(totalWords / wordCountByEntry.length);
  const longest = [...wordCountByEntry].sort((a, b) => b.words - a.words)[0];
  const maxWords = longest.words;

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="flex flex-wrap gap-8">
        <div className="flex flex-col gap-0.5">
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-jetbrains), monospace", color: "var(--text-primary)" }}
          >
            {totalWords.toLocaleString()}
          </span>
          <span
            className="text-xs tracking-widest"
            style={{ fontFamily: "var(--font-share-tech), monospace", color: "var(--text-muted)" }}
          >
            TOTAL WORDS
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-jetbrains), monospace", color: "var(--text-primary)" }}
          >
            {avgWords.toLocaleString()}
          </span>
          <span
            className="text-xs tracking-widest"
            style={{ fontFamily: "var(--font-share-tech), monospace", color: "var(--text-muted)" }}
          >
            AVG PER ENTRY
          </span>
        </div>
      </div>

      {/* Longest entry callout */}
      <div>
        <p
          className="text-xs tracking-widest mb-1"
          style={{ fontFamily: "var(--font-share-tech), monospace", color: "var(--text-muted)" }}
        >
          LONGEST ENTRY
        </p>
        <p
          className="text-sm"
          style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "var(--text-secondary)" }}
        >
          {longest.session}{" "}
          <span
            style={{ fontFamily: "var(--font-jetbrains), monospace", color: "var(--text-muted)" }}
          >
            · {longest.words.toLocaleString()} words
          </span>
        </p>
      </div>

      {/* Per-entry word count bars */}
      <div className="space-y-2 max-w-prose" role="img" aria-label="Word count per entry">
        <p className="sr-only">
          {wordCountByEntry.map((e) => `${e.session}: ${e.words} words`).join(", ")}.
        </p>
        {wordCountByEntry.map((entry) => {
          const width = maxWords > 0 ? Math.max((entry.words / maxWords) * 100, 3) : 3;
          return (
            <div key={entry.slug} className="flex items-center gap-3">
              <span
                className="text-xs shrink-0 w-32 truncate"
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  color: "var(--text-muted)",
                }}
                title={entry.session}
              >
                {entry.session}
              </span>
              <div className="flex-1 flex items-center gap-2">
                <div
                  aria-hidden="true"
                  style={{
                    width: `${width}%`,
                    height: 6,
                    background: "var(--accent-secondary)",
                    borderRadius: 2,
                    opacity: 0.6,
                  }}
                />
                <span
                  className="text-xs shrink-0"
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    color: "var(--text-muted)",
                  }}
                >
                  {entry.words}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
