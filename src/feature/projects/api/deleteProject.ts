export async function deleteProject(id: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/projects/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error("프로젝트 삭제에 실패했습니다.");
  }

  return response.json();
}
