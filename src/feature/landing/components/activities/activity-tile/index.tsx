import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { Activity } from "@/feature/home/components/activity/activity.type";
import { getRevealProps } from "@/feature/landing/utils/reveal.util";
import { Box, Link, Text } from "@/shared/components/ui";

import IconBubble from "../../icon-bubble";
import { ACTIVITY_VISUALS } from "../activities.util";

import s from "./style.module.scss";

interface Props {
  activity: Activity;
  index: number;
}

export default function ActivityTile({ activity, index }: Props) {
  const { icon, tone } = ACTIVITY_VISUALS[activity.icon];

  const body = (
    <>
      <Box className={s.top}>
        <IconBubble icon={icon} tone={tone} size="md" />
        {activity.href && (
          <Box as="span" className={s.external} aria-hidden>
            <ArrowUpRight size={20} />
          </Box>
        )}
      </Box>
      <Box className={s.copy}>
        <Text as="span" className={s.title}>
          {activity.title}
        </Text>
        <Text as="span" className={s.date}>
          {activity.date}
        </Text>
      </Box>
    </>
  );

  return (
    // 두 열이 번갈아 살짝 늦게 떠오르게 한다
    <motion.div {...getRevealProps((index % 2) * 0.08)}>
      {activity.href ? (
        <Link href={activity.href} external className={s.tile}>
          {body}
        </Link>
      ) : (
        <Box className={s.tile}>{body}</Box>
      )}
    </motion.div>
  );
}
