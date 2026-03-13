import {
  About,
  Awards,
  Blog,
  Footer,
  Hero,
  Project,
  SiteFooter,
  TechStack,
  TopProject,
} from "@/feature/home/components";
import { Header, Spacer } from "@/shared/components/ui";

import s from "./home.module.scss";

export default function Home() {
  return (
    <main className={s.container}>
      <Spacer size={64} />
      <Header />
      <Hero />
      <Spacer size={24} />
      <TopProject />
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
