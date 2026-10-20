import { motion } from "framer-motion";
import { useMemo } from "react";

import { usePageTransition } from "@/shared/components/layouts/page-transition/page-transition.context";
import { Heading } from "@/shared/components/ui";

import s from "./style.module.scss";

// 홈 Hero와 동일한 진입 모션
const EASE = [0.16, 1, 0.3, 1] as const;
const ENTRANCE = { duration: 0.46, ease: EASE } as const;
const HIDDEN = { opacity: 0, y: 12 } as const;
const VISIBLE = { opacity: 1, y: 0 } as const;

interface TitleLineProps {
  text: string;
  tone: "primary" | "secondary";
  delay: number;
  isVisible: boolean;
}

function TitleLine({ text, tone, delay, isVisible }: TitleLineProps) {
  const chars = useMemo(() => Array.from(text), [text]);

  return (
    <span className={[s.titleLine, s[tone]].filter(Boolean).join(" ")}>
      {chars.map((char, index) => (
        <motion.span
          key={`char-${index}`}
          className={s.char}
          initial={HIDDEN}
          animate={isVisible ? VISIBLE : HIDDEN}
          transition={{ ...ENTRANCE, delay: delay + index * 0.012 }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}

interface Props {
  title: string;
  count?: number;
}

/** 페이지 상단 타이틀. `count`가 있으면 옆에 흐린 숫자로 표시한다. */
export default function PageTitle({ title, count }: Props) {
  const { pageReady } = usePageTransition();

  return (
    <Heading as="h1" className={s.title}>
      <TitleLine text={title} tone="primary" delay={0} isVisible={pageReady} />
      {count !== undefined && (
        <TitleLine
          text={String(count)}
          tone="secondary"
          delay={0.1}
          isVisible={pageReady}
        />
      )}
    </Heading>
  );
}
