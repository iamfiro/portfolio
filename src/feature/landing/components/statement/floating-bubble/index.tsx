import {
  motion,
  type MotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import IconBubble from "../../icon-bubble";
import { POP_SPRING, type StatementBubble } from "../statement.util";

import s from "./style.module.scss";

// 시차로 흘러가는 최대 거리(px). depth를 곱해 버블마다 다르게 움직인다
const DRIFT = 56;

interface Props {
  bubble: StatementBubble;
  /** 등장과 시차 이동에 함께 쓰는 실제 스크롤 진행도. 되감으면 버블도 쏙 들어간다 */
  progress: MotionValue<number>;
  /** 둥실거리는 박자를 버블마다 어긋나게 하는 순번 */
  index: number;
}

/** 정해진 진행도를 지나면 톡 튀어나와, 스크롤을 따라 천천히 흘러가는 버블 */
export default function FloatingBubble({ bubble, progress, index }: Props) {
  const { icon, tone, size, left, top, appearAt, depth } = bubble;

  const appear = useSpring(
    useTransform(progress, [appearAt, appearAt + 0.06], [0, 1]),
    POP_SPRING,
  );
  const rotate = useTransform(appear, [0, 1], [-30, 0]);
  const y = useTransform(progress, [0, 1], [DRIFT * depth, -DRIFT * depth]);

  return (
    <motion.div
      className={s.anchor}
      style={{ left, top, y, scale: appear, rotate }}
    >
      <IconBubble
        icon={icon}
        tone={tone}
        size={size}
        className={s.bob}
        style={{ animationDelay: `${index * -0.6}s` }}
      />
    </motion.div>
  );
}
