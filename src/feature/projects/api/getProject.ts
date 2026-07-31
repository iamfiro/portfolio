import { ProjectResponse } from "@/feature/projects/schema";
import { get } from "@/shared/lib/api";

export function getProject(id: string): Promise<ProjectResponse> {
  return get<ProjectResponse>(`/projects/${id}`);
}
