import { Box } from "@/shared/components/ui";

import SectionHead from "../section-head";

import { COMPETENCIES, COMPETENCY_HEADLINE_LINES } from "./competency.util";
import CompetencyCard from "./competency-card";

import s from "./style.module.scss";

const TITLE_ID = "landing-competency-title";

/** 핵심 역량을 시각화 목업이 올라간 세 장의 카드로 나란히 보여준다 */
export default function LandingCompetency() {
  return (
    <Box as="section" className={s.competency} aria-labelledby={TITLE_ID}>
      <SectionHead titleId={TITLE_ID} lines={COMPETENCY_HEADLINE_LINES} />

      <Box className={s.grid}>
        {COMPETENCIES.map((competency, index) => (
          <CompetencyCard
            key={competency.visual}
            competency={competency}
            index={index}
          />
        ))}
      </Box>
    </Box>
  );
}
