import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useRef, useState } from "react";

import { useLookAt } from "@/feature/landing/hooks/use-look-at";
import { useNearbyReaction } from "@/feature/landing/hooks/use-nearby-reaction";
import type { PointerEventSpot } from "@/feature/landing/hooks/use-pointer-activity";
import type { PointerPosition } from "@/feature/landing/hooks/use-pointer-position";

import Smiley from "../../smiley";
import { resolveMood } from "../../smiley/smiley.util";
import type { SectionMascotSpot } from "../section-mascots.type";
import { toSpotStyle } from "../section-mascots.util";

import s from "./style.module.scss";

const LOOK_REACH = 7;
const DIZZY_DURATION = 2600;
const STARTLE_DURATION = 750;
const POP_SPRING = { type: "spring", stiffness: 260, damping: 13 } as const;
const PRESS_SPRING = { type: "spring", stiffness: 500, damping: 14 } as const;

// 깨어 있으면 둥실, 잠들면 숨 쉬듯, 어지러우면 휘청
const BODY_VARIANTS: Variants = {
  rest: (index: number) => ({
    y: [0, -6, 0],
    rotate: 0,
    scaleY: 1,
    transition: {
      y: {
        duration: 2.4 + (index % 3) * 0.4,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  }),
  sleepy: {
    y: 0,
    rotate: 0,
    scaleY: [1, 0.95, 1],
    transition: {
      scaleY: { duration: 3.2, ease: "easeInOut", repeat: Infinity },
    },
  },
  dizzy: {
    y: 0,
    scaleY: 1,
    rotate: [0, -14, 11, -8, 5, -2, 0],
    transition: {
      rotate: { duration: 1.1, ease: "easeInOut", repeat: Infinity },
    },
  },
};

interface Props {
  spot: SectionMascotSpot;
  index: number;
  pointer: PointerPosition;
  sleepy: boolean;
  startle: PointerEventSpot | null;
  shake: PointerEventSpot | null;
}

/** 보이면 톡 튀어나와 둥실거리고, 포인터를 바라보며 저마다 반응하는 스마일 */
export default function SectionMascot({
  spot,
  index,
  pointer,
  sleepy,
  startle,
  shake,
}: Props) {
  const { shape, tone, face, rotate, size, hideOnMobile } = spot;
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const dizzy = useNearbyReaction(ref, shake, DIZZY_DURATION);
  const startled = useNearbyReaction(ref, startle, STARTLE_DURATION);

  const mood = resolveMood({
    dizzy,
    dragging: pressed,
    hovered,
    startled,
    sleepy,
  });
  const look = useLookAt(ref, pointer, {
    reach: reducedMotion || dizzy || sleepy ? 0 : LOOK_REACH,
    rotate,
  });
  const moving = mood === "dizzy" || mood === "sleepy" ? mood : "rest";
  const bodyState = reducedMotion ? undefined : moving;

  const shown = inView || !!reducedMotion;
  const mascotClassName = [s.mascot, s[size], hideOnMobile && s.hideOnMobile]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      className={mascotClassName}
      style={toSpotStyle(spot)}
      initial={reducedMotion ? false : { scale: 0, rotate: rotate - 30 }}
      animate={shown ? { scale: 1, rotate } : { scale: 0, rotate: rotate - 30 }}
      transition={{ ...POP_SPRING, delay: 0.15 + index * 0.12 }}
    >
      <motion.div
        ref={ref}
        className={s.body}
        custom={index}
        variants={BODY_VARIANTS}
        animate={bodyState}
        whileHover={{ scale: 1.08, transition: PRESS_SPRING }}
        whileTap={{ scale: 0.84, transition: PRESS_SPRING }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onTapStart={() => setPressed(true)}
        onTap={() => setPressed(false)}
        onTapCancel={() => setPressed(false)}
      >
        <Smiley
          shape={shape}
          tone={tone}
          face={face}
          mood={mood}
          look={look}
          blinkDelay={2.6 + (index % 3) * 0.8}
        />
      </motion.div>
    </motion.div>
  );
}
