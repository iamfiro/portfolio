import { ProjectMutationPayload } from "@/feature/projects/schema";

export async function createProject(payload: ProjectMutationPayload) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("프로젝트 생성에 실패했습니다.");
  }

  return response.json();
}
