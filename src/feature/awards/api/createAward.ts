import { AwardMutationPayload } from "@/feature/awards/schema";

export async function createAward(payload: AwardMutationPayload) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/awards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("어워드 생성에 실패했습니다.");
  }

  return response.json();
}
