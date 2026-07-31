import { ProjectMutationPayload, ProjectResponse } from "@/feature/projects/schema";
import { post } from "@/shared/lib/api";

export async function createProject(
  payload: ProjectMutationPayload,
): Promise<ProjectResponse> {
  return post<ProjectResponse>("/projects", payload);
}
