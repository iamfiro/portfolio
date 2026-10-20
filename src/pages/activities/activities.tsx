import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { AwardsList } from "@/feature/awards/components";
import { getAwards } from "@/feature/awards/data";
import type { AwardsResponse } from "@/feature/awards/schema";
import { Activity } from "@/feature/home/components";
import PageTitle from "@/shared/components/page-title";
import {
  Grid,
  Header,
  Heading,
  Section,
  Spacer,
  Text,
} from "@/shared/components/ui";
import { contentActivities } from "@/shared/content/content";
import { usePageEntrance } from "@/shared/hooks";

import s from "./activities.module.scss";

export default function Activities() {
  const awardsTitleEntrance = usePageEntrance("lead", 0.2);
  const activitiesTitleEntrance = usePageEntrance("lead", 0.3);
  const { data } = useQuery<AwardsResponse>({
    queryKey: ["awards"],
    queryFn: getAwards,
  });

  const awardCount = data?.data.length;
  const totalCount =
    awardCount !== undefined
      ? awardCount + contentActivities.length
      : undefined;

  return (
    <main className={s.container}>
      <Header />
      <Spacer size={48} />
      <section className={s.page}>
        <PageTitle title="활동" count={totalCount} />
        <Grid className={s.content}>
          <Section size="sm">
            <motion.div {...awardsTitleEntrance}>
              <Heading as="h2" size="lg" className={s.sectionTitle}>
                수상 실적
                {awardCount !== undefined && (
                  <Text as="span" className={s.count}>
                    {awardCount}
                  </Text>
                )}
              </Heading>
            </motion.div>
            <AwardsList />
          </Section>
          <Activity variant="page" titleMotionProps={activitiesTitleEntrance} />
        </Grid>
      </section>
    </main>
  );
}
