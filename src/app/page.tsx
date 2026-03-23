import Card from "@/components/Card";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto w-full px-6 py-12">
      {/* Header */}
      <header className="mb-10">
        <div
          className="text-xs tracking-widest uppercase mb-2"
          style={{
            fontFamily: "var(--font-share-tech), monospace",
            color: "var(--text-muted)",
          }}
        >
          Understory Labs
        </div>
        <h1
          className="text-3xl font-bold mb-2"
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            color: "var(--text-primary)",
          }}
        >
          Save State
        </h1>
        <p
          className="text-xs tracking-widest"
          style={{
            fontFamily: "var(--font-share-tech), monospace",
            color: "var(--text-secondary)",
          }}
        >
          0 ENTRIES
        </p>
        <div
          className="mt-6"
          style={{
            height: "1px",
            background: `linear-gradient(to right, var(--accent-glow), var(--accent), var(--accent-glow), transparent)`,
          }}
        />
      </header>

      {/* Filter buttons placeholder */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {[
          { label: "ALL", active: true },
          { label: "CURRENT OS", active: false },
          { label: "BARK", active: false },
          { label: "SAVE STATE", active: false },
        ].map(({ label, active }) => (
          <button
            key={label}
            className="px-3 py-1 rounded-full text-xs border transition-colors duration-150 cursor-pointer"
            style={{
              fontFamily: "var(--font-share-tech), monospace",
              letterSpacing: "0.06em",
              background: active ? "var(--accent)" : "transparent",
              color: active ? "var(--bg-base)" : "var(--text-muted)",
              borderColor: active ? "var(--accent)" : "var(--border)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sample entry — replaced in Step 3 */}
      <div className="space-y-3">
        <div
          className="text-xs tracking-widest uppercase"
          style={{
            fontFamily: "var(--font-share-tech), monospace",
            color: "var(--text-muted)",
          }}
        >
          March 23, 2026
        </div>
        <Card projectId="save-state">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                fontFamily: "var(--font-share-tech), monospace",
                letterSpacing: "0.06em",
                background: "var(--bg-elevated)",
                color: "var(--project-save-state)",
                border: "1px solid var(--project-save-state)",
              }}
            >
              SAVE STATE
            </span>
          </div>
          <h2
            className="text-base mb-3"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "var(--text-primary)",
              fontWeight: 500,
            }}
          >
            Design system scaffold
          </h2>
          <div className="entry-content">
            <h2>Features</h2>
            <ul>
              <li>Design system established — amber/charcoal palette, three-tier typography</li>
              <li>Next.js 16 + Tailwind CSS v4 scaffold with static export</li>
              <li>Base Card component with project-colored left border accent</li>
            </ul>
            <h2>Infrastructure</h2>
            <ul>
              <li>JetBrains Mono, Share Tech Mono, DM Sans loaded via next/font/google</li>
              <li>CSS custom properties defined — colors, fonts, project accents</li>
            </ul>
          </div>
        </Card>
      </div>
    </main>
  );
}
