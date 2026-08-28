import type { AwardsResponse } from "@/feature/awards/schema";
import { contentAwards } from "@/shared/content/content";

export function getAwards(): Promise<AwardsResponse> {
  const sortedAwards = [...contentAwards].sort(
    (firstAward, secondAward) =>
      new Date(secondAward.date).getTime() -
      new Date(firstAward.date).getTime(),
  );

  return Promise.resolve({ ok: true, data: sortedAwards });
}
