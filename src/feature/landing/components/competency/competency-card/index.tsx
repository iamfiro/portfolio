import { motion } from "framer-motion";
import type { ComponentType } from "react";

import { getRevealProps } from "@/feature/landing/utils/reveal.util";
import { Box, Heading, Text } from "@/shared/components/ui";

import type { Competency, CompetencyVisual } from "../competency.util";
import BackendVisual from "../visuals/backend-visual";
import CrossPlatformVisual from "../visuals/cross-platform-visual";
import HackathonVisual from "../visuals/hackathon-visual";

import s from "./style.module.scss";

const VISUALS: Record<CompetencyVisual, ComponentType> = {
  "cross-platform": CrossPlatformVisual,
  backend: BackendVisual,
  hackathon: HackathonVisual,
};

interface Props {
  competency: Competency;
  index: number;
}

export default function CompetencyCard({ competency, index }: Props) {
  const Visual = VISUALS[competency.visual];

  return (
    <motion.article className={s.card} {...getRevealProps(index * 0.1)}>
      <Box className={s.stage} aria-hidden>
        <Visual />
      </Box>

      <Box className={s.copy}>
        <Heading as="h3" className={s.title}>
          {competency.title}
        </Heading>
        <Text as="p" className={s.description}>
          {competency.description}
        </Text>
      </Box>
    </motion.article>
  );
}
