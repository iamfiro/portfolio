import { AwardMutationPayload } from "@/feature/awards/schema";

export interface UpdateAwardPayload {
  id: string;
  payload: Partial<AwardMutationPayload>;
}

export async function updateAward({ id, payload }: UpdateAwardPayload) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/awards/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("어워드 수정에 실패했습니다.");
  }

  return response.json();
}
