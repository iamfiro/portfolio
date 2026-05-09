import { ProjectList } from "@/feature/projects/components";
import { Header, Spacer, Text } from "@/shared/components/ui";

import s from "./projects.module.scss";

export default function Projects() {
  return (
    <main className={s.container}>
      <Header />
      <Spacer size={48} />
      <section className={s.page}>
        <div className={s.hero}>
          <h1 className={s.title}>Projects</h1>
          <Text className={s.subtitle}>
            사이드 프로젝트부터 케이스 스터디까지, 다양한 작업물을 모아봤습니다.
          </Text>
        </div>
        <ProjectList />
      </section>
    </main>
  );
}
