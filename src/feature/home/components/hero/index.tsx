import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getKstTimeLabel } from "@/feature/home/utils";
import { HStack, Typo, VStack } from "@/shared/components/ui";
import { LINK } from "@/shared/constants";

import s from "./style.module.scss";

export default function Hero() {
  const [label, setLabel] = useState<string>(getKstTimeLabel());
  const sameTimeZone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Seoul";
    } catch {
      return false;
    }
  }, []);

  const nextTickMs = useMemo(() => {
    const now = new Date();
    return (60 - now.getSeconds()) * 1000 + (1000 - now.getMilliseconds());
  }, []);

  useEffect(() => {
    setLabel(getKstTimeLabel());

    const startTimeout = setTimeout(() => {
      setLabel(getKstTimeLabel());
      const interval = setInterval(() => {
        setLabel(getKstTimeLabel());
      }, 60 * 1000);
      return () => clearInterval(interval);
    }, nextTickMs);

    return () => {
      clearTimeout(startTimeout as unknown as number);
    };
  }, [nextTickMs]);

  return (
    <section
      className={s.hero}
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      <HStack fullWidth>
        <header className={s.header}>
          <img src="logo.svg" alt="logo" width={190} />
          <ul className={s.link}>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/" data-active={false}>
                About
              </a>
            </li>
            <li>
              <a href="/" data-active={false}>
                Projects
              </a>
            </li>
            <li>
              <a href="/" data-active={false}>
                Blog
              </a>
            </li>
          </ul>
          <ul className={s.link}>
            <Typo.Body>Social</Typo.Body>
            <li>
              <a
                href={LINK.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a href={LINK.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={LINK.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
          </ul>
          <VStack gap={4} className={s.locationWrapper}>
            <Typo.Body className={s.location}>Seoul, Korea {label}</Typo.Body>
            <Typo.Caption>
              {sameTimeZone ? "Same time zone!" : "in local time"}
            </Typo.Caption>
          </VStack>
          <a href={`mailto:${LINK.email}`} className={s.email}>
            <Typo.BodyLarge>
              ( Let's Talk <ArrowRight /> )
            </Typo.BodyLarge>
          </a>
        </header>
      </HStack>
      <HStack className={s.letter}>
        <Typo.Body>Place where well-crafted service are born.</Typo.Body>
        <Typo.Body>ⓒ 2025. Cho Sungju All rights reserved.</Typo.Body>
      </HStack>
      <HStack fullWidth>
        <h1 className={s.title}>
          Turning <b>Ideas</b> into
          <br />
          Digital Reality
        </h1>
      </HStack>
    </section>
  );
}
