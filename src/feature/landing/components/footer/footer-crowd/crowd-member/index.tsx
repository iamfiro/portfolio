import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useRef, useState } from "react";

import { useLookAt } from "@/feature/landing/hooks/use-look-at";
import { useNearbyReaction } from "@/feature/landing/hooks/use-nearby-reaction";
import type { PointerEventSpot } from "@/feature/landing/hooks/use-pointer-activity";
import type { PointerPosition } from "@/feature/landing/hooks/use-pointer-position";

import Smiley from "../../../smiley";
import { resolveMood } from "../../../smiley/smiley.util";
import type { CrowdMember as CrowdMemberData } from "../../footer.util";

import s from "./style.module.scss";

const LOOK_REACH = 7;
const DIZZY_DURATION = 2600;

// 바닥 아래 숨어 있다가 → 차례로 고개를 내밀고 → 가리키면 쑥 올라와 인사한다
const PEEK_VARIANTS: Variants = {
  hidden: { y: "100%" },
  peek: (index: number) => ({
    y: "42%",
    transition: {
      type: "spring",
      stiffness: 220,
      damping: 14,
      delay: 0.1 + index * 0.08,
    },
  }),
  raised: {
    y: "12%",
    transition: { type: "spring", stiffness: 320, damping: 15 },
  },
};

interface Props {
  member: CrowdMemberData;
  index: number;
  inView: boolean;
  pointer: PointerPosition;
  sleepy: boolean;
  shake: PointerEventSpot | null;
}

export default function CrowdMember({
  member,
  index,
  inView,
  pointer,
  sleepy,
  shake,
}: Props) {
  const { shape, tone, face, rotate, size, hideOnMobile } = member;
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const dizzy = useNearbyReaction(ref, shake, DIZZY_DURATION);

  const mood = resolveMood({ dizzy, hovered, sleepy });
  const look = useLookAt(ref, pointer, {
    reach: reducedMotion || dizzy || sleepy ? 0 : LOOK_REACH,
    rotate,
  });

  const shown = inView || !!reducedMotion;
  const peek = hovered ? "raised" : "peek";
  const memberClassName = [s.member, s[size], hideOnMobile && s.hideOnMobile]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      ref={ref}
      className={memberClassName}
      style={{ rotate }}
      custom={index}
      variants={PEEK_VARIANTS}
      initial={reducedMotion ? false : "hidden"}
      animate={shown ? peek : "hidden"}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Smiley
        shape={shape}
        tone={tone}
        face={face}
        mood={mood}
        look={look}
        blinkDelay={2.4 + (index % 4) * 0.7}
      />
    </motion.div>
  );
}
