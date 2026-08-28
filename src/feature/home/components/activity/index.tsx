import { Newspaper, UsersRound } from "lucide-react";

import {
  Card,
  Heading,
  Section,
  Stack,
  Text,
} from "@/shared/components/ui";

import type { Activity } from "./activity.type";

import s from "./style.module.scss";

const ACTIVITIES: Activity[] = [
  {
    id: "student-council",
    icon: UsersRound,
    title: "학생회",
    description:
      "학교 구성원들과 소통하며 다양한 행사를 기획하고 운영했습니다.",
    date: "2024 — 2025",
  },
  {
    id: "developer-interview",
    icon: Newspaper,
    title: "개발자 인터뷰",
    description: "개발과 서비스 제작에 대한 경험을 기사 인터뷰로 공유했습니다.",
    date: "2025",
  },
];

interface ActivityCardProps {
  activity: Activity;
}

function ActivityCard({ activity }: ActivityCardProps) {
  const ActivityIcon = activity.icon;

  return (
    <Card variant="elevated" className={s.card} p={0}>
      <Stack className={s.content} gap={4}>
        <Text as="p" className={s.cardTitle}>
          <ActivityIcon
            size={18}
            strokeWidth={1.8}
            className={s.icon}
            aria-hidden="true"
          />
          <Text as="span" className={s.titleText}>
            {activity.title}
          </Text>
        </Text>
        <Text size="md" color="subtle" className={s.description}>
          {activity.description}
        </Text>
      </Stack>
      <Text size="sm" color="subtle" className={s.date}>
        {activity.date}
      </Text>
    </Card>
  );
}

export default function Activity() {
  return (
    <Section className={s.activity} size="sm">
      <Heading as="h2" size="lg" className={s.title}>
        활동
      </Heading>
      <Stack className={s.list} gap={8}>
        {ACTIVITIES.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </Stack>
    </Section>
  );
}
