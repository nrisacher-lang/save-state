import Card from "./Card";
import type { Entry } from "@/lib/types";
import { PROJECT_NAMES } from "@/lib/config";

interface EntryCardProps {
  entry: Entry;
  animationDelay?: number;
}

export default function EntryCard({ entry, animationDelay = 0 }: EntryCardProps) {
  const { frontmatter, content } = entry;
  const projectDisplayName = PROJECT_NAMES[frontmatter.project] ?? frontmatter.project;

  return (
    <div className="animate-entry" style={{ animationDelay: `${animationDelay}ms` }}>
      <Card projectId={frontmatter.project}>
        {/* Project badge + session title */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              fontFamily: "var(--font-share-tech), monospace",
              letterSpacing: "0.06em",
              background: "var(--bg-elevated)",
              color: `var(--project-${frontmatter.project})`,
              border: `1px solid var(--project-${frontmatter.project})`,
            }}
          >
            {projectDisplayName.toUpperCase()}
          </span>
          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                fontFamily: "var(--font-share-tech), monospace",
                letterSpacing: "0.04em",
                background: "var(--bg-elevated)",
                color: "var(--text-muted)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <h2
          className="text-base mb-3"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "var(--text-primary)",
            fontWeight: 500,
          }}
        >
          {frontmatter.session}
        </h2>

        {/* Rendered markdown */}
        <div className="entry-content" dangerouslySetInnerHTML={{ __html: content }} />
      </Card>
    </div>
  );
}
