import { useCallback } from "react";

import {
  Badge,
  Card,
  Heading,
  Section,
  Stack,
  Text,
} from "@/shared/components/ui";

import s from "./style.module.scss";

interface Award {
  id: number;
  name: string;
  organization: string;
  year: string;
  description: string;
}

const AWARDS: Award[] = [
  {
    id: 1,
    name: "Grand Prize, National Software Competition",
    organization: "Ministry of Science and ICT",
    year: "2025",
    description:
      "Awarded first place for developing an AI-powered accessibility tool that helps visually impaired users navigate web content more effectively.",
  },
  {
    id: 2,
    name: "Best Innovation Award",
    organization: "Seoul Startup Hub",
    year: "2024",
    description:
      "Recognized for building a real-time collaboration platform that streamlines team workflows for remote development teams.",
  },
  {
    id: 3,
    name: "Excellence Award, Sunrin Hackathon",
    organization: "Sunrin Internet High School",
    year: "2024",
    description:
      "Built a community-driven platform connecting local businesses with student developers to solve everyday operational challenges.",
  },
  {
    id: 4,
    name: "Silver Prize, Creative IT Challenge",
    organization: "Korea Information Technology Association",
    year: "2023",
    description:
      "Developed a smart scheduling service that uses machine learning to optimize study plans based on individual learning patterns.",
  },
];

function AwardCard({
  name,
  organization,
  year,
  description,
}: Omit<Award, "id">) {
  return (
    <Card variant="outlined" p={24} className={s.card}>
      <Stack gap={12}>
        <Stack gap={8} className={s.cardHeader}>
          <Heading as="h3" size="lg" className={s.cardTitle}>
            {name}
          </Heading>
          <Text size="md" color="subtle" className={s.cardOrganization}>
            {organization}
          </Text>
        </Stack>
        <Badge variant="primary" size="md">
          {year}
        </Badge>
        <Text size="md" className={s.cardDescription}>
          {description}
        </Text>
      </Stack>
    </Card>
  );
}

export default function AwardsList() {
  const renderAward = useCallback(
    (award: Award) => (
      <AwardCard
        key={award.id}
        name={award.name}
        organization={award.organization}
        year={award.year}
        description={award.description}
      />
    ),
    [],
  );

  return (
    <Section className={s.awards} size="md">
      <Heading as="h2" size="3xl" className={s.title}>
        Awards
      </Heading>

      <Stack gap={24} className={s.list}>
        {AWARDS.map(renderAward)}
      </Stack>
    </Section>
  );
}
