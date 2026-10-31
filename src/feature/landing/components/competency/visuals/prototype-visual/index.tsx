import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

import { useLoopTick } from "@/feature/landing/hooks/use-loop-tick";
import { Box, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

const STEPS = [
  { key: "sketch", label: "스케치" },
  { key: "wire", label: "와이어프레임" },
  { key: "screen", label: "화면" },
] as const;

const TICK_MS = 1600;

/** 점선 스케치가 회색 뼈대를 거쳐 색이 든 화면으로 채워진다 */
export default function PrototypeVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { tick } = useLoopTick(ref, STEPS.length, TICK_MS);
  const step = STEPS[tick];

  const mockClassName = [s.mock, s[step.key]].filter(Boolean).join(" ");

  return (
    <motion.div ref={ref} className={s.visual}>
      <Box className={s.chip}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={step.key}
            className={s.chipInner}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Text as="span" className={s.chipText}>
              {step.label}
            </Text>
          </motion.span>
        </AnimatePresence>
      </Box>

      <Box className={mockClassName}>
        <Box className={s.media} />
        <Box className={s.line} />
        <Box className={[s.line, s.short].join(" ")} />
        <Box className={s.button} />
      </Box>
    </motion.div>
  );
}
