import { AwardsResponse } from "@/feature/awards/schema";
import { get } from "@/shared/lib/api";

export function getAwards(): Promise<AwardsResponse> {
  return get<AwardsResponse>("/awards");
}
