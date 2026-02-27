import { Flex } from "@/shared/components/ui";
import s from "./style.module.scss";

export default function Hero() {
  return (
    <section className={s.hero}>
      <Flex direction="column" align="center" justify="center" gap={16} className={s.content}>
        <h1 className={s.title}>just something that sounds cool</h1>
        <p className={s.description}>simply dummy text of the printing and typesetting industry <br />
        Lorem Ipsum has been the industry's standard dummy text</p>
      </Flex>
    </section>
  );
}
