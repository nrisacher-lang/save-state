interface HeaderProps {
  entryCount: number;
}

export default function Header({ entryCount }: HeaderProps) {
  return (
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
        {entryCount} {entryCount === 1 ? "ENTRY" : "ENTRIES"}
      </p>
      <div
        className="mt-6"
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, var(--accent-glow), var(--accent), var(--accent-glow), transparent)",
        }}
      />
    </header>
  );
}
