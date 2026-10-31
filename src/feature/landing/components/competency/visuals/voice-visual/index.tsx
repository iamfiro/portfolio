import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

import { useLoopTick } from "@/feature/landing/hooks/use-loop-tick";
import { Text } from "@/shared/components/ui";

import s from "./style.module.scss";

const VOICES = [
  "버튼이 어디 있지?",
  "또 처음부터 입력해야 해?",
  "로그인이 왜 이렇게 길어?",
];

// 말풍선이 하나씩 쌓이고, 다 차면 한 박자 쉰 뒤 처음부터
const TICKS = VOICES.length + 1;
const TICK_MS = 1400;

/** 여기저기서 들려온 불편이 말풍선으로 하나씩 쌓인다 */
export default function VoiceVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { tick } = useLoopTick(ref, TICKS, TICK_MS);
  const count = Math.min(tick + 1, VOICES.length);

  return (
    <motion.div ref={ref} className={s.visual}>
      <AnimatePresence initial={false}>
        {VOICES.slice(0, count).map((voice, index) => (
          <motion.div
            key={voice}
            className={[s.bubble, index % 2 === 1 && s.offset]
              .filter(Boolean)
              .join(" ")}
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
          >
            <Text as="span" className={s.text}>
              {voice}
            </Text>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
