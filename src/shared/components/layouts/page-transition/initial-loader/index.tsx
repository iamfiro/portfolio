import { AnimatePresence, motion } from "framer-motion";

import s from "./style.module.scss";

interface Props {
  progress: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;

function RollingDigit({ digit }: { digit: number }) {
  return (
    <div className={s.digitWrapper}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={digit}
          className={s.digit}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default function InitialLoader({ progress }: Props) {
  const clamped = Math.min(Math.max(progress, 0), 100);
  const hundreds = clamped === 100 ? 1 : null;
  const tens = clamped === 100 ? 0 : Math.floor(clamped / 10);
  const ones = clamped % 10;

  return (
    <div className={s.loader}>
      <motion.div
        className={s.progressBar}
        initial={{ width: "0%" }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.6, ease: EASE }}
      />
      <div className={s.counter}>
        {hundreds !== null && <RollingDigit digit={hundreds} />}
        <RollingDigit digit={tens} />
        <RollingDigit digit={ones} />
        <span className={s.percent}>%</span>
      </div>
    </div>
  );
}
