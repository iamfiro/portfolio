import { Flex, Heading, Image, Section, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

const MAIN_DESCRIPTION =
  "NIO Inc. is a pioneer and a leading manufacturer of premium smart electric vehicles in China. Founded in November 2014, NIO designs, develops, jointly manufactures and sells premium smart electric vehicles, driving innovations in next-generation technologies in autonomous driving, digital technologies, electric powertrains and batteries.";

const SUB_DESCRIPTION =
  "NIO is committed to a more environmentally friendly future in which improved smart electric car technologies, coupled with a better car ownership experience, will drive increased appreciation and adoption of smart electric cars, leading to a more sustainable future for the planet.";

export default function About() {
  return (
    <Section className={s.aboutSection} size="lg">
      <Flex
        className={s.layout}
        align="flex-start"
        justify="space-between"
        gap={64}
      >
        <Flex direction="column" className={s.leftColumn} gap={40}>
          <Image
            src="/sample_thumbnail.png"
            alt="About project visual"
            className={s.coverImage}
          />

          <Flex className={s.metaGrid} gap={48}>
            <Flex direction="column" gap={8}>
              <Text size="sm" color="subtle" className={s.metaLabel}>
                Role
              </Text>
              <Text size="lg" weight="medium" className={s.metaValue}>
                Art Director
                <br />
                UX/UI Designer
              </Text>
            </Flex>

            <Flex direction="column" gap={8}>
              <Text size="sm" color="subtle" className={s.metaLabel}>
                Date
              </Text>
              <Text size="lg" weight="medium" className={s.metaValue}>
                2023
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Flex direction="column" className={s.rightColumn} gap={64}>
          <Heading as="h2" size="4xl" className={s.mainText}>
            {MAIN_DESCRIPTION}
          </Heading>

          <Text size="xl" color="subtle" className={s.subText}>
            {SUB_DESCRIPTION}
          </Text>
        </Flex>
      </Flex>
    </Section>
  );
}
