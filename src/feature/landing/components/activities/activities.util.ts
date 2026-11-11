import {
  Instagram,
  type LucideIcon,
  Newspaper,
  UsersRound,
} from "lucide-react";

import type { ActivityIconName } from "@/feature/home/components/activity/activity.type";

import type { BubbleTone } from "../icon-bubble/icon-bubble.type";

export const ACTIVITIES_HEADLINE_LINES = ["활동 리스트"];

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
