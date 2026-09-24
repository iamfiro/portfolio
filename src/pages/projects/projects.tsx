import { motion } from "framer-motion";

import { ProjectList } from "@/feature/projects/components";
import { Header, Heading, Spacer, Text } from "@/shared/components/ui";
import { usePageEntrance } from "@/shared/hooks";

import s from "./projects.module.scss";

export default function Projects() {
  const titleEntrance = usePageEntrance("title");
  const subtitleEntrance = usePageEntrance("subtitle");

  return (
    <main className={s.container}>
      <Header />
      <Spacer size={48} />
      <section className={s.page}>
        <div className={s.hero}>
          <motion.div {...titleEntrance}>
            <Heading as="h1" size="4xl" className={s.title}>
              Projects
            </Heading>
          </motion.div>
          <motion.div {...subtitleEntrance}>
            <Text className={s.subtitle}>
              사이드 프로젝트부터 케이스 스터디까지, 다양한 작업물을
              모아봤습니다.
            </Text>
          </motion.div>
        </div>
        <ProjectList />
      </section>
    </main>
  );
}
