import { AwardMutationPayload, AwardResponse } from "@/feature/awards/schema";
import { post } from "@/shared/lib/api";

export async function createAward(payload: AwardMutationPayload): Promise<AwardResponse> {
  return post<AwardResponse>("/awards", payload);
}
