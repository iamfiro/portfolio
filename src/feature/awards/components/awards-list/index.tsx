import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useCallback, useMemo, useRef } from "react";

import { getAwards } from "@/feature/awards/data";
import { Award, AwardsResponse } from "@/feature/awards/schema";
import {
  Flex,
  Heading,
  Link,
  MarkdownContent,
  Stack,
  Text,
} from "@/shared/components/ui";
import { generateSrcSet } from "@/shared/utils/responsive-image.util";

import s from "./style.module.scss";

interface DisplayAward {
  id: string;
  name: string;
  description: string | null;
  organization: string;
  year: number;
  imageUrl: string | null;
  projectId: string | null;
}

export default function AwardsList() {
  const imageRef = useRef<HTMLImageElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const isVisible = useRef(false);

  const { data, isLoading, error } = useQuery<AwardsResponse>({
    queryKey: ["awards"],
    queryFn: getAwards,
  });

  const awards = useMemo<DisplayAward[]>(() => {
    return (data?.data ?? []).map((award: Award) => ({
      id: award.id,
      name: award.title,
      description: award.description,
      organization: award.organization,
      year: new Date(award.date).getFullYear(),
      imageUrl: award.imageUrl,
      projectId: award.projectId,
    }));
  }, [data]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const image = imageRef.current;
    const list = listRef.current;
    if (!image || !list || image.dataset.enabled !== "true") return;

    const rect = list.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const deltaX = event.clientX - lastX.current;
    lastX.current = event.clientX;
    const rotation = Math.max(-3, Math.min(3, deltaX * 0.3));

    if (!isVisible.current) {
      isVisible.current = true;
      image.style.opacity = "1";
    }

    image.style.transform = `translate3d(${x - 190}px, ${y - 130}px, 0) scale(1) rotate(${rotation}deg)`;
  }, []);

  const handleMouseEnter = useCallback(
    (award: DisplayAward) => () => {
      const image = imageRef.current;
      if (!image) return;

      if (!award.imageUrl) {
        image.dataset.enabled = "false";
        image.style.opacity = "0";
        return;
      }

      image.dataset.enabled = "true";
      image.src = award.imageUrl;
      image.srcset = generateSrcSet(award.imageUrl) ?? "";
      image.sizes = "(max-width: 767px) 80vw, 320px";
      isVisible.current = false;
      image.style.opacity = "0";
      image.style.transform = image.style.transform.replace(
        /scale\([^)]*\)/,
        "scale(0.85)",
      );
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    const image = imageRef.current;
    if (!image) return;

    isVisible.current = false;
    image.dataset.enabled = "false";
    image.style.opacity = "0";
    image.style.transform = image.style.transform.replace(/scale\([^)]*\)/, "scale(0.9)");
  }, []);

  const renderAward = useCallback(
    (award: DisplayAward, index: number) => {
      const content = (
        <Flex
          className={s.card}
          onMouseEnter={handleMouseEnter(award)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Stack className={s.cardContent}>
            <Stack className={s.cardHeader}>
              <Heading as="h3" size="lg" className={s.cardTitle}>
                {award.name}
              </Heading>
              <Text size="md" color="subtle" className={s.cardOrganization}>
                {award.organization} · {award.year}
              </Text>
            </Stack>
            {award.description ? (
              <MarkdownContent
                content={award.description}
                variant="compact"
                className={s.cardDescription}
              />
            ) : null}
          </Stack>
        </Flex>
      );

      return (
        <motion.div
          key={award.id}
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 1.4,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.5 + index * 0.12,
          }}
        >
          {award.projectId ? (
            <Link href={`/projects/${award.projectId}`} className={s.cardLink}>
              {content}
            </Link>
          ) : (
            content
          )}
        </motion.div>
      );
    },
    [handleMouseEnter, handleMouseMove, handleMouseLeave],
  );

  return (
    <div className={s.list} ref={listRef}>
      {isLoading ? (
        <Text color="subtle">어워드를 불러오는 중입니다.</Text>
      ) : error ? (
        <Text color="subtle">어워드를 불러올 수 없습니다.</Text>
      ) : (
        awards.map(renderAward)
      )}
      <img ref={imageRef} className={s.floatingImage} src="" alt="" aria-hidden="true" />
    </div>
  );
}
