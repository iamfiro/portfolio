import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { getRevealProps } from "@/feature/landing/utils/reveal.util";

interface Props {
  children: ReactNode;
  index?: number;
  className?: string;
}

// 랜딩 섹션과 같은 등장 모션. index마다 조금씩 늦게 떠오른다
export default function Reveal({ children, index = 0, className }: Props) {
  return (
    <motion.div className={className} {...getRevealProps(index * 0.08)}>
      {children}
    </motion.div>
  );
}
