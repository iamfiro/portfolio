import { Heading, Section, Stack, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

const SUB_DESCRIPTION =
  "NIO is committed to a more environmentally friendly future in which improved smart electric car technologies, coupled with a better car ownership experience, will drive increased appreciation and adoption of smart electric cars, leading to a more sustainable future for the planet.";

export default function About() {
  return (
    <Section className={s.about} size="md">
      <Heading as="h2" size="3xl" className={s.title}>
        About
      </Heading>

      <Stack gap={16} className={s.descriptionGroup}>
        <Text size="xl" weight="medium" className={s.description}>
          NIO Inc. is a pioneer and a leading manufacturer of premium smart
          electric vehicles in China. <b>Founded in November 2014</b>, NIO
          designs, develops, jointly manufactures and sells premium smart
          electric vehicles, driving innovations in next-generation technologies
          in autonomous driving, digital technologies, electric powertrains and
          batteries.
        </Text>
        <Text size="xl" weight="medium" className={s.description}>
          {SUB_DESCRIPTION}
        </Text>
      </Stack>
      <img src="/images/home/field.jpg" alt="Green feild" className={s.image} />
    </Section>
  );
}
