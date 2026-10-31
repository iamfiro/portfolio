import { motion } from "framer-motion";

import { getRevealProps } from "@/feature/landing/utils/reveal.util";
import { Box, Heading } from "@/shared/components/ui";
import { STACK_DATA } from "@/shared/constants";

import SectionHead from "../section-head";

import StackCard from "./stack-card";
import { TECH_STACK_HEADLINE_LINES } from "./tech-stack.util";

import s from "./style.module.scss";

const TITLE_ID = "landing-stack-title";

/** 분야별 세 열에 도구마다 무엇에 써 왔는지를 함께 적는다 */
export default function LandingTechStack() {
  return (
    <Box as="section" className={s.stack} aria-labelledby={TITLE_ID}>
      <SectionHead titleId={TITLE_ID} lines={TECH_STACK_HEADLINE_LINES} />

      <Box className={s.grid}>
        {STACK_DATA.map((category, columnIndex) => (
          <motion.div
            key={category.label}
            className={s.column}
            {...getRevealProps(columnIndex * 0.08)}
          >
            <Heading as="h3" className={s.label}>
              {category.label}
            </Heading>
            <Box className={s.cards}>
              {category.items.map((item) => (
                <StackCard key={item.name} item={item} />
              ))}
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}
