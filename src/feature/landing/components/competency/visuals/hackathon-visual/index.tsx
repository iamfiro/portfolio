import { AnimatePresence, motion } from "framer-motion";
import { Check, Trophy } from "lucide-react";
import { useRef } from "react";

import { useLoopTick } from "@/feature/landing/hooks/use-loop-tick";
import { LANDING_EASE } from "@/feature/landing/utils/reveal.util";
import { Box, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

const STEPS = ["아이디어", "디자인", "개발", "시연"];

// content/awards의 실제 수상명
const AWARD_TITLE = "선린 해커톤 10th 금상";

// 단계마다 한 박자, 다 끝나면 두 박자 동안 수상 배지를 보여준 뒤 처음으로
const TICKS = STEPS.length + 2;
const TICK_MS = 1100;

/** 해커톤 단계가 하나씩 체크되고, 끝나면 수상 배지가 튀어나온다 */
export default function HackathonVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { tick } = useLoopTick(ref, TICKS, TICK_MS);
  const doneCount = Math.min(tick + 1, STEPS.length);
  const isAwarded = tick >= STEPS.length;

  return (
    <motion.div ref={ref} className={s.visual}>
      <Box className={s.board}>
        <Box className={s.track}>
          <motion.span
            className={s.fill}
            animate={{ width: `${(doneCount / STEPS.length) * 100}%` }}
            transition={{ duration: 0.6, ease: LANDING_EASE }}
          />
        </Box>

        <Box className={s.steps}>
          {STEPS.map((step, index) => {
            const isDone = index < doneCount;

            return (
              <Box
                key={step}
                className={[s.step, isDone && s.done].filter(Boolean).join(" ")}
              >
                <Box as="span" className={s.check}>
                  <AnimatePresence initial={false}>
                    {isDone && (
                      <motion.span
                        className={s.checkIcon}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 20,
                        }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Box>
                <Text as="span" className={s.stepText}>
                  {step}
                </Text>
              </Box>
            );
          })}
        </Box>
      </Box>

      <AnimatePresence>
        {isAwarded && (
          <motion.div
            className={s.award}
            initial={{ scale: 0.4, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: -4, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 16 }}
          >
            <Trophy size={16} />
            <Text as="span" className={s.awardText}>
              {AWARD_TITLE}
            </Text>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
