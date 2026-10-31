import { motion } from "framer-motion";

import IconBubble from "../../icon-bubble";
import type { TrailParticle } from "../cursor-trail.type";

import s from "./style.module.scss";

interface Props {
  particle: TrailParticle;
  onDone: (id: number) => void;
}

/** 톡 튀어나왔다가 잠깐 머문 뒤 쪼그라들며 사라지는 버블 하나 */
export default function TrailBubble({ particle, onDone }: Props) {
  const { id, x, y, icon, tone, scale, rotate } = particle;

  return (
    <motion.div
      className={s.anchor}
      style={{ left: x, top: y }}
      initial={{ scale: 0, rotate: rotate - 30 }}
      animate={{
        scale: [0, scale * 1.12, scale, scale, 0],
        rotate: [rotate - 30, rotate, rotate, rotate, rotate + 10],
      }}
      transition={{
        duration: 1.1,
        times: [0, 0.22, 0.34, 0.6, 1],
        ease: "easeOut",
      }}
      onAnimationComplete={() => onDone(id)}
    >
      <IconBubble icon={icon} tone={tone} />
    </motion.div>
  );
}
