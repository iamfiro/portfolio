import { motion, type MotionValue, useTransform } from "framer-motion";

import { DIM_OPACITY, WORD_BLUR, WORD_RISE } from "../statement.util";

import s from "./style.module.scss";

interface Props {
  word: string;
  progress: MotionValue<number>;
  /** 이 단어가 채워지는 스크롤 구간 */
  range: [number, number];
}

/** 흐릿하게 가라앉아 있다가 진해지며 제자리로 떠오르는 단어 */
export default function ScrollWord({ word, progress, range }: Props) {
  const opacity = useTransform(progress, range, [DIM_OPACITY, 1]);
  const y = useTransform(progress, range, [WORD_RISE, "0em"]);
  const filter = useTransform(progress, range, [WORD_BLUR, "blur(0px)"]);

  // 띄어쓰기를 span 밖에 둬야 복사·스크린리더에서 단어가 붙지 않는다
  return (
    <>
      <motion.span className={s.word} style={{ opacity, y, filter }}>
        {word}
      </motion.span>{" "}
    </>
  );
}
