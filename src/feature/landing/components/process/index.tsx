import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

import { useProcessLayout } from "@/feature/landing/hooks/use-process-layout";
import { Box, Text } from "@/shared/components/ui";

import { buildSentenceTokens, PROCESS_STEPS, wordDelay } from "./process.util";
import ProcessTile from "./process-tile";
import RevealWord from "./reveal-word";

import s from "./style.module.scss";

const TOKENS = buildSentenceTokens();

// 문장 화면이 이만큼 보이면 재생을 시작한다
const TRIGGER_AMOUNT = 0.3;

// 칸마다 타일이 덱을 떠나는 시각 (stepIndex 순서)
const LAUNCH_AT = PROCESS_STEPS.map((_, stepIndex) => {
  const slot = TOKENS.find(
    (token) => token.kind === "slot" && token.stepIndex === stepIndex,
  );
  return slot?.kind === "slot" ? slot.launchAt : 0;
});

/**
 * 위 화면 덱에 떠다니던 3D 타일이, 아래 문장 화면이 보이는 순간부터
 * 단어가 차례로 올라오고 구절이 끝날 때마다 타일이 스프링으로 날아가 문장 칸에 착지한다.
 * 스크롤에 묶이지 않아 멈춰 있어도 끝까지 이어지고, 한 번만 재생된다.
 */
export default function LandingProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const sentenceRef = useRef<HTMLDivElement>(null);
  const { layout, slotRefs, deckRef } = useProcessLayout(sectionRef);

  const isInView = useInView(sentenceRef, {
    once: true,
    amount: TRIGGER_AMOUNT,
  });
  // 동작 줄이기 사용자는 재생 없이 처음부터 완성된 문장을 본다
  const reduceMotion = useReducedMotion();
  const isPlaying = isInView || !!reduceMotion;

  return (
    <motion.section ref={sectionRef} className={s.process}>
      {/* 위 화면: 타일 덱이 모이는 자리 */}
      <motion.div
        ref={(element) => {
          deckRef.current = element;
        }}
        className={s.deck}
      />

      {/* 아래 화면: 타이포그래피. 이 화면이 보이면 재생이 시작된다 */}
      <motion.div ref={sentenceRef} className={s.sentence}>
        <Text as="p" className={s.copy}>
          {TOKENS.map((token) =>
            token.kind === "word" ? (
              <RevealWord
                key={`word-${token.order}`}
                text={`${token.text} `}
                isPlaying={isPlaying}
                delay={reduceMotion ? 0 : wordDelay(token.order)}
              />
            ) : (
              <motion.span
                key={`slot-${token.stepIndex}`}
                ref={(element) => {
                  slotRefs.current[token.stepIndex] = element;
                }}
                className={s.slot}
              />
            ),
          )}
        </Text>
      </motion.div>

      {layout && layout.slots.length === PROCESS_STEPS.length && (
        // 다시 잴 때마다 타일을 새로 그려 위치 계산이 새 레이아웃을 쓰게 한다
        <Box key={layout.version} className={s.tiles}>
          {PROCESS_STEPS.map((step, index) => (
            <ProcessTile
              key={step.id}
              step={step}
              index={index}
              layout={layout}
              isPlaying={isPlaying}
              launchAt={reduceMotion ? 0 : LAUNCH_AT[index]}
            />
          ))}
        </Box>
      )}
    </motion.section>
  );
}
