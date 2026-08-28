import { Trophy } from "lucide-react";

import { RelatedAward } from "@/feature/projects/schema";
import {
  Card,
  Flex,
  Heading,
  Image,
  MarkdownContent,
  Stack,
  Text,
} from "@/shared/components/ui";

import s from "./style.module.scss";

interface Props {
  award: RelatedAward;
}

export default function ProjectAwardCard({ award }: Props) {
  const formattedDate = new Date(award.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card variant="outlined" className={s.component}>
      <Flex gap={16} align="flex-start">
        {award.imageUrl ? (
          <Image src={award.imageUrl} alt={award.title} className={s.image} responsive />
        ) : (
          <Flex className={s.icon} align="center" justify="center">
            <Trophy size={24} aria-hidden="true" />
          </Flex>
        )}

        <Stack gap={8} className={s.content}>
          <Heading as="h3" size="lg" className={s.title}>
            {award.title}
          </Heading>
          <Text size="sm" color="subtle">
            {award.organization} · {formattedDate}
          </Text>
          {award.description ? (
            <MarkdownContent
              content={award.description}
              variant="compact"
              className={s.description}
            />
          ) : null}
        </Stack>
      </Flex>
    </Card>
  );
}
