import { ProjectsResponse } from "@/feature/projects/schema";
import { get } from "@/shared/lib/api";

export function getProjects(): Promise<ProjectsResponse> {
  return get<ProjectsResponse>("/projects");
}
