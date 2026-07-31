import { AwardMutationPayload, AwardResponse } from "@/feature/awards/schema";
import { put } from "@/shared/lib/api";

export interface UpdateAwardPayload {
  id: string;
  payload: Partial<AwardMutationPayload>;
}

export async function updateAward({
  id,
  payload,
}: UpdateAwardPayload): Promise<AwardResponse> {
  return put<AwardResponse>(`/awards/${id}`, payload);
}
