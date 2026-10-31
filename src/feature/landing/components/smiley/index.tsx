import { motion, type MotionValue, useReducedMotion } from "framer-motion";
import { useId } from "react";

import type {
  SmileyFace,
  SmileyMood,
  SmileyShape,
  SmileyTone,
} from "./smiley.type";
import {
  DIZZY_EYES,
  EYES_VARIANTS,
  MOUTH_VARIANTS,
  SLEEPING_EYE_VARIANTS,
  SLEEPING_EYES,
  SMILEY_EYES,
  SMILEY_SHAPES,
  SPIRAL_VARIANTS,
} from "./smiley.util";

import s from "./style.module.scss";

const BLINK_DURATION = 0.22;

interface Props {
  shape: SmileyShape;
  tone: SmileyTone;
  face: SmileyFace;
  mood?: SmileyMood;
  /** 얼굴 전체를 옮겨 시선을 돌리는 오프셋(viewBox 단위) */
  look?: { x: MotionValue<number>; y: MotionValue<number> };
  /** 눈 깜빡임 사이 쉬는 시간(초). 점 눈이 있고 깨어 있을 때만 깜빡인다 */
  blinkDelay?: number;
  className?: string;
}

/** 도형 위에 눈과 입을 얹은 스마일 드로잉. mood에 따라 표정이 바뀐다 */
export default function Smiley({
  shape,
  tone,
  face,
  mood = "rest",
  look,
  blinkDelay = 3,
  className,
}: Props) {
  const reducedMotion = useReducedMotion();
  const gradientId = `smiley-${useId().replace(/:/g, "")}`;
  const { d, height } = SMILEY_SHAPES[shape];
  const eyes = SMILEY_EYES[face];
  const blinks =
    !reducedMotion &&
    (mood === "rest" || mood === "grin") &&
    eyes.some(({ kind }) => kind === "dot");

  const smileyClassName = [s.smiley, s[tone], className]
    .filter(Boolean)
    .join(" ");

  return (
    // 디자인 시스템에 SVG 드로잉 추상화가 없어 도형과 표정은 svg로 직접 그린다
    <svg
      className={smileyClassName}
      viewBox={`0 0 100 ${height}`}
      aria-hidden
      focusable={false}
    >
      {tone === "sunset" && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" className={s.glow} />
            <stop offset="0.5" className={s.core} />
            <stop offset="1" className={s.glow} />
          </linearGradient>
        </defs>
      )}

      <path
        d={d}
        className={s.body}
        fill={tone === "sunset" ? `url(#${gradientId})` : undefined}
      />

      <motion.g style={look}>
        <motion.g variants={EYES_VARIANTS} initial={false} animate={mood}>
          <motion.g
            animate={blinks ? { scaleY: [1, 0.1, 1] } : { scaleY: 1 }}
            transition={
              blinks
                ? {
                    duration: BLINK_DURATION,
                    repeat: Infinity,
                    repeatDelay: blinkDelay,
                    delay: blinkDelay,
                  }
                : undefined
            }
          >
            {eyes.map((eye) =>
              eye.kind === "dot" ? (
                <circle
                  key={`${eye.cx}-${eye.cy}`}
                  className={s.dot}
                  cx={eye.cx}
                  cy={eye.cy}
                  r={4.6}
                />
              ) : (
                <path key={eye.d} className={s.stroke} d={eye.d} />
              ),
            )}
          </motion.g>
        </motion.g>
        {SLEEPING_EYES.map((eye) => (
          <motion.path
            key={eye}
            className={s.stroke}
            d={eye}
            variants={SLEEPING_EYE_VARIANTS}
            initial={false}
            animate={mood === "sleepy" ? "sleepy" : "awake"}
          />
        ))}
        {DIZZY_EYES.map((spiral) => (
          <motion.path
            key={spiral}
            className={s.spiral}
            d={spiral}
            variants={SPIRAL_VARIANTS}
            initial={false}
            animate={mood === "dizzy" ? "dizzy" : "rest"}
          />
        ))}
        <motion.path
          className={s.stroke}
          variants={MOUTH_VARIANTS}
          initial={false}
          animate={mood}
        />
      </motion.g>
    </svg>
  );
}
