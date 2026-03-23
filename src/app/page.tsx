import { getAllEntries, getProjects } from "@/lib/entries";
import Header from "@/components/Header";
import EntryList from "@/components/EntryList";

export default async function Home() {
  const [entries, projects] = await Promise.all([getAllEntries(), getProjects()]);

  return (
    <main className="max-w-3xl mx-auto w-full px-6 py-12">
      <Header entryCount={entries.length} />
      <EntryList entries={entries} projects={projects} />
    </main>
  );
}
