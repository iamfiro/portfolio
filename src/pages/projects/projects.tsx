import { motion } from "framer-motion";

import { ProjectList } from "@/feature/projects/components";
import SeoHead from "@/shared/components/seo-head";
import { Header, Spacer, Text } from "@/shared/components/ui";
import { usePageEntrance } from "@/shared/hooks";

import s from "./projects.module.scss";

export default function Projects() {
  const titleEntrance = usePageEntrance("title");
  const subtitleEntrance = usePageEntrance("subtitle");

  return (
    <>
      <SeoHead
        title="Projects"
        description="사이드 프로젝트부터 케이스 스터디까지, 다양한 작업물을 모아봤습니다."
        path="/projects"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Projects",
          description:
            "사이드 프로젝트부터 케이스 스터디까지, 다양한 작업물을 모아봤습니다.",
          url: "https://devfiro.com/projects",
          author: {
            "@type": "Person",
            name: "Sungju Cho",
          },
        }}
      />
      <main id="main-content" className={s.container}>
        <Header />
        <Spacer size={48} />
        <section className={s.page}>
          <div className={s.hero}>
            <motion.h1 className={s.title} {...titleEntrance}>
              Projects
            </motion.h1>
            <motion.div {...subtitleEntrance}>
              <Text className={s.subtitle}>
                사이드 프로젝트부터 케이스 스터디까지, 다양한 작업물을 모아봤습니다.
              </Text>
            </motion.div>
          </div>
          <ProjectList />
        </section>
      </main>
    </>
  );
}
