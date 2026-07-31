import { ProjectMutationPayload, ProjectResponse } from "@/feature/projects/schema";
import { put } from "@/shared/lib/api";

export interface UpdateProjectPayload {
  id: string;
  payload: Partial<ProjectMutationPayload>;
}

export async function updateProject({
  id,
  payload,
}: UpdateProjectPayload): Promise<ProjectResponse> {
  return put<ProjectResponse>(`/projects/${id}`, payload);
}
