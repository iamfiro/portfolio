import {
  Instagram,
  type LucideIcon,
  Newspaper,
  UsersRound,
} from "lucide-react";

import type { ActivityIconName } from "@/feature/home/components/activity/activity.type";

import type { BubbleTone } from "../icon-bubble/icon-bubble.type";

export const ACTIVITIES_HEADLINE_LINES = [
  "코드 밖에서도",
  "이야기를 나눠 왔어요",
];

interface ActivityVisual {
  icon: LucideIcon;
  tone: BubbleTone;
}

/** 활동 종류마다 버블 아이콘과 파스텔 톤을 짝지어 둔다 */
export const ACTIVITY_VISUALS: Record<ActivityIconName, ActivityVisual> = {
  newspaper: { icon: Newspaper, tone: "blue" },
  instagram: { icon: Instagram, tone: "pink" },
  "users-round": { icon: UsersRound, tone: "green" },
};
