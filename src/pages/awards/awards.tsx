import { motion } from "framer-motion";

import { AwardsList } from "@/feature/awards/components";
import { Header, Spacer, Text } from "@/shared/components/ui";
import { usePageEntrance } from "@/shared/hooks";

import s from "./awards.module.scss";

export default function Awards() {
  const titleEntrance = usePageEntrance("title");
  const subtitleEntrance = usePageEntrance("subtitle");

  return (
    <main className={s.container}>
      <Header />
      <Spacer size={48} />
      <section className={s.page}>
        <div className={s.hero}>
          <motion.h1 className={s.title} {...titleEntrance}>
            Awards
          </motion.h1>
          <motion.div {...subtitleEntrance}>
            <Text className={s.subtitle}>
              대회와 해커톤에서 쌓아온 수상 기록들을 모아봤습니다.
            </Text>
          </motion.div>
        </div>
        <AwardsList />
      </section>
    </main>
  );
}
