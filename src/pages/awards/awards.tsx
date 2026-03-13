import { AwardsHero, AwardsList } from "@/feature/awards/components";
import { BaseLayout } from "@/shared/components/layouts";
import { Header, Spacer } from "@/shared/components/ui";

import s from "./awards.module.scss";

export default function Awards() {
  return (
    <BaseLayout>
      <Header />
      <Spacer size={48} />
      <section className={s.page}>
        <AwardsHero />
        <AwardsList />
      </section>
    </BaseLayout>
  );
}
