import { Hero } from "@/feature/home/components";

import s from "./home.module.scss";
import { Header } from "@/shared/components/ui";

export default function Home() {
  return (
    <main className={s.container}>
      <Header />
      <Hero />
    </main>
  );
}
