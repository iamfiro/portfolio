import { motion, type Transition } from "framer-motion";

import { Image } from "@/shared/components/ui";

import type { ProcessLayout, ProcessStep } from "../process.type";
import { DECK_SCALE, deckPose, PROCESS_STEPS } from "../process.util";

import s from "./style.module.scss";

interface Props {
  step: ProcessStep;
  index: number;
  layout: ProcessLayout;
  /** 재생이 시작됐는지 */
  isPlaying: boolean;
  /** 재생 시작 후 덱을 떠나기까지 기다리는 시간(초) */
  launchAt: number;
}

// 덱에서 떠다니는 폭(px)과 한 번 오르내리는 시간(초). 타일마다 박자를 달리한다
const FLOAT_RANGE = 8;
const FLOAT_DURATION = 3.2;

// 날아가는 스프링. 감쇠를 적당히 줘서 칸에 닿을 때 가볍게 한 번만 톡 하고 멈춘다
const FLIGHT: Transition = {
  type: "spring",
  stiffness: 90,
  damping: 15,
  mass: 1,
};

/**
 * 위 화면 덱에 겹쳐 떠다니던 타일 하나.
 * 자기 구절이 올라오면 덱을 떠나 스프링으로 아래 문장 칸까지 날아가 착지한다.
 */
export default function ProcessTile({
  step,
  index,
  layout,
  isPlaying,
  launchAt,
}: Props) {
  const slot = layout.slots[index];
  const half = slot.size / 2;
  const deck = deckPose(index, PROCESS_STEPS.length, slot.size, layout.deck);

  const idle = {
    x: deck.x - half,
    y: [deck.y - half, deck.y - half - FLOAT_RANGE, deck.y - half],
    scale: DECK_SCALE,
    rotate: deck.rotate,
    transition: {
      y: {
        duration: FLOAT_DURATION + index * 0.35,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  const landed = {
    x: slot.x,
    y: slot.y,
    scale: 1,
    rotate: 0,
    transition: {
      ...FLIGHT,
      delay: launchAt,
      // 회전은 조금 더 늦게 풀려 날아가는 동안 기울어진 채 따라온다
      rotate: { ...FLIGHT, damping: 12, delay: launchAt + 0.05 },
    },
  };

  const Icon = step.icon;
  const tileClassName = [s.tile, step.imageUrl ? s.image : s[step.tone]]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      className={tileClassName}
      style={{
        width: slot.size,
        height: slot.size,
        zIndex: index,
      }}
      initial={{
        x: deck.x - half,
        y: deck.y - half,
        scale: DECK_SCALE,
        rotate: deck.rotate,
      }}
      animate={isPlaying ? landed : idle}
      aria-hidden
    >
      {step.imageUrl ? (
        <Image src={step.imageUrl} alt="" objectFit="contain" />
      ) : (
        <Icon className={s.icon} strokeWidth={2.2} />
      )}
    </motion.div>
  );
}
