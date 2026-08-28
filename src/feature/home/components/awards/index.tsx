import { useQuery } from "@tanstack/react-query";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";

import { getAwards } from "@/feature/awards/data";
import type { Award, AwardsResponse } from "@/feature/awards/schema";
import { usePageTransition } from "@/shared/components/layouts/page-transition/page-transition.context";
import {
  Heading,
  HoverPreview,
  HoverPreviewTrigger,
  Section,
  Text,
} from "@/shared/components/ui";

import s from "./style.module.scss";

interface DisplayAward {
  id: string;
  name: string;
  organization: string;
  year: number;
  imageUrl: string | null;
}

export default function Awards() {
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

  const renderAward = useCallback(
    (award: DisplayAward) => (
      <HoverPreviewTrigger
        key={award.id}
        className={s.card}
        preview={{
          title: award.name,
          subtext: `${award.organization} · ${award.year}`,
          imageUrl: award.imageUrl,
        }}
      >
        <Text as="p" className={s.cardText}>
          <Text as="span" className={s.cardTitle}>
            {award.name}
          </Text>
          <Text
            as="span"
            size="md"
            color="subtle"
            className={s.cardOrganization}
          >
            {award.organization} - {award.year}
          </Text>
        </Text>
      </HoverPreviewTrigger>
    ),
    [],
  );

  return (
    <Section className={s.awards} size="sm">
      <Heading as="h2" size="lg" className={s.title}>
        수상 실적
      </Heading>

      <HoverPreview className={s.list}>
        {isLoading ? (
          <Text color="subtle">수상 실적을 불러오는 중입니다.</Text>
        ) : error ? (
          <Text color="subtle">수상 실적을 불러올 수 없습니다.</Text>
        ) : (
          awards.map(renderAward)
        )}
      </HoverPreview>
    </Section>
  );
}
