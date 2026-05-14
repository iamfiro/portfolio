import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { getProjects } from "@/feature/projects/api";
import { Project, ProjectsResponse } from "@/feature/projects/schema";
import { usePageTransition } from "@/shared/components/layouts/page-transition/page-transition.context";
import { Image, Text } from "@/shared/components/ui";

function usePreloadProjectImages(
  data: ProjectsResponse | undefined,
  acquirePreloadLock: () => () => void,
  initialLoadDone: boolean,
) {
  const releaseRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (initialLoadDone) return;
    const release = acquirePreloadLock();
    releaseRef.current = release;
    return () => {
      release();
      releaseRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!data || !releaseRef.current) return;

    const urls = (data.data ?? [])
      .filter((p: Project) => p.thumbnailUrl)
      .map((p: Project) => p.thumbnailUrl as string);

    const release = releaseRef.current;
    releaseRef.current = null;

    if (urls.length === 0) {
      release();
      return;
    }

    let loaded = 0;
    const total = urls.length;

    const onDone = () => {
      loaded++;
      if (loaded >= total) release();
    };

    urls.forEach((url) => {
      const img = new window.Image();
      img.onload = onDone;
      img.onerror = onDone;
      img.src = url;
    });
  }, [data]);
}

import s from "./style.module.scss";

// 프로젝트 ID(string) 기반 결정적 랜덤 height 생성
function getHeight(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  const seed = Math.abs(hash) / 2147483647;
  return 120 + seed * 160; // 120px ~ 280px 범위
}

interface MarqueeProjectItem {
  id: string;
  name: string;
  thumbnail: string;
}

const MARQUEE_GAP = 32;
const MARQUEE_SPEED = 1; // px per frame
const DRAG_THRESHOLD_PX = 3;
const INERTIA_FRICTION = 0.95; // 감속 계수 (1에 가까울수록 오래 미끄러짐)
const INERTIA_MIN_VELOCITY = 0.5; // 이 속도 이하면 관성 종료

// scaleY 애니메이션 상수
const SCALE_Y_MIN = 0.85; // 최대 압축 시 scaleY
const SCALE_Y_VELOCITY_MAX = 50; // 이 속도 이상이면 최대 압축
const SCALE_Y_LERP_SPEED = 0.12; // scaleY 보간 속도 (0~1, 클수록 빠르게 반응)

interface ProjectCardProps {
  project: MarqueeProjectItem;
  index?: number;
  animate?: boolean;
  ready?: boolean;
}

function ProjectCard({
  project,
  index = 0,
  animate = false,
  ready = true,
}: ProjectCardProps) {
  const height = getHeight(project.id);

  const card = (
    <article className={s.card}>
      <div className={s.cardThumbnail} style={{ height: `${height}px` }}>
        <Image
          src={project.thumbnail}
          alt={project.name}
          className={s.cardImage}
          draggable={false}
        />
      </div>

      <Text className={s.cardName}>[ {project.name} ]</Text>
    </article>
  );

  if (!animate) return card;

  return (
    <motion.div
      initial={{ opacity: 0, y: 200, filter: "blur(8px)" }}
      animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      transition={{
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.3 + index * 0.06,
      }}
    >
      {card}
    </motion.div>
  );
}

export default function MarqueeProjects() {
  const { initialLoadDone, acquirePreloadLock } = usePageTransition();

  const { data } = useQuery<ProjectsResponse>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  usePreloadProjectImages(data, acquirePreloadLock, initialLoadDone);

  const marqueeProjects: MarqueeProjectItem[] = (data?.data ?? [])
    .filter((p: Project) => p.thumbnailUrl)
    .map((p: Project) => ({
      id: p.id,
      name: p.title,
      thumbnail: p.thumbnailUrl as string,
    }));
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

      scaleYRef.current +=
        (targetScaleY - scaleYRef.current) * SCALE_Y_LERP_SPEED;

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

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    cancelAnimationFrame(inertiaRafRef.current);
    velocityRef.current = 0;

    dragStartXRef.current = e.clientX;
    lastDragXRef.current = e.clientX;
    lastDragTimeRef.current = performance.now();
    isDraggingRef.current = true;
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      const delta = e.clientX - dragStartXRef.current;
      if (Math.abs(delta) < DRAG_THRESHOLD_PX) return;
      dragStartXRef.current = e.clientX;

      const now = performance.now();
      const dt = now - lastDragTimeRef.current;
      if (dt > 0) {
        velocityRef.current = ((e.clientX - lastDragXRef.current) / dt) * 16; // 프레임당 속도로 정규화
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
      <div
        ref={trackRef}
        className={s.track}
        style={{ gap: `${MARQUEE_GAP}px` }}
      >
        <div ref={firstSetRef} className={s.set} style={setStyle}>
          {marqueeProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              animate
              ready={initialLoadDone}
            />
          ))}
        </div>
        <div className={s.set} style={setStyle} aria-hidden="true">
          {marqueeProjects.map((project, index) => (
            <ProjectCard
              key={`clone1-${project.id}`}
              project={project}
              index={marqueeProjects.length + index}
              animate
              ready={initialLoadDone}
            />
          ))}
        </div>
        <div className={s.set} style={setStyle} aria-hidden="true">
          {marqueeProjects.map((project, index) => (
            <ProjectCard
              key={`clone2-${project.id}`}
              project={project}
              index={marqueeProjects.length * 2 + index}
              animate
              ready={initialLoadDone}
            />
          ))}
        </div>
        <div className={s.set} style={setStyle} aria-hidden="true">
          {marqueeProjects.map((project, index) => (
            <ProjectCard
              key={`clone1-${project.id}`}
              project={project}
              index={marqueeProjects.length + index}
              animate
            />
          ))}
        </div>
        <div className={s.set} style={setStyle} aria-hidden="true">
          {marqueeProjects.map((project, index) => (
            <ProjectCard
              key={`clone2-${project.id}`}
              project={project}
              index={marqueeProjects.length * 2 + index}
              animate
            />
          ))}
        </div>
      </div>
    </section>
  );
}
