import {
  motion,
  type MotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import {
  DIM_OPACITY,
  POP_SPRING,
  type StatementHighlight,
  WORD_BLUR,
  WORD_RISE,
} from "../statement.util";

import s from "./style.module.scss";

interface Props {
  word: string;
  highlight: StatementHighlight;
  progress: MotionValue<number>;
  /** 이 단어가 채워지는 스크롤 구간 */
  range: [number, number];
}

/** 진해진 뒤 형광펜이 왼쪽부터 칠해지고, 모서리에 아이콘 스티커가 톡 붙는 핵심 단어 */
export default function HighlightWord({
  word,
  highlight,
  progress,
  range,
}: Props) {
  const [start, end] = range;
  const mid = start + (end - start) * 0.4;
  const { icon: Icon, tone } = highlight;

  const opacity = useTransform(progress, [start, mid], [DIM_OPACITY, 1]);
  const y = useTransform(progress, [start, mid], [WORD_RISE, "0em"]);
  const filter = useTransform(progress, [start, mid], [WORD_BLUR, "blur(0px)"]);
  const markerScale = useTransform(progress, [mid, end], [0, 1]);
  const iconPop = useSpring(
    useTransform(progress, [mid, end], [0, 1]),
    POP_SPRING,
  );
  const iconRotate = useTransform(iconPop, [0, 1], [-60, 12]);

  const chipClassName = [s.chip, s[tone]].filter(Boolean).join(" ");

  return (
    <>
      <motion.span className={chipClassName} style={{ opacity, y, filter }}>
        <motion.span
          className={s.marker}
          style={{ scaleX: markerScale }}
          aria-hidden
        />
        <motion.span
          className={s.icon}
          style={{ scale: iconPop, rotate: iconRotate }}
          aria-hidden
        >
          <Icon strokeWidth={2.6} />
        </motion.span>
        {word}
      </motion.span>{" "}
    </>
  );
}
