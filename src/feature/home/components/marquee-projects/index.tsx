import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Image, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

// 프로젝트 ID 기반 결정적 랜덤 height 생성
function getHeight(id: number): number {
  const seed = ((id * 9301 + 49297) % 233280) / 233280;
  return 120 + seed * 160; // 120px ~ 280px 범위
}

interface MarqueeProjectItem {
  id: number;
  name: string;
  thumbnail: string;
}

const MARQUEE_GAP = 32;
const MARQUEE_SPEED = 0.5; // px per frame
const DRAG_THRESHOLD_PX = 3;
const INERTIA_FRICTION = 0.95; // 감속 계수 (1에 가까울수록 오래 미끄러짐)
const INERTIA_MIN_VELOCITY = 0.5; // 이 속도 이하면 관성 종료

// scaleY 애니메이션 상수
const SCALE_Y_MIN = 0.85; // 최대 압축 시 scaleY
const SCALE_Y_VELOCITY_MAX = 50; // 이 속도 이상이면 최대 압축
const SCALE_Y_LERP_SPEED = 0.12; // scaleY 보간 속도 (0~1, 클수록 빠르게 반응)

const MARQUEE_PROJECTS: MarqueeProjectItem[] = [
  {
    id: 1,
    name: "Molio",
    thumbnail: "https://assets.awwwards.com/awards/media/cache/thumb_880_660/submissions/2026/04/69f0fb6148948136033388.jpg",
  },
  {
    id: 2,
    name: "SuperBrugsen",
    thumbnail: "https://assets.awwwards.com/awards/media/cache/thumb_880_660/submissions/2026/04/69f03e17c2e6f377520226.jpg",
  },
  {
    id: 3,
    name: "CityFlow",
    thumbnail: "https://assets.awwwards.com/awards/media/cache/thumb_880_660/submissions/2026/04/69ebceb5656ee219540044.jpg",
  },
  {
    id: 4,
    name: "EduVerse",
    thumbnail: "https://assets.awwwards.com/awards/media/cache/thumb_880_660/submissions/2026/04/69ed8a35632a5185570520.jpg",
  },
  {
    id: 5,
    name: "MediSync",
    thumbnail: "https://assets.awwwards.com/awards/media/cache/thumb_880_660/submissions/2026/04/69ed073304037316077927.png",
  },
];

interface ProjectCardProps {
  project: MarqueeProjectItem;
}

function ProjectCard({ project }: ProjectCardProps) {
  const height = getHeight(project.id);

  return (
    <article className={s.card}>
      <div className={s.cardThumbnail} style={{ height: `${height}px` }}>
        <Image
          src={project.thumbnail}
          alt={project.name}
          className={s.cardImage}
          draggable={false}
        />
      </div>

      <Text className={s.cardName}>
        [ {project.name} ]
      </Text>
    </article>
  );
}

export default function MarqueeProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);

  const dragStartXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);
  const rafRef = useRef<number>(0);
  const velocityRef = useRef(0);
  const lastDragTimeRef = useRef(0);
  const lastDragXRef = useRef(0);
  const inertiaRafRef = useRef<number>(0);
  const scaleYRef = useRef(1);
  const scaleYRafRef = useRef<number>(0);

  const [isDragging, setIsDragging] = useState(false);

  const applyTransform = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transform = `translateX(${offsetRef.current}px) scaleY(${scaleYRef.current})`;
  }, []);

  // 무한 루프 위치 보정
  const wrapOffset = useCallback(() => {
    const w = setWidthRef.current;
    if (w <= 0) return;
    if (offsetRef.current <= -w) {
      offsetRef.current += w;
    } else if (offsetRef.current > 0) {
      offsetRef.current -= w;
    }
  }, []);

  // 자동 스크롤 애니메이션
  useEffect(() => {
    let running = true;

    const tick = () => {
      if (!running) return;
      if (!isDraggingRef.current) {
        offsetRef.current -= MARQUEE_SPEED;
        wrapOffset();
        applyTransform();
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [applyTransform, wrapOffset]);

  // scaleY 보간 애니메이션 (속도에 따라 Y축 압축)
  useEffect(() => {
    let running = true;

    const tick = () => {
      if (!running) return;

      const speed = Math.abs(velocityRef.current);
      const t = Math.min(speed / SCALE_Y_VELOCITY_MAX, 1);
      const targetScaleY = 1 - t * (1 - SCALE_Y_MIN);

      scaleYRef.current += (targetScaleY - scaleYRef.current) * SCALE_Y_LERP_SPEED;

      // 충분히 1에 가까우면 정확히 1로 스냅
      if (Math.abs(scaleYRef.current - 1) < 0.001) {
        scaleYRef.current = 1;
      }

      applyTransform();
      scaleYRafRef.current = requestAnimationFrame(tick);
    };

    scaleYRafRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(scaleYRafRef.current);
    };
  }, [applyTransform]);

  // set 너비 측정
  useLayoutEffect(() => {
    const target = firstSetRef.current;
    if (!target) return;

    const measure = () => {
      setWidthRef.current = target.offsetWidth + MARQUEE_GAP;
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(target);

    const images = target.querySelectorAll("img");
    const onLoad = () => measure();
    for (const img of images) {
      img.addEventListener("load", onLoad);
      img.addEventListener("error", onLoad);
    }

    return () => {
      resizeObserver.disconnect();
      for (const img of images) {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onLoad);
      }
    };
  }, []);

  // 관성 애니메이션
  const startInertia = useCallback(() => {
    cancelAnimationFrame(inertiaRafRef.current);

    const animate = () => {
      if (isDraggingRef.current) return;
      if (Math.abs(velocityRef.current) < INERTIA_MIN_VELOCITY) {
        velocityRef.current = 0;
        return;
      }

      velocityRef.current *= INERTIA_FRICTION;
      offsetRef.current += velocityRef.current;
      wrapOffset();
      applyTransform();

      inertiaRafRef.current = requestAnimationFrame(animate);
    };

    inertiaRafRef.current = requestAnimationFrame(animate);
  }, [applyTransform, wrapOffset]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      cancelAnimationFrame(inertiaRafRef.current);
      velocityRef.current = 0;

      dragStartXRef.current = e.clientX;
      lastDragXRef.current = e.clientX;
      lastDragTimeRef.current = performance.now();
      isDraggingRef.current = true;
      setIsDragging(true);
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      const delta = e.clientX - dragStartXRef.current;
      if (Math.abs(delta) < DRAG_THRESHOLD_PX) return;
      dragStartXRef.current = e.clientX;

      const now = performance.now();
      const dt = now - lastDragTimeRef.current;
      if (dt > 0) {
        velocityRef.current = (e.clientX - lastDragXRef.current) / dt * 16; // 프레임당 속도로 정규화
      }
      lastDragXRef.current = e.clientX;
      lastDragTimeRef.current = now;

      offsetRef.current += delta;
      wrapOffset();
      applyTransform();
    },
    [applyTransform, wrapOffset],
  );

  const endDrag = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    startInertia();
  }, [startInertia]);

  const containerClassName = [s.marqueeProjects, isDragging && s.dragging]
    .filter(Boolean)
    .join(" ");

  const setStyle = { gap: `${MARQUEE_GAP}px` };

  return (
    <section
      ref={containerRef}
      className={containerClassName}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onDragStart={(e) => e.preventDefault()}
      aria-label="Selected projects"
    >
      <div ref={trackRef} className={s.track} style={{ gap: `${MARQUEE_GAP}px` }}>
        <div ref={firstSetRef} className={s.set} style={setStyle}>
          {MARQUEE_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className={s.set} style={setStyle} aria-hidden="true">
          {MARQUEE_PROJECTS.map((project) => (
            <ProjectCard key={`clone1-${project.id}`} project={project} />
          ))}
        </div>
        <div className={s.set} style={setStyle} aria-hidden="true">
          {MARQUEE_PROJECTS.map((project) => (
            <ProjectCard key={`clone2-${project.id}`} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
