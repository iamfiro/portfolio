import type { ProjectResponse } from "@/feature/projects/schema";
import { contentProjects } from "@/shared/content/content";

export function getProject(id: string): Promise<ProjectResponse> {
  const project = contentProjects.find((item) => item.id === id);
  return Promise.resolve({
    ok: Boolean(project),
    data: project,
  } as ProjectResponse);
}
