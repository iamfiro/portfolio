import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes } from "react";

import { Box } from "@/shared/components/ui";

import type { BubbleSize, BubbleTone } from "./icon-bubble.type";

import s from "./style.module.scss";

interface Props extends HTMLAttributes<HTMLElement> {
  icon: LucideIcon;
  tone: BubbleTone;
  size?: BubbleSize;
}

/** 파스텔 원 안에 진한 아이콘이 든 장식용 버블 */
export default function IconBubble({
  icon: Icon,
  tone,
  size = "md",
  className,
  ...props
}: Props) {
  const bubbleClassName = [s.bubble, s[size], s[tone], className]
    .filter(Boolean)
    .join(" ");

  return (
    <Box as="span" className={bubbleClassName} aria-hidden {...props}>
      <Icon className={s.icon} strokeWidth={2.6} />
    </Box>
  );
}
