import type { AwardsResponse } from "@/feature/awards/schema";
import { contentAwards } from "@/shared/content/content";

export function getAwards(): Promise<AwardsResponse> {
  return Promise.resolve({ ok: true, data: contentAwards });
}
