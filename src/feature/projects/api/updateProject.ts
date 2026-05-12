import { ProjectMutationPayload } from "@/feature/projects/schema";

export interface UpdateProjectPayload {
  id: string;
  payload: Partial<ProjectMutationPayload>;
}

export async function updateProject({ id, payload }: UpdateProjectPayload) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/projects/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error("프로젝트 수정에 실패했습니다.");
  }

  return response.json();
}
