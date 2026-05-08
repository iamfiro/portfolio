import { ArrowRight } from "lucide-react";

import { Button, Flex } from "@/shared/components/ui";

import s from "./style.module.scss";

export default function Hero() {
  return (
    <section className={s.hero}>
      <div className={s.content}>
        <div className={s.bubbleContainer}>
          <img src="/me.png" alt="My Face" className={s.me} />
          <div className={s.bubble}>👋 Hi! Nice to meet you</div>
        </div>
        <h1 className={s.title}>
          Researching and building thoughtful<br/>services that solve everyday{" "}
          <b>problems</b>
        </h1>
        <p className={s.description}>
          Full-Stack developer studying software engineering at Sunrin Internet
          High School.<br/>I build practical services that solve real problems.
        </p>
      </div>
      <Flex gap={16} align="center" className={s.buttonContainer}>
        <Button variant="primary" size="md" rightIcon={<ArrowRight />}>
          Contact me
        </Button>
      </Flex>
    </section>
  );
}
