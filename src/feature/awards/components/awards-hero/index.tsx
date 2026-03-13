import { Flex, Heading, Image, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

export default function AwardsHero() {
  return (
    <section className={s.hero}>
      <Flex gap={8} align="flex-end" className={s.bubbleContainer}>
        <Image
          src="/me.png"
          alt="My Face"
          className={s.me}
          width={42}
          height={42}
          rounded
        />
        <Text as="span" className={s.bubble}>
          🏆 Awards & Honors
        </Text>
      </Flex>

      <Heading as="h1" className={s.title}>
        Recognition and milestones from building meaningful <b>products</b>
      </Heading>

      <Text as="p" className={s.description}>
        A collection of awards and achievements earned through competitions,
        hackathons, and project showcases. Each one represents a step forward in
        solving real-world problems through technology.
      </Text>
    </section>
  );
}
