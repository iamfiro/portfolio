import { usePointerActivity } from "@/feature/landing/hooks/use-pointer-activity";
import { usePointerPosition } from "@/feature/landing/hooks/use-pointer-position";
import { Box } from "@/shared/components/ui";

import SectionHead from "../section-head";

import { COMPETENCIES, COMPETENCY_HEADLINE_LINES } from "./competency.util";
import CompetencyCard from "./competency-card";

import s from "./style.module.scss";

const TITLE_ID = "landing-competency-title";

/**
 * 핵심 역량을 파스텔 무대 위 목업 카드 세 장으로 나란히 보여준다.
 * 무대마다 스마일 마스코트가 고개를 내밀고 포인터를 따라 반응한다
 */
export default function LandingCompetency() {
  const pointer = usePointerPosition();
  const { sleepy, shake } = usePointerActivity();

  return (
    <Box as="section" className={s.competency} aria-labelledby={TITLE_ID}>
      <SectionHead titleId={TITLE_ID} lines={COMPETENCY_HEADLINE_LINES} />

      <Box className={s.grid}>
        {COMPETENCIES.map((competency, index) => (
          <CompetencyCard
            key={competency.visual}
            competency={competency}
            index={index}
            pointer={pointer}
            sleepy={sleepy}
            shake={shake}
          />
        ))}
      </Box>
    </Box>
  );
}
