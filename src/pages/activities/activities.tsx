import { motion } from "framer-motion";

import { AwardsList } from "@/feature/awards/components";
import { Activity } from "@/feature/home/components";
import {
  Header,
  Heading,
  Section,
  Spacer,
  Stack,
  Text,
} from "@/shared/components/ui";
import { usePageEntrance } from "@/shared/hooks";

import s from "./activities.module.scss";

export default function Activities() {
  const titleEntrance = usePageEntrance("title");
  const subtitleEntrance = usePageEntrance("subtitle");
  const awardsTitleEntrance = usePageEntrance("lead", 0.35);
  const activitiesTitleEntrance = usePageEntrance("lead", 1.1);

  return (
    <main className={s.container}>
      <Header />
      <Spacer size={48} />
      <section className={s.page}>
        <Stack className={s.hero} gap={12}>
          <motion.div {...titleEntrance}>
            <Heading as="h1" size="4xl" className={s.title}>
              Activities
            </Heading>
          </motion.div>
          <motion.div {...subtitleEntrance}>
            <Text className={s.subtitle}>
              대회와 해커톤의 수상 실적부터 교내외 활동까지 한곳에 모아봤습니다.
            </Text>
          </motion.div>
        </Stack>
        <Stack className={s.content} gap={64}>
          <Section className={s.awardsSection} size="sm">
            <motion.div {...awardsTitleEntrance}>
              <Heading as="h2" size="lg" className={s.sectionTitle}>
                수상 실적
              </Heading>
            </motion.div>
            <AwardsList />
          </Section>
          <Activity variant="page" titleMotionProps={activitiesTitleEntrance} />
        </Stack>
      </section>
    </main>
  );
}
