import { useCursorTrail } from "@/feature/landing/hooks/use-cursor-trail";
import { Box, Portal } from "@/shared/components/ui";

import TrailBubble from "./trail-bubble";

import s from "./style.module.scss";

/** 마우스를 따라 아이콘 버블이 톡톡 튀어나오는 화면 전체 장식 레이어 */
export default function LandingCursorTrail() {
  const { particles, removeParticle } = useCursorTrail();

  return (
    <Portal>
      <Box className={s.layer} aria-hidden>
        {particles.map((particle) => (
          <TrailBubble
            key={particle.id}
            particle={particle}
            onDone={removeParticle}
          />
        ))}
      </Box>
    </Portal>
  );
}
