import Link from "next/link";
import type { Entry } from "@/lib/types";
import { PROJECT_NAMES, PROJECT_COLORS } from "@/lib/config";

interface RecentActivityProps {
  entries: Entry[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

export default function RecentActivity({ entries }: RecentActivityProps) {
  return (
    <div>
      <ul className="mb-6">
        {entries.map((entry) => (
          <li
            key={entry.slug}
            className="flex items-baseline gap-3 py-2.5"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span
              className="text-xs shrink-0 w-14"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                color: "var(--text-muted)",
              }}
            >
              {formatDate(entry.frontmatter.date)}
            </span>
            <span
              className="text-xs tracking-widest shrink-0 w-24"
              style={{
                fontFamily: "var(--font-share-tech), monospace",
                color: PROJECT_COLORS[entry.frontmatter.project] ?? "var(--text-muted)",
              }}
            >
              {(
                PROJECT_NAMES[entry.frontmatter.project] ?? entry.frontmatter.project
              ).toUpperCase()}
            </span>
            <span
              className="text-sm truncate"
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                color: "var(--text-primary)",
              }}
            >
              {entry.frontmatter.session}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="/changelog"
        className="text-xs tracking-widest"
        style={{
          fontFamily: "var(--font-share-tech), monospace",
          color: "var(--accent-secondary)",
        }}
      >
        VIEW FULL LOG →
      </Link>
    </div>
  );
}
