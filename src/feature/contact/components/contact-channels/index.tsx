import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  type LucideIcon,
  Mail,
} from "lucide-react";

import IconBubble from "@/feature/landing/components/icon-bubble";
import type { BubbleTone } from "@/feature/landing/components/icon-bubble/icon-bubble.type";
import { getRevealProps } from "@/feature/landing/utils/reveal.util";
import { Box, Link, Text } from "@/shared/components/ui";
import { LINK } from "@/shared/constants";

import s from "./style.module.scss";

interface Channel {
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
  tone: BubbleTone;
}

const CHANNELS: Channel[] = [
  {
    label: "Email",
    value: LINK.email,
    href: `mailto:${LINK.email}`,
    icon: Mail,
    tone: "yellow",
  },
  {
    label: "GitHub",
    value: "@iamfiro",
    href: LINK.github,
    icon: Github,
    tone: "purple",
  },
  {
    label: "LinkedIn",
    value: "Sungju Cho",
    href: LINK.linkedin,
    icon: Linkedin,
    tone: "blue",
  },
];

/** 폼 대신 바로 닿을 수 있는 연락 채널 타일 */
export default function ContactChannels() {
  return (
    <Box className={s.channels}>
      {CHANNELS.map((channel, index) => (
        <motion.div key={channel.label} {...getRevealProps(index * 0.06)}>
          <Link href={channel.href} external className={s.tile}>
            <IconBubble icon={channel.icon} tone={channel.tone} size="md" />
            <Box className={s.copy}>
              <Text as="span" className={s.label}>
                {channel.label}
              </Text>
              <Text as="span" className={s.value} truncate>
                {channel.value}
              </Text>
            </Box>
            <Box as="span" className={s.arrow} aria-hidden>
              <ArrowUpRight size={20} />
            </Box>
          </Link>
        </motion.div>
      ))}
    </Box>
  );
}
