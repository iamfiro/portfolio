import { Box } from "@/shared/components/ui";
import { contentActivities } from "@/shared/content/content";

import SectionHead from "../section-head";

import { ACTIVITIES_HEADLINE_LINES } from "./activities.util";
import ActivityTile from "./activity-tile";

import s from "./style.module.scss";

const TITLE_ID = "landing-activities-title";

/** 개발 밖의 활동을 두 열 타일로 가볍게 늘어놓는다 */
export default function LandingActivities() {
  if (contentActivities.length === 0) return null;

  return (
    <Box as="section" className={s.activities} aria-labelledby={TITLE_ID}>
      <SectionHead titleId={TITLE_ID} lines={ACTIVITIES_HEADLINE_LINES} />

      <Box className={s.grid}>
        {contentActivities.map((activity, index) => (
          <ActivityTile key={activity.id} activity={activity} index={index} />
        ))}
      </Box>
    </Box>
  );
}
