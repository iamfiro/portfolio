import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Image } from "@/shared/components/ui";

import s from "./style.module.scss";

interface MarqueeProjectItem {
  id: number;
  title: string;
  name: string;
  category: string;
  thumbnail: string;
  stackIcons: string[];
}

const MARQUEE_GAP = 0;
const MARQUEE_SPEED = 0.5; // px per frame
const DRAG_THRESHOLD_PX = 3;

const MARQUEE_PROJECTS: MarqueeProjectItem[] = [
  {
    id: 1,
    title: "Digital Standards\nfor a Sustainable Industry",
    name: "Molio",
    category: "E-commerce & Corporate Website",
    thumbnail: "/images/projects/alttab/banner.png",
    stackIcons: ["/icon/stack/nextjs.svg", "/icon/stack/typescript.svg"],
  },
  {
    id: 2,
    title: "Your In-aisle\nSommelier",
    name: "SuperBrugsen",
    category: "In-store Digital Experience",
    thumbnail: "/images/home/happy-product.jpg",
    stackIcons: ["/icon/stack/react.svg", "/icon/stack/sass.svg"],
  },
  {
    id: 3,
    title: "Reimagining\nUrban Mobility",
    name: "CityFlow",
    category: "Mobile App & Dashboard",
    thumbnail: "/images/home/field.jpg",
    stackIcons: ["/icon/stack/kotlin.svg", "/icon/stack/android.svg"],
  },
  {
    id: 4,
    title: "Smart Learning\nPlatform",
    name: "EduVerse",
    category: "EdTech SaaS Product",
    thumbnail: "/images/home/youre-amazing.jpg",
    stackIcons: ["/icon/stack/nextjs.svg", "/icon/stack/prisma.svg"],
  },
  {
    id: 5,
    title: "Connected Health\nExperience",
    name: "MediSync",
    category: "Healthcare IoT Dashboard",
    thumbnail: "/images/projects/alttab/banner.png",
    stackIcons: ["/icon/stack/react.svg", "/icon/stack/socketdotio.svg"],
  },
  {
    id: 6,
    title: "Creative\nCommerce Engine",
    name: "ArtMarket",
    category: "Marketplace Platform",
    thumbnail: "/images/home/happy-product.jpg",
    stackIcons: ["/icon/stack/nestjs.svg", "/icon/stack/redis.svg"],
  },
];

interface ProjectCardProps {
  project: MarqueeProjectItem;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={s.card}>
      <div className={s.cardHeader}>
        <h3 className={s.cardTitle}>{project.title}</h3>
        <span className={s.cardCategory}>{project.category}</span>
      </div>

      <div className={s.cardThumbnail}>
        <Image
          src={project.thumbnail}
          alt={project.name}
          className={s.cardImage}
          draggable={false}
        />
      </div>
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

  const [isDragging, setIsDragging] = useState(false);

  const applyTransform = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transform = `translateX(${offsetRef.current}px)`;
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

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      dragStartXRef.current = e.clientX;
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
  }, []);

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
            <ProjectCard key={`clone-${project.id}`} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
