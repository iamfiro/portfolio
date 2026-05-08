import {
  Flex,
  Heading,
  Section,
  Stack,
  Text,
} from "@/shared/components/ui";

import s from "./style.module.scss";

export default function About() {
  return (
    <Section className={s.about} size="md">
      <Flex className={s.split}>
        <Stack gap={4} className={s.label}>
          <Text size="sm" color="subtle" className={s.labelText}>
            About
          </Text>
          <Text size="sm" color="subtle" className={s.labelText}>
            2019 — Present
          </Text>
        </Stack>

        <Heading as="h2" size="3xl" className={s.statement}>
          디지털 경험의 결을 다듬는 프론트엔드 개발자입니다. 픽셀 단위의
          디테일과 자연스러운 인터랙션에 집착하며, 사용자가 의식하지 못할 만큼
          매끄러운 인터페이스를 설계합니다. 기술과 감각의 교차점에서 사람들이
          진심으로 좋아하는 제품을 만듭니다.
        </Heading>
      </Flex>

      <Flex className={s.detail}>
        <Stack gap={4} className={s.label}>
          <Text size="sm" color="subtle" className={s.labelText}>
            전문 분야
          </Text>
        </Stack>

        <Text as="p" size="lg" className={s.description}>
          UI/UX Engineering과 Design System 구축을 중심으로, Interactive Web
          경험과 Performance Optimization에 깊은 관심을 두고 있습니다. 컴포넌트
          설계부터 모션 디자인까지, 인터페이스의 모든 레이어를 아우르며 일관되고
          정제된 사용자 경험을 만들어갑니다.
        </Text>
      </Flex>
    </Section>
  );
}
