import { useMemo } from "react";

import type { Award } from "@/feature/awards/schema";
import { Box, HoverPreview } from "@/shared/components/ui";

import SectionHead from "../section-head";

import AwardYear from "./award-year";
import { AWARDS_HEADLINE_LINES, groupAwardsByYear } from "./awards.util";

import s from "./style.module.scss";

const TITLE_ID = "landing-awards-title";

interface Props {
  awards: Award[];
  /** "page"는 활동 페이지 본문: 활동 페이지로 가는 머리를 뺀다 */
  variant?: "section" | "page";
}

/** 프로젝트 섹션과 같은 머리 아래로 수상 실적을 연도별로 한 줄씩 펼친다 */
export default function LandingAwards({ awards, variant = "section" }: Props) {
  const isPage = variant === "page";
  const groups = useMemo(() => groupAwardsByYear(awards), [awards]);

  if (awards.length === 0) return null;

  return (
    <Box
      as="section"
      className={s.awards}
      aria-labelledby={isPage ? undefined : TITLE_ID}
      // 호버 카드와 겹치지 않게 수상 섹션에서는 커서 버블을 끈다
      data-trail-off
    >
      {!isPage && (
        <SectionHead
          titleId={TITLE_ID}
          lines={AWARDS_HEADLINE_LINES}
          link={{ href: "/activities", label: "전체 활동 보기" }}
        />
      )}

      {/* 수상 줄에 커서를 올리면 기관·연도와 수상 사진을 담은 카드가 커서를 따라 뜬다 */}
      <HoverPreview className={s.list}>
        {groups.map((group) => (
          <AwardYear key={group.year} group={group} />
        ))}
      </HoverPreview>
    </Box>
  );
}
