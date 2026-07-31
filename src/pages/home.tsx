import {
  About,
  Awards,
  Blog,
  Hero,
  MarqueeProjects,
  Project,
  SiteFooter,
  TechStack,
} from "@/feature/home/components";
import SeoHead from "@/shared/components/seo-head";
import { Header, Spacer } from "@/shared/components/ui";

import s from "./home.module.scss";

export default function Home() {
  return (
    <>
      <SeoHead
        path="/"
        description="Sungju Cho의 포트폴리오. 즐거운 디지털 경험을 만드는 Creative Developer입니다."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Sungju Cho",
          url: "https://devfiro.com",
          jobTitle: "Creative Developer",
          sameAs: [
            "https://github.com/iamfiro",
            "https://www.linkedin.com/in/sungju-cho/",
            "https://www.instagram.com/chxs_u/",
          ],
        }}
      />
      <main id="main-content" className={s.container}>
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
    </>
  );
}
