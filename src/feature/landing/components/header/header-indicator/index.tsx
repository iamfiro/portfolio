import { AnimatePresence, motion } from "framer-motion";

import { LANDING_EASE } from "@/feature/landing/utils/reveal.util";

import type { IndicatorRect } from "./header-indicator.type";

import s from "./style.module.scss";

interface Props {
  rect: IndicatorRect | null;
}

const MOVE = { duration: 0.5, ease: LANDING_EASE };
const REVEAL = { duration: 0.45, ease: LANDING_EASE };

/**
 * 헤더 링크 뒤에 깔리는 박스 하나.
 * 처음엔 아래에서 차오르고, 다른 링크로 옮기면 그 자리로 미끄러지고, 닫힐 땐 위로 접힌다.
 */
export default function HeaderIndicator({ rect }: Props) {
  return (
    <AnimatePresence>
      {rect && (
        <motion.span
          className={s.indicator}
          initial={{ ...rect, scaleY: 0, originY: 1 }}
          animate={{ ...rect, scaleY: 1, originY: 1 }}
          exit={{
            scaleY: 0,
            originY: 0,
            transition: { scaleY: REVEAL, originY: { duration: 0 } },
          }}
          transition={{
            x: MOVE,
            y: MOVE,
            width: MOVE,
            height: MOVE,
            scaleY: REVEAL,
          }}
          aria-hidden
        />
      )}
    </AnimatePresence>
  );
}
