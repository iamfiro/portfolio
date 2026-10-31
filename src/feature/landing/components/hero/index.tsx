import { AnimatePresence, motion } from "framer-motion";

import { useHeroSlide } from "@/feature/landing/hooks/use-hero-slide";
import { LANDING_EASE } from "@/feature/landing/utils/reveal.util";
import { usePageTransition } from "@/shared/components/layouts";
import { Box, Heading, Image, Video } from "@/shared/components/ui";

import s from "./style.module.scss";

export interface HeroSlide {
  src: string;
  alt: string;
}

interface Props {
  slides: HeroSlide[];
  /** 있으면 슬라이드 대신 음소거 자동재생 쇼릴을 배경으로 깐다 */
  videoSrc?: string;
}

export default function LandingHero({ slides, videoSrc }: Props) {
  const { pageReady } = usePageTransition();
  const index = useHeroSlide({ count: slides.length });
  const slide = slides[index];

  return (
    <>
      <Box as="section" className={s.hero}>
        {videoSrc && (
          <Video
            src={videoSrc}
            className={s.video}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            aria-hidden
          />
        )}
        <AnimatePresence initial={false}>
          {!videoSrc && slide && (
            <motion.div
              key={slide.src}
              className={s.slide}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: LANDING_EASE }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                className={s.image}
                loading="eager"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* 스티키 히어로 밖에 둬서 본문과 함께 스크롤되고, 배경과 blend 된다 */}
      <Box className={s.headlineAnchor}>
        <motion.div
          className={s.headline}
          initial={{ opacity: 0, y: 32 }}
          animate={pageReady ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, ease: LANDING_EASE, delay: 0.2 }}
        >
          <Heading as="h1" className={s.title}>
            불편함을 기회로 바꾸는
            <br />
            서비스를 만들고 경험을 설계합니다
          </Heading>
        </motion.div>
      </Box>
    </>
  );
}
