import { motion } from "framer-motion";

import { LANDING_EASE } from "@/feature/landing/utils/reveal.util";
import { Box } from "@/shared/components/ui";

import s from "./style.module.scss";

interface Props {
  text: string;
  /** 재생이 시작됐는지 */
  isPlaying: boolean;
  /** 재생 시작 후 올라오기까지 기다리는 시간(초) */
  delay: number;
}

/** 아래에서 위로 마스크를 뚫고 올라오는 단어 하나 */
export default function RevealWord({ text, isPlaying, delay }: Props) {
  return (
    <Box as="span" className={s.mask}>
      <motion.span
        className={s.word}
        initial={{ y: "110%" }}
        animate={{ y: isPlaying ? "0%" : "110%" }}
        transition={{ duration: 0.9, ease: LANDING_EASE, delay }}
      >
        {text}
      </motion.span>
    </Box>
  );
}
