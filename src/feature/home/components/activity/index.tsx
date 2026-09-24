import { motion, type MotionProps } from "framer-motion";
import { Instagram, Newspaper, UsersRound } from "lucide-react";

import { useHomeSectionAnimation } from "@/feature/home/hooks";
import {
  getHomeAnimationTransition,
  HOME_ANIMATION_HIDDEN,
  HOME_ANIMATION_VISIBLE,
} from "@/feature/home/utils/home-animation.util";
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
  instagram: Instagram,
};

interface ActivityCardProps {
  activity: Activity;
}

interface ActivityProps {
  titleMotionProps?: MotionProps;
  variant?: "home" | "page";
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

function PageActivity({
  titleMotionProps,
}: Pick<ActivityProps, "titleMotionProps">) {
  return (
    <Section className={s.activity} size="sm">
      <motion.div {...titleMotionProps}>
        <Heading as="h2" size="lg" className={s.title}>
          활동
        </Heading>
      </motion.div>
      <HoverPreview className={[s.list, s.timeline].filter(Boolean).join(" ")}>
        <Stack gap={24}>
          {contentActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </Stack>
      </HoverPreview>
    </Section>
  );
}

function HomeActivity() {
  const { complete, isVisible, ref } = useHomeSectionAnimation({
    id: "activity",
    order: 3,
  });

  return (
    <motion.div ref={ref}>
      <Section className={s.activity} size="sm">
        <motion.div
          initial={HOME_ANIMATION_HIDDEN}
          animate={isVisible ? HOME_ANIMATION_VISIBLE : HOME_ANIMATION_HIDDEN}
          transition={getHomeAnimationTransition()}
        >
          <Heading as="h2" size="lg" className={s.title}>
            활동
          </Heading>
        </motion.div>
        <HoverPreview className={s.list}>
          <Stack gap={20}>
            {contentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={HOME_ANIMATION_HIDDEN}
                animate={
                  isVisible ? HOME_ANIMATION_VISIBLE : HOME_ANIMATION_HIDDEN
                }
                transition={getHomeAnimationTransition(index + 1)}
                onAnimationComplete={
                  index === contentActivities.length - 1 ? complete : undefined
                }
              >
                <ActivityCard activity={activity} />
              </motion.div>
            ))}
          </Stack>
        </HoverPreview>
      </Section>
    </motion.div>
  );
}

export default function Activity({
  titleMotionProps,
  variant = "home",
}: ActivityProps) {
  if (variant === "page") {
    return <PageActivity titleMotionProps={titleMotionProps} />;
  }

  return <HomeActivity />;
}
