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
    name: "Creative Idea Competition – Award Winner",
    organization: "Ministry of Science and ICT",
    year: 2025,
  },
  {
    id: 2,
    name: "Sunrinthon 11th – Silver Prize",
    organization: "Seoul Startup Hub",
    year: 2024,
  },
  {
    id: 3,
    name: "Together Hackathon – Chairperson’s Award from the Creativity Foundation",
    organization: "Sunrin Internet High School",
    year: 2024,
  },
  {
    id: 4,
    name: "AppJam 27th – Grand Prize",
    organization: "Korea Information Technology Association",
    year: 2023,
  },
  {
    id: 5,
    name: "Sunrinthon 10th – Gold Prize",
    organization: "Korea Information Technology Association",
    year: 2023,
  },
  {
    id: 6,
    name: "School Coding Championship – Silver Prize",
    organization: "Korea Information Technology Association",
    year: 2023,
  },
];

function AwardCard({ name, organization, year }: Omit<Award, "id">) {
  return (
    <Flex className={s.card}>
      <Stack gap={12}>
        <Stack gap={4} className={s.cardHeader}>
          <Heading as="h3" size="lg" className={s.cardTitle}>
            {name}
          </Heading>
          <Text size="md" color="subtle" className={s.cardOrganization}>
            {organization} - {year}
          </Text>
        </Stack>
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

      <Stack gap={24} className={s.list}>
        {AWARDS.map(renderAward)}
      </Stack>
    </Section>
  );
}
