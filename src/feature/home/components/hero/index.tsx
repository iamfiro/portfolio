import { type ReactNode, useMemo } from "react";
import { ArrowRight } from "lucide-react";

import { Button, Flex } from "@/shared/components/ui";

import s from "./style.module.scss";

interface TitleSegment {
  text: string;
  bold?: boolean;
  lineBreak?: boolean;
}

const TITLE_SEGMENTS: TitleSegment[] = [
  { text: "Researching and building thoughtful" },
  { lineBreak: true, text: "" },
  { text: "services that solve everyday " },
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
  const chars = useMemo(() => splitSegmentsToChars(TITLE_SEGMENTS), []);

  const elements: ReactNode[] = [];
  let charIndex = 0;

  for (let i = 0; i < chars.length; i++) {
    const { char, bold, isBreak } = chars[i];

    if (isBreak) {
      elements.push(<br key={`br-${i}`} />);
      continue;
    }

    const span = (
      <span
        key={`char-${i}`}
        className={[s.char, bold && s.charBold].filter(Boolean).join(" ")}
        style={{ "--char-index": charIndex } as React.CSSProperties}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    );

    elements.push(span);
    charIndex++;
  }

  return <>{elements}</>;
}

export default function Hero() {
  return (
    <section className={s.hero}>
      <div className={s.content}>
        <div className={[s.bubbleContainer, s.animBubble].join(" ")}>
          <img src="/me.png" alt="My Face" className={s.me} />
          <div className={s.bubble}>👋 Hi! Nice to meet you</div>
        </div>
        <h1 className={s.title}>
          <TitleChars />
        </h1>
        <p className={[s.description, s.animDescription].join(" ")}>
          Full-Stack developer studying software engineering at Sunrin Internet
          High School.
          <br />I build practical services that solve real problems.
        </p>
      </div>
      <Flex
        gap={16}
        align="center"
        className={[s.buttonContainer, s.animButton].join(" ")}
      >
        <Button variant="primary" size="md" rightIcon={<ArrowRight />}>
          Contact me
        </Button>
      </Flex>
    </section>
  );
}
