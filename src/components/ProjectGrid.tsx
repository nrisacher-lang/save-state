import ProjectCard from "./ProjectCard";
import type { Project } from "@/lib/types";

interface ProjectGridProps {
  projects: (Project & { entryCount: number; lastActive: string | null })[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
