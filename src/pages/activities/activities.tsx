import { useQuery } from "@tanstack/react-query";

import { getAwards } from "@/feature/awards/data";
import type { AwardsResponse } from "@/feature/awards/schema";
import {
  LandingActivities,
  LandingAwards,
  LandingPageShell,
} from "@/feature/landing/components";

/** 랜딩의 수상·활동 섹션을 한 페이지에 모은다. 수상은 페이지 머리를 그대로 이어 쓴다 */
export default function Activities() {
  const { data } = useQuery<AwardsResponse>({
    queryKey: ["awards"],
    queryFn: getAwards,
  });

  return (
    <LandingPageShell
      titleId="activities-title"
      documentTitle="활동"
      lines={["대회에서 직접", "증명해 온 순간들"]}
    >
      <LandingAwards awards={data?.data ?? []} variant="page" />
      <LandingActivities />
    </LandingPageShell>
  );
}
