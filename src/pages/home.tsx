import { Footer, Hero } from "@/feature/home/components";
import { Header, Spacer } from "@/shared/components/ui";

import s from "./home.module.scss";

export default function Home() {
  return (
    <main className={s.container}>
      <Spacer size={64} />
      <Header />
      <Hero />
      <Footer />
    </main>
  );
}
