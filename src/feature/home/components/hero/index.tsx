import { motion } from "framer-motion";
import { type ReactNode, useMemo } from "react";

import { usePageTransition } from "@/shared/components/layouts/page-transition/page-transition.context";

import ContactButton from "./contact-button";

import s from "./style.module.scss";

const EASE = [0.16, 1, 0.3, 1] as const;

interface TitleSegment {
  text: string;
  bold?: boolean;
  lineBreak?: boolean;
}

const TITLE_SEGMENTS: TitleSegment[] = [
  { text: "Researching and " },
  { text: "building thoughtful" },
  { lineBreak: true, text: "" },
  { text: "services that solve " },
  { text: "everyday " },
  { text: "problems", bold: true },
];

function splitSegmentsToChars(segments: TitleSegment[]) {
  const chars: { char: string; bold: boolean; isBreak: boolean }[] = [];

  for (const segment of segments) {
    if (segment.lineBreak) {
      chars.push({ char: "\n", bold: false, isBreak: true });
      continue;
    }
    for (const char of segment.text) {
      chars.push({ char, bold: !!segment.bold, isBreak: false });
    }
  }

  return chars;
}

function TitleChars() {
  const { pageReady } = usePageTransition();
  const chars = useMemo(() => splitSegmentsToChars(TITLE_SEGMENTS), []);

  const elements: ReactNode[] = [];
  let charIndex = 0;

  for (let i = 0; i < chars.length; i++) {
    const { char, bold, isBreak } = chars[i];

    if (isBreak) {
      elements.push(<br key={`br-${i}`} />);
      continue;
    }

    const delay = 0.1 + charIndex * 0.02;

    const span = (
      <motion.span
        key={`char-${i}`}
        className={[s.char, bold && s.charBold].filter(Boolean).join(" ")}
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        animate={
          pageReady ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined
        }
        transition={{ duration: 0.5, ease: EASE, delay }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    );

    elements.push(span);
    charIndex++;
  }

  return <>{elements}</>;
}

export default function Hero() {
  const { pageReady } = usePageTransition();

  return (
    <section className={s.hero}>
      <div className={s.content}>
        <motion.div
          className={s.bubbleContainer}
          initial={{ opacity: 0, x: -20 }}
          animate={pageReady ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.6, ease: EASE, delay: 0 }}
        >
          <img
            src="/me.png"
            alt="My Face"
            className={s.me}
            {...{ fetchpriority: "high" }}
            decoding="async"
          />
          <div className={s.bubble}>👋 Hi! Nice to meet you</div>
        </motion.div>
        <h1 className={s.title}>
          <TitleChars />
        </h1>
        <motion.p
          className={s.description}
          initial={{ opacity: 0, y: 16 }}
          animate={pageReady ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, ease: EASE, delay: 1 }}
        >
          Full-Stack developer studying software engineering at Sunrin Internet
          High School.
          <br />I build practical services that solve real problems.
        </motion.p>
      </div>
      <motion.div
        className={s.buttonContainer}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={pageReady ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.5, ease: EASE, delay: 1 }}
      >
        <ContactButton />
      </motion.div>
    </section>
  );
}
