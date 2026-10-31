import { motion } from "framer-motion";
import { useState } from "react";

import { usePointerActivity } from "@/feature/landing/hooks/use-pointer-activity";
import { usePointerPosition } from "@/feature/landing/hooks/use-pointer-position";
import { LANDING_EASE } from "@/feature/landing/utils/reveal.util";
import { usePageTransition } from "@/shared/components/layouts";
import { Box, Heading } from "@/shared/components/ui";
import { useMediaQuery } from "@/shared/hooks";

import Smiley from "../smiley";
import { resolveMood } from "../smiley/smiley.util";

import { HERO_BLOBS } from "./hero.util";
import HeroGrain from "./hero-grain";
import SmileyBlob from "./smiley-blob";

import s from "./style.module.scss";

/**
 * 위에서 쏟아진 스마일 덩어리가 바닥에 쌓이고, 저마다 포인터를 바라보며 반응하는 히어로.
 * 마우스가 있는 화면에선 덩어리를 집어 던질 수 있다.
 */
export default function LandingHero() {
  const { pageReady } = usePageTransition();
  const pointer = usePointerPosition();
  const canHover = useMediaQuery("(hover: hover)");
  const { sleepy, startle, shake } = usePointerActivity();
  const [inlineHovered, setInlineHovered] = useState(false);
  const inlineMood = resolveMood({ hovered: inlineHovered, sleepy });

  return (
    <Box as="section" className={s.hero}>
      <motion.div
        className={s.copy}
        initial={{ opacity: 0, y: 32 }}
        animate={pageReady ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1, ease: LANDING_EASE, delay: 0.1 }}
      >
        <Heading as="h1" className={s.title}>
          불편함을
          <motion.span
            className={s.inlineSmiley}
            onHoverStart={() => setInlineHovered(true)}
            onHoverEnd={() => setInlineHovered(false)}
            animate={{ rotate: [-10, 10] }}
            transition={{
              duration: 1.6,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror",
            }}
          >
            <Smiley shape="circle" tone="sunset" face="dot" mood={inlineMood} />
          </motion.span>
          기회로 바꾸는
          <br />
          서비스를 만들고
          <br />
          경험을 설계합니다
        </Heading>
      </motion.div>

      <Box className={s.pile} aria-hidden>
        {HERO_BLOBS.map((blob, index) => (
          <SmileyBlob
            key={blob.id}
            blob={blob}
            index={index}
            pointer={pointer}
            ready={pageReady}
            draggable={canHover}
            sleepy={sleepy}
            startle={startle}
            shake={shake}
          />
        ))}
      </Box>

      <HeroGrain />
    </Box>
  );
}
