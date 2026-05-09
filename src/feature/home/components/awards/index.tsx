import { useCallback } from "react";

import { Flex, Heading, Section, Stack, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

interface Award {
  id: number;
  name: string;
  organization: string;
  year: number;
}

const AWARDS: Award[] = [
  {
    id: 1,
    name: "기능경기대회 모바일앱개발 부문 은상",
    organization: "한국산업인력공단",
    year: 2026,
  },
  {
    id: 2,
    name: "창의아이디어경진대회 수상",
    organization: "선린인터넷고등학교",
    year: 2025,
  },
  {
    id: 3,
    name: "선린톤 11th 은상",
    organization: "선린인터넷고등학교",
    year: 2025,
  },
  {
    id: 4,
    name: "동행 해커톤 창의재단이사장상",
    organization: "SW마이스터고연합",
    year: 2024,
  },
  {
    id: 5,
    name: "앱잼 27th 최우수상",
    organization: "선린인터넷고등학교",
    year: 2024,
  },
  {
    id: 6,
    name: "선린톤 10th 금상",
    organization: "선린인터넷고등학교",
    year: 2024,
  },
  {
    id: 7,
    name: "교내 천하제일코딩대회 은상",
    organization: "선린인터넷고등학교",
    year: 2024,
  },
];

function AwardCard({ name, organization, year }: Omit<Award, "id">) {
  return (
    <Flex className={s.card}>
      <Stack className={s.cardHeader}>
        <Heading as="h3" size="lg" className={s.cardTitle}>
          {name}
        </Heading>
        <Text size="md" color="subtle" className={s.cardOrganization}>
          {organization} - {year}
        </Text>
      </Stack>
    </Flex>
  );
}

export default function Awards() {
  const renderAward = useCallback(
    (award: Award) => (
      <AwardCard
        key={award.id}
        name={award.name}
        organization={award.organization}
        year={award.year}
      />
    ),
    [],
  );

  return (
    <Section className={s.awards}>
      <Heading as="h2" size="3xl" className={s.title}>
        Awards
      </Heading>

      <Stack className={s.list}>
        {AWARDS.map(renderAward)}
      </Stack>
    </Section>
  );
}
