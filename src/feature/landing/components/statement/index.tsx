import { motion } from "framer-motion";
import { useRef } from "react";

import { useLatchedProgress } from "@/feature/landing/hooks/use-latched-progress";
import { Box, Text } from "@/shared/components/ui";

import FloatingBubble from "./floating-bubble";
import HighlightWord from "./highlight-word";
import ScrollWord from "./scroll-word";
import {
  STATEMENT_BUBBLES,
  STATEMENT_HEADLINE,
  STATEMENT_HIGHLIGHTS,
  wordRange,
} from "./statement.util";

import s from "./style.module.scss";

const WORDS = STATEMENT_HEADLINE.split(" ");

/**
 * 화면에 고정된 큰 문장이 스크롤을 따라 한 단어씩 진해지고,
 * 핵심 단어엔 형광펜과 아이콘이, 둘레엔 버블이 톡톡 튀어나온다.
 * 한 번 채워진 문장은 스크롤을 되돌려도 다시 흐려지지 않는다.
 */
export default function LandingStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress, fillProgress } = useLatchedProgress(sectionRef);

  return (
    <motion.section ref={sectionRef} className={s.statement}>
      <Box className={s.sticky}>
        <Box className={s.bubbles} aria-hidden>
          {STATEMENT_BUBBLES.map((bubble, index) => (
            <FloatingBubble
              key={`${bubble.left}-${bubble.top}`}
              bubble={bubble}
              progress={progress}
              fillProgress={fillProgress}
              index={index}
            />
          ))}
        </Box>

        <Text as="p" className={s.headline}>
          {WORDS.map((word, index) => {
            const range = wordRange(index, WORDS.length);
            const highlight = STATEMENT_HIGHLIGHTS[word];

            return highlight ? (
              <HighlightWord
                key={`${word}-${index}`}
                word={word}
                highlight={highlight}
                progress={fillProgress}
                range={range}
              />
            ) : (
              <ScrollWord
                key={`${word}-${index}`}
                word={word}
                progress={fillProgress}
                range={range}
              />
            );
          })}
        </Text>
      </Box>
    </motion.section>
  );
}
