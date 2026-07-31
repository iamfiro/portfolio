import { AwardResponse } from "@/feature/awards/schema";
import { get } from "@/shared/lib/api";

export function getAward(id: string): Promise<AwardResponse> {
  return get<AwardResponse>(`/awards/${id}`);
}
