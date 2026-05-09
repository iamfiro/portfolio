import {
  About,
  Awards,
  Blog,
  Footer,
  Hero,
  MarqueeProjects,
  Project,
  SiteFooter,
  TechStack,
} from "@/feature/home/components";
import { Header, Spacer } from "@/shared/components/ui";

import s from "./home.module.scss";

export default function Home() {
  return (
    <main className={s.container}>
      <section className={s.viewport}>
        <Header />
         <Spacer size={50} />
        <Hero />
        <MarqueeProjects />
      </section>
      <Spacer size={100} />
      <About />
      <Project />
      <Awards />
      <TechStack />
      <Blog />
      <SiteFooter />
    </main>
  );
}
