import type { ProjectsResponse } from "@/feature/projects/schema";
import { contentProjects } from "@/shared/content/content";

export function getProjects(): Promise<ProjectsResponse> {
  return Promise.resolve({ ok: true, data: contentProjects });
}
