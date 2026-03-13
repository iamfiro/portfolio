import { useCallback, useRef } from "react";

import s from "./style.module.scss";

const TILT_MAX = 8;
const SCALE_HOVER = 1.02;
const GLARE_OPACITY = 0.12;

export default function TopProject() {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * TILT_MAX * 2;
    const rotateX = (0.5 - y) * TILT_MAX * 2;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${SCALE_HOVER}, ${SCALE_HOVER}, 1)`;

    const glareX = x * 100;
    const glareY = y * 100;
    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,${GLARE_OPACITY}), transparent 60%)`;
    glare.style.opacity = "1";
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;

    card.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    glare.style.opacity = "0";
  }, []);

  return (
    <section className={s.topProject}>
      <div
        ref={cardRef}
        className={s.center}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={glareRef} className={s.glare} />
        <div className={s.header}>
          <p>Recent Projects</p>
          <img src="/images/projects/alttab/logo.png" alt="alttab" />
        </div>
        <div className={s.content}>
          <div className={s.contentInner}>
            <p>
              One hotkey instantly disguises your screen with a convincing fake
              overlay <br /> like Windows Update or a dashboard. <br />
              All audio is muted, so it looks like you're doing something else.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
