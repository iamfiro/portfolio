import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

import { useLoopTick } from "@/feature/landing/hooks/use-loop-tick";
import { Box, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

// 출시 뒤 쓰는 모습을 보고 고친 예시
const RELEASES = [
  { version: "v1.0", note: "처음 내놓음" },
  { version: "v1.1", note: "입력 내용 자동 저장" },
  { version: "v1.2", note: "자주 쓰는 버튼을 위로" },
  { version: "v1.3", note: "글자를 더 크게" },
];

const VISIBLE = 3;
const TICK_MS = 1500;

/** 업데이트 기록 맨 위에 새 버전이 하나씩 쌓인다 */
export default function IterationVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { tick } = useLoopTick(ref, RELEASES.length, TICK_MS);
  const shown = RELEASES.slice(0, tick + 1)
    .reverse()
    .slice(0, VISIBLE);

  return (
    <motion.div ref={ref} className={s.visual}>
      <Box className={s.log}>
        <Text as="span" className={s.heading}>
          업데이트 기록
        </Text>

        <Box className={s.entries}>
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map(({ version, note }, index) => (
              <motion.div
                key={version}
                layout
                className={[s.entry, index === 0 && s.latest]
                  .filter(Boolean)
                  .join(" ")}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              >
                <Text as="span" className={s.version}>
                  {version}
                </Text>
                <Text as="span" className={s.note}>
                  {note}
                </Text>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      </Box>
    </motion.div>
  );
}
