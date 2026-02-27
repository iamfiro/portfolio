import { Flex } from "@/shared/components/ui";

import HeroFlow from "../hero-flow";
import {
  IdeaCard,
  PersonCard,
  ProductCard,
  StackCard,
} from "../hero-flow/cards";

import s from "./style.module.scss";

export default function Hero() {
  return (
    <section className={s.hero}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        gap={16}
        className={s.content}
      >
        <h1 className={s.title}>just something that sounds cool</h1>
        <p className={s.description}>
          simply dummy text of the printing and typesetting industry
          <br />
          Lorem Ipsum has been the industry&apos;s standard dummy text
        </p>
      </Flex>

      <div className={s.shadow} />

      <HeroFlow className={s.heroFlow}>
        <HeroFlow.Source id="person" position={{ x: -500, y: -200 }}>
          <PersonCard />
        </HeroFlow.Source>

        <HeroFlow.Source id="idea" position={{ x: 100, y: -300 }}>
          <IdeaCard />
        </HeroFlow.Source>

        <HeroFlow.Source id="stack" position={{ x: 400, y: -80 }}>
          <StackCard />
        </HeroFlow.Source>

        <HeroFlow.Product id="product" position={{ x: 0, y: 180 }}>
          <ProductCard />
        </HeroFlow.Product>
      </HeroFlow>
    </section>
  );
}
