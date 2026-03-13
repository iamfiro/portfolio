import { ArrowRight } from "lucide-react";

import { Button, Flex } from "@/shared/components/ui";

import s from "./style.module.scss";

export default function Hero() {
  return (
    <section className={s.hero}>
      <div className={s.bubbleContainer}>
        <img src="/me.png" alt="My Face" className={s.me} />
        <div className={s.bubble}>👋 Hi! Nice to meet you</div>
      </div>
      <h1 className={s.title}>
        Researching and building thoughtful services that solve everyday{" "}
        <b>problems</b>
      </h1>
      <p className={s.description}>
        Hi, I'm Sungju Cho, a Full-Stack developer studying software engineering
        at Sunrin Internet High School in South Korea. <br /> <br />I enjoy
        building practical services that solve real problems and turning ideas
        into working products. Through personal projects, I explore new
        technologies and create tools that people genuinely find useful.
      </p>
      <Flex gap={16} align="center" className={s.buttonContainer}>
        <Button variant="primary" size="md" rightIcon={<ArrowRight />}>
          Contact me
        </Button>
        <Button variant="secondary" size="md">
          Book an into call
        </Button>
      </Flex>
    </section>
  );
}
