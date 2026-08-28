import {
  About,
  Activity,
  Awards,
  Blog,
  Hero,
  Project,
  SiteFooter,
  TechStack,
} from "@/feature/home/components";
import { BaseLayout } from "@/shared/components/layouts";
import { Header, Spacer } from "@/shared/components/ui";

import s from "./home.module.scss";

export default function Home() {
  return (
    <main className={s.container}>
      <Header />
      <BaseLayout className={s.content}>
        <section className={s.viewport}>
          <Spacer size={50} />
          <Hero />
          <Project />
        </section>
        <Awards />
        <Activity />
        <Spacer size={100} />
        <About />
        <TechStack />
        <Blog />
        <SiteFooter />
      </BaseLayout>
    </main>
  );
}
