import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useMemo } from "react";

import { usePageTransition } from "@/shared/components/layouts/page-transition/page-transition.context";
import { Flex, Heading, Image, Link, Text } from "@/shared/components/ui";
import { LINK } from "@/shared/constants";

import s from "./style.module.scss";

const EASE = [0.16, 1, 0.3, 1] as const;

const ENTRANCE = {
  duration: 0.65,
  ease: EASE,
} as const;

const HIDDEN = {
  opacity: 0,
  y: 18,
  filter: "blur(8px)",
} as const;

const VISIBLE = {
  opacity: 1,
  y: 0,
  filter: "blur(0px)",
} as const;

const STEP_DELAY = {
  profile: 0,
  titleSecondary: 0.18,
  titlePrimary: 0.5,
  description: 1.08,
  contactLinks: 1.52,
} as const;

const CONTACT_LINKS = [
  { href: `mailto:${LINK.email}`, label: "Email", external: false },
  { href: LINK.linkedin, label: "LinkedIn", external: true },
  { href: LINK.github, label: "Github", external: true },
] as const;

interface TitleLineProps {
  text: string;
  tone: "primary" | "secondary";
  delay: number;
}

function TitleLine({ text, tone, delay }: TitleLineProps) {
  const { pageReady } = usePageTransition();
  const chars = useMemo(() => Array.from(text), [text]);

  return (
    <span className={[s.titleLine, s[tone]].filter(Boolean).join(" ")}>
      {chars.map((char, index) => {
        const charDelay = delay + index * 0.018;

        return (
          <motion.span
            key={`char-${index}`}
            className={s.char}
            initial={HIDDEN}
            animate={pageReady ? VISIBLE : undefined}
            transition={{ ...ENTRANCE, delay: charDelay }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </span>
  );
}

export default function Hero() {
  const { pageReady } = usePageTransition();

  const entrance = (delay: number) => ({
    initial: HIDDEN,
    animate: pageReady ? VISIBLE : undefined,
    transition: { ...ENTRANCE, delay },
  });

  return (
    <section className={s.hero}>
      <div className={s.content}>
        <motion.div className={s.profile} {...entrance(STEP_DELAY.profile)}>
          <Image
            src="/me.png"
            alt="My Face"
            className={s.me}
            fetchPriority="high"
            decoding="async"
          />
        </motion.div>
        <motion.div {...entrance(STEP_DELAY.titleSecondary)}>
          <Heading as="h1" size="lg" className={s.title}>
            <TitleLine
              text="불편함을 기회로 바꾸는"
              tone="secondary"
              delay={STEP_DELAY.titleSecondary}
            />
            <TitleLine
              text="서비스를 만들고 경험을 설계합니다"
              tone="primary"
              delay={STEP_DELAY.titlePrimary}
            />
          </Heading>
        </motion.div>
        <motion.div
          className={s.description}
          {...entrance(STEP_DELAY.description)}
        >
          <Text as="p">
            소프트웨어를 바탕으로 일상의 문제를 해결하는 풀스택 개발자입니다.
            <br />
            새로운 기술을 배우는 것을 두려워하지 않으며, 사람들이 좋아하고
            필요로 하는 서비스를 만들고 있습니다.
          </Text>
        </motion.div>
        <motion.div {...entrance(STEP_DELAY.contactLinks)}>
          <Flex className={s.contactLinks} align="center" gap={16}>
            {CONTACT_LINKS.map(({ href, label, external }) => (
              <Link
                key={label}
                href={href}
                external={external}
                variant="subtle"
                className={s.contactLink}
              >
                {label}
                <ArrowUpRight size={12} aria-hidden="true" />
              </Link>
            ))}
          </Flex>
        </motion.div>
      </div>
    </section>
  );
}
