import { getAllEntries, getProjects } from "@/lib/entries";
import Header from "@/components/Header";
import EntryList from "@/components/EntryList";

export default async function Home() {
  const [entries, projects] = await Promise.all([getAllEntries(), getProjects()]);

  return (
    <>
      <main className="max-w-3xl mx-auto w-full px-6 py-12 flex-1">
        <Header entryCount={entries.length} />
        <EntryList entries={entries} projects={projects} />
      </main>
      <footer
        className="max-w-3xl mx-auto w-full px-6 py-8 mt-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <p
          className="text-xs tracking-widest"
          style={{
            fontFamily: "var(--font-share-tech), monospace",
            color: "var(--text-muted)",
          }}
        >
          UNDERSTORY LABS · {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}
