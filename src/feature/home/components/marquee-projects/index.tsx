import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { Flex, Image } from "@/shared/components/ui";

import s from "./style.module.scss";

interface MarqueeProjectItem {
  id: number;
  title: string;
  name: string;
  category: string;
  thumbnail: string;
  stackIcons: string[];
}

const MARQUEE_GAP = 32;
const MARQUEE_SPEED_SECONDS = 40;
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
      <h3 className={s.cardTitle}>{project.title}</h3>

      <div className={s.cardThumbnail}>
        <Image
          src={project.thumbnail}
          alt={project.name}
          className={s.cardImage}
          draggable={false}
        />
      </div>

      <div className={s.cardInfo}>
        <span className={s.cardName}>{project.name}</span>
        <span className={s.cardCategory}>{project.category}</span>
      </div>

      <Flex gap={6} className={s.cardStack}>
        {project.stackIcons.map((icon) => (
          <Image
            key={icon}
            src={icon}
            alt=""
            className={s.stackIcon}
            draggable={false}
          />
        ))}
      </Flex>
    </article>
  );
}

export default function MarqueeProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragShiftRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);

  const dragStartXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const [isDragging, setIsDragging] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  const applyDragOffset = useCallback((value: number) => {
    const el = dragShiftRef.current;
    if (!el) return;
    el.style.setProperty("--drag-offset", `${value}px`);
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
      applyDragOffset(delta);
    },
    [applyDragOffset],
  );

  const endDrag = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    applyDragOffset(0);
  }, [applyDragOffset]);

  useLayoutEffect(() => {
    const target = firstSetRef.current;
    if (!target) return;

    const measure = () => {
      const nextOffset = target.offsetWidth + MARQUEE_GAP;
      setScrollOffset(nextOffset > 0 ? nextOffset : 0);
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

  const containerClassName = [s.marqueeProjects, isDragging && s.dragging]
    .filter(Boolean)
    .join(" ");

  const trackStyle = {
    "--scroll-offset": `-${scrollOffset}px`,
    animationDuration: `${MARQUEE_SPEED_SECONDS}s`,
    animationPlayState: scrollOffset > 0 ? "running" : "paused",
    gap: `${MARQUEE_GAP}px`,
  } as React.CSSProperties;

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
      <div ref={dragShiftRef} className={s.dragShift}>
        <div className={s.track} style={trackStyle}>
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
      </div>
    </section>
  );
}
