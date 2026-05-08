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
  TopProject,
} from "@/feature/home/components";
import { Header } from "@/shared/components/ui";

import s from "./home.module.scss";

export default function Home() {
  return (
    <main className={s.container}>
      <section className={s.viewport}>
        <Header />
        <div/>
        <Hero />
        <MarqueeProjects />
      </section>
      <About />
      <Project />
      <TechStack />
      <Awards />
      <Blog />
      <SiteFooter />
      <Footer />
    </main>
  );
}
