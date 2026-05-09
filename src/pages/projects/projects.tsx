import { motion } from "framer-motion";

import { ProjectList } from "@/feature/projects/components";
import { Header, Spacer, Text } from "@/shared/components/ui";

import s from "./projects.module.scss";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function Projects() {
  return (
    <main className={s.container}>
      <Header />
      <Spacer size={48} />
      <section className={s.page}>
        <div className={s.hero}>
          <motion.h1
            className={s.title}
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
          >
            Projects
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
          >
            <Text className={s.subtitle}>
              사이드 프로젝트부터 케이스 스터디까지, 다양한 작업물을 모아봤습니다.
            </Text>
          </motion.div>
        </div>
        <ProjectList />
      </section>
    </main>
  );
}
