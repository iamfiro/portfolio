import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useRef, useState } from "react";

import { useLookAt } from "@/feature/landing/hooks/use-look-at";
import { useNearbyReaction } from "@/feature/landing/hooks/use-nearby-reaction";
import type { PointerEventSpot } from "@/feature/landing/hooks/use-pointer-activity";
import type { PointerPosition } from "@/feature/landing/hooks/use-pointer-position";

import Smiley from "../../smiley";
import { resolveMood } from "../../smiley/smiley.util";
import type { HeroBlob } from "../hero.type";
import { toPlacementStyle } from "../hero.util";

import s from "./style.module.scss";

// 얼굴이 포인터 쪽으로 옮겨 가는 최대 거리(viewBox 단위)
const LOOK_REACH = 7;
const DIZZY_DURATION = 2600;
const STARTLE_DURATION = 750;

interface DropCustom {
  rotate: number;
  index: number;
}

// 위에서 떨어져 통통 튀며 제자리에 내려앉는다
const DROP_VARIANTS: Variants = {
  hidden: ({ rotate }: DropCustom) => ({ y: "-120vh", rotate: rotate - 40 }),
  shown: ({ rotate, index }: DropCustom) => ({
    y: 0,
    rotate,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 11,
      mass: 1.1,
      delay: 0.2 + index * 0.08,
    },
  }),
};

const GESTURE_SPRING = { type: "spring", stiffness: 420, damping: 16 } as const;

const BODY_VARIANTS: Variants = {
  rest: {
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
    transition: GESTURE_SPRING,
  },
  // 숨 쉬듯 천천히 오르내린다
  sleepy: {
    scaleY: [1, 0.96, 1],
    rotate: 0,
    transition: { duration: 3.2, ease: "easeInOut", repeat: Infinity },
  },
  // 고개를 휘청휘청 가누지 못한다
  dizzy: {
    rotate: [0, -14, 11, -8, 5, -2, 0],
    transition: { duration: 1.1, ease: "easeInOut", repeat: Infinity },
  },
  grin: { scale: 1.05, transition: GESTURE_SPRING },
  squash: { scaleX: 1.1, scaleY: 0.9, transition: GESTURE_SPRING },
  lift: { scale: 1.1, transition: GESTURE_SPRING },
};

interface Props {
  blob: HeroBlob;
  /** 떨어지는 순서와 깜빡임 박자를 어긋나게 하는 순번 */
  index: number;
  pointer: PointerPosition;
  ready: boolean;
  /** 마우스로 집어 던질 수 있는지. 터치에선 스크롤을 막지 않도록 끈다 */
  draggable: boolean;
  /** 포인터가 한동안 멈춰 다 같이 조는 중인지 */
  sleepy: boolean;
  /** 가까이서 휙 지나가면 놀란다 */
  startle: PointerEventSpot | null;
  /** 가까이서(혹은 붙잡고) 마구 흔들면 어지러워한다 */
  shake: PointerEventSpot | null;
}

/**
 * 히어로에 쌓이는 스마일 덩어리. 포인터를 바라보고, 가리키면 웃고,
 * 휙 지나가면 놀라고, 흔들면 어지러워하고, 가만두면 존다
 */
export default function SmileyBlob({
  blob,
  index,
  pointer,
  ready,
  draggable,
  sleepy,
  startle,
  shake,
}: Props) {
  const { shape, tone, face, rotate } = blob;
  const reducedMotion = useReducedMotion();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dizzy = useNearbyReaction(bodyRef, shake, DIZZY_DURATION);
  const startled = useNearbyReaction(bodyRef, startle, STARTLE_DURATION);

  const mood = resolveMood({ dizzy, dragging, hovered, startled, sleepy });
  const bodyState =
    reducedMotion || (mood !== "dizzy" && mood !== "sleepy") ? "rest" : mood;

  const look = useLookAt(bodyRef, pointer, {
    reach: reducedMotion || dizzy || sleepy ? 0 : LOOK_REACH,
    rotate,
  });

  const blobClassName = [s.blob, dragging && s.lifted]
    .filter(Boolean)
    .join(" ");
  const bodyClassName = [s.body, draggable && s.draggable]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      className={blobClassName}
      style={toPlacementStyle(blob)}
      custom={{ rotate, index }}
      variants={DROP_VARIANTS}
      initial={reducedMotion ? false : "hidden"}
      animate={ready || reducedMotion ? "shown" : "hidden"}
    >
      <motion.div
        ref={bodyRef}
        className={bodyClassName}
        variants={BODY_VARIANTS}
        initial="rest"
        animate={bodyState}
        whileHover="grin"
        whileTap="squash"
        whileDrag="lift"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        drag={draggable}
        dragSnapToOrigin
        dragElastic={0.5}
        dragTransition={{ bounceStiffness: 240, bounceDamping: 12 }}
        onDragStart={() => setDragging(true)}
        onDragTransitionEnd={() => setDragging(false)}
      >
        <Smiley
          shape={shape}
          tone={tone}
          face={face}
          mood={mood}
          look={look}
          blinkDelay={2.4 + (index % 4) * 0.9}
        />
      </motion.div>
    </motion.div>
  );
}
