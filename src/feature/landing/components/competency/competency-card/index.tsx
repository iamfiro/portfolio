import { motion, useInView } from "framer-motion";
import { type ComponentType, useRef, useState } from "react";

import type { PointerEventSpot } from "@/feature/landing/hooks/use-pointer-activity";
import type { PointerPosition } from "@/feature/landing/hooks/use-pointer-position";
import { getRevealProps } from "@/feature/landing/utils/reveal.util";
import { Box, Heading, Text } from "@/shared/components/ui";

import type { Competency, CompetencyVisual } from "../competency.util";
import IterationVisual from "../visuals/iteration-visual";
import PrototypeVisual from "../visuals/prototype-visual";
import VoiceVisual from "../visuals/voice-visual";

import CardMascot from "./card-mascot";

import s from "./style.module.scss";

const VISUALS: Record<CompetencyVisual, ComponentType> = {
  voice: VoiceVisual,
  prototype: PrototypeVisual,
  iteration: IterationVisual,
};

interface Props {
  competency: Competency;
  index: number;
  pointer: PointerPosition;
  sleepy: boolean;
  shake: PointerEventSpot | null;
}

export default function CompetencyCard({
  competency,
  index,
  pointer,
  sleepy,
  shake,
}: Props) {
  const Visual = VISUALS[competency.visual];
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [hovered, setHovered] = useState(false);

  const stageClassName = [s.stage, s[competency.tone]]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.article
      ref={ref}
      className={s.card}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      {...getRevealProps(index * 0.1)}
    >
      <Box className={stageClassName} aria-hidden>
        <CardMascot
          mascot={competency.mascot}
          pointer={pointer}
          inView={inView}
          hovered={hovered}
          sleepy={sleepy}
          shake={shake}
          index={index}
        />
        <Box className={s.visual}>
          <Visual />
        </Box>
      </Box>

      <Box className={s.copy}>
        <Text as="span" className={s.index}>
          {String(index + 1).padStart(2, "0")}
        </Text>
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
