import { Newspaper, UsersRound } from "lucide-react";

import {
  Flex,
  Heading,
  HoverPreview,
  HoverPreviewTrigger,
  Link,
  Section,
  Stack,
  Text,
} from "@/shared/components/ui";
import { contentActivities } from "@/shared/content/content";

import type { Activity, ActivityIconName } from "./activity.type";

import s from "./style.module.scss";

const ACTIVITY_ICONS: Record<ActivityIconName, typeof UsersRound> = {
  "users-round": UsersRound,
  newspaper: Newspaper,
};

interface ActivityCardProps {
  activity: Activity;
}

function ActivityCard({ activity }: ActivityCardProps) {
  const ActivityIcon = ACTIVITY_ICONS[activity.icon];
  const itemContent = (
    <>
      <Text as="p" className={s.content}>
        <Text as="span" className={s.titleRow}>
          <ActivityIcon
            size={16}
            strokeWidth={1.8}
            className={s.icon}
            aria-hidden="true"
          />
          <Text as="span" className={s.cardTitle}>
            {activity.title}
          </Text>
        </Text>
        <Text as="span" size="sm" color="subtle" className={s.description}>
          {activity.description}
        </Text>
      </Text>
      <Text size="sm" color="subtle" className={s.date}>
        {activity.date}
      </Text>
    </>
  );

  if (activity.href) {
    return (
      <HoverPreviewTrigger
        className={s.trigger}
        preview={{
          title: activity.title,
          subtext: activity.href,
          subtextHref: activity.href,
        }}
      >
        <Link
          href={activity.href}
          external
          className={[s.item, s.linkedItem].filter(Boolean).join(" ")}
        >
          {itemContent}
        </Link>
      </HoverPreviewTrigger>
    );
  }

  return (
    <Flex className={s.item} align="baseline" gap={12}>
      {itemContent}
    </Flex>
  );
}

export default function Activity() {
  return (
    <Section className={s.activity} size="sm">
      <Heading as="h2" size="lg" className={s.title}>
        활동
      </Heading>
      <HoverPreview className={s.list}>
        <Stack gap={20}>
          {contentActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </Stack>
      </HoverPreview>
    </Section>
  );
}
