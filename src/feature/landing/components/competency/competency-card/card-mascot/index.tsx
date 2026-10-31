import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";

import { useLookAt } from "@/feature/landing/hooks/use-look-at";
import { useNearbyReaction } from "@/feature/landing/hooks/use-nearby-reaction";
import type { PointerEventSpot } from "@/feature/landing/hooks/use-pointer-activity";
import type { PointerPosition } from "@/feature/landing/hooks/use-pointer-position";

import Smiley from "../../../smiley";
import { resolveMood } from "../../../smiley/smiley.util";
import type { CompetencyMascot } from "../../competency.util";

import s from "./style.module.scss";

const LOOK_REACH = 6;
const DIZZY_DURATION = 2600;

// 무대 아래에 숨어 있다가 → 보이면 고개를 내밀고 → 카드를 가리키면 쑥 올라온다
const PEEK_VARIANTS = {
  hidden: { y: "100%" },
  peek: { y: "30%" },
  raised: { y: "6%" },
};

const PEEK_SPRING = { type: "spring", stiffness: 260, damping: 15 } as const;

interface Props {
  mascot: CompetencyMascot;
  pointer: PointerPosition;
  inView: boolean;
  hovered: boolean;
  sleepy: boolean;
  shake: PointerEventSpot | null;
  index: number;
}

/** 무대 아래 모서리에서 고개를 내밀고 포인터를 바라보는 스마일 */
export default function CardMascot({
  mascot,
  pointer,
  inView,
  hovered,
  sleepy,
  shake,
  index,
}: Props) {
  const { shape, tone, face, rotate, side } = mascot;
  const mascotClassName = [s.mascot, s[side]].filter(Boolean).join(" ");
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const dizzy = useNearbyReaction(ref, shake, DIZZY_DURATION);

  const mood = resolveMood({ dizzy, hovered, sleepy });
  const look = useLookAt(ref, pointer, {
    reach: reducedMotion || dizzy || sleepy ? 0 : LOOK_REACH,
    rotate,
  });

  const peek = hovered ? "raised" : "peek";

  return (
    <motion.div
      ref={ref}
      className={mascotClassName}
      style={{ rotate }}
      variants={PEEK_VARIANTS}
      initial={reducedMotion ? false : "hidden"}
      animate={inView || reducedMotion ? peek : "hidden"}
      transition={{ ...PEEK_SPRING, delay: hovered ? 0 : 0.3 + index * 0.1 }}
    >
      <Smiley
        shape={shape}
        tone={tone}
        face={face}
        mood={mood}
        look={look}
        blinkDelay={2.8 + index}
      />
    </motion.div>
  );
}
