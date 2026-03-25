"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/changelog", label: "LOG" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/analytics", label: "ANALYTICS" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      className="electric-line w-full px-6 md:px-10 lg:px-16 py-4"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs tracking-widest"
          style={{
            fontFamily: "var(--font-share-tech), monospace",
            color: "var(--accent)",
          }}
        >
          UNDERSTORY LABS
        </span>
        <div className="flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className="text-xs tracking-widest transition-colors"
                style={{
                  fontFamily: "var(--font-share-tech), monospace",
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
