import { motion } from "framer-motion";

import { AwardsList } from "@/feature/awards/components";
import { Header, Spacer, Text } from "@/shared/components/ui";

import s from "./awards.module.scss";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function Awards() {
  return (
    <main className={s.container}>
      <Header />
      <Spacer size={48} />
      <section className={s.page}>
        <div className={s.hero}>
          <motion.h1
            className={s.title}
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          >
            Awards
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
          >
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
