import { AwardsList } from "@/feature/awards/components";
import { Header, Spacer, Text } from "@/shared/components/ui";

import s from "./awards.module.scss";

export default function Awards() {
  return (
    <main className={s.container}>
      <Header />
      <Spacer size={48} />
      <section className={s.page}>
        <div className={s.hero}>
          <h1 className={s.title}>Awards</h1>
          <Text className={s.subtitle}>
            대회와 해커톤에서 쌓아온 수상 기록들을 모아봤습니다.
          </Text>
        </div>
        <AwardsList />
      </section>
    </main>
  );
}
