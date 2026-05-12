export async function deleteAward(id: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/awards/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("어워드 삭제에 실패했습니다.");
  }

  return response.json();
}
