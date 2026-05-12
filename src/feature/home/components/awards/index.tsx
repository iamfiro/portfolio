import { useQuery } from "@tanstack/react-query";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";

import { getAwards } from "@/feature/awards/api";
import { Award, AwardsResponse } from "@/feature/awards/schema";
import { usePageTransition } from "@/shared/components/layouts/page-transition/page-transition.context";
import { Flex, Heading, Section, Stack, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

interface DisplayAward {
  id: string;
  name: string;
  organization: string;
  year: number;
  imageUrl: string | null;
}

export default function Awards() {
  const imageRef = useRef<HTMLImageElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const isVisible = useRef(false);
  const releaseLockRef = useRef<(() => void) | null>(null);

  const { acquirePreloadLock, initialLoadDone } = usePageTransition();

  const { data, isLoading, error } = useQuery<AwardsResponse>({
    queryKey: ["awards"],
    queryFn: getAwards,
  });

  // 초기 로딩 중일 때만 프리로드 락 획득 (RAF보다 먼저 실행되는 useLayoutEffect)
  useLayoutEffect(() => {
    if (initialLoadDone) return;
    releaseLockRef.current = acquirePreloadLock();

    // 최대 5초 후 강제 해제 (API 실패 등 대비)
    const timeout = setTimeout(() => {
      releaseLockRef.current?.();
      releaseLockRef.current = null;
    }, 5000);

    return () => {
      clearTimeout(timeout);
      releaseLockRef.current?.();
      releaseLockRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // awards 데이터 수신 후 imageUrl 프리로드, 완료되면 락 해제
  useEffect(() => {
    if (!releaseLockRef.current) return;
    if (isLoading) return;

    const urls = (data?.data ?? [])
      .map((a: Award) => a.imageUrl)
      .filter((url): url is string => Boolean(url));

    if (urls.length === 0) {
      releaseLockRef.current();
      releaseLockRef.current = null;
      return;
    }

    let done = 0;
    const images = urls.map((url) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        done += 1;
        if (done >= urls.length) {
          releaseLockRef.current?.();
          releaseLockRef.current = null;
        }
      };
      img.src = url;
      return img;
    });

    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [data, isLoading]);

  const awards = useMemo<DisplayAward[]>(() => {
    return (data?.data ?? []).map((award: Award) => ({
      id: award.id,
      name: award.title,
      organization: award.organization,
      year: new Date(award.date).getFullYear(),
      imageUrl: award.imageUrl,
    }));
  }, [data]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const img = imageRef.current;
    const list = listRef.current;
    if (!img || !list || img.dataset.enabled !== "true") return;

    const rect = list.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const deltaX = e.clientX - lastX.current;
    lastX.current = e.clientX;

    const rotation = Math.max(-3, Math.min(3, deltaX * 0.3));

    if (!isVisible.current) {
      isVisible.current = true;
      img.style.opacity = "1";
    }

    img.style.transform = `translate3d(${x - 190}px, ${y - 130}px, 0) scale(1) rotate(${rotation}deg)`;
  }, []);

  const handleMouseEnter = useCallback(
    (award: DisplayAward) => () => {
      const img = imageRef.current;
      if (!img) return;

      if (!award.imageUrl) {
        img.dataset.enabled = "false";
        img.style.opacity = "0";
        return;
      }

      img.dataset.enabled = "true";
      img.src = award.imageUrl;
      isVisible.current = false;

      img.style.opacity = "0";
      img.style.transform = img.style.transform.replace(
        /scale\([^)]*\)/,
        "scale(0.85)",
      );
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    const img = imageRef.current;
    if (!img) return;

    isVisible.current = false;
    img.dataset.enabled = "false";
    img.style.opacity = "0";
    img.style.transform = img.style.transform.replace(
      /scale\([^)]*\)/,
      "scale(0.9)",
    );
  }, []);

  const renderAward = useCallback(
    (award: DisplayAward) => (
      <Flex
        key={award.id}
        className={s.card}
        onMouseEnter={handleMouseEnter(award)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Stack className={s.cardHeader}>
          <Heading as="h3" size="lg" className={s.cardTitle}>
            {award.name}
          </Heading>
          <Text size="md" color="subtle" className={s.cardOrganization}>
            {award.organization} - {award.year}
          </Text>
        </Stack>
      </Flex>
    ),
    [handleMouseEnter, handleMouseMove, handleMouseLeave],
  );

  return (
    <Section className={s.awards}>
      <Heading as="h2" size="3xl" className={s.title}>
        Awards
      </Heading>

      <div className={s.list} ref={listRef}>
        {isLoading ? (
          <Text color="subtle">어워드를 불러오는 중입니다.</Text>
        ) : error ? (
          <Text color="subtle">어워드를 불러올 수 없습니다.</Text>
        ) : (
          awards.map(renderAward)
        )}
        <img
          ref={imageRef}
          className={s.floatingImage}
          src=""
          alt=""
          aria-hidden="true"
        />
      </div>
    </Section>
  );
}
