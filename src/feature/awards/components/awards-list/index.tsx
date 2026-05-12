import { motion } from "framer-motion";
import { useCallback, useRef } from "react";

import { Flex, Heading, Stack, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

interface Award {
  id: number;
  name: string;
  organization: string;
  year: number;
  description: string;
  image: string;
}

const AWARDS: Award[] = [
  {
    id: 1,
    name: "기능경기대회 모바일앱개발 부문 은상",
    organization: "한국산업인력공단",
    year: 2026,
    description:
      "전국 기능경기대회 모바일앱개발 직종에서 은메달을 수상했습니다.",
    image: "https://picsum.photos/seed/award-1/600/400",
  },
  {
    id: 2,
    name: "창의아이디어경진대회 수상",
    organization: "선린인터넷고등학교",
    year: 2025,
    description:
      "교내 창의아이디어경진대회에서 혁신적인 서비스 기획으로 수상했습니다.",
    image: "https://picsum.photos/seed/award-2/600/400",
  },
  {
    id: 3,
    name: "선린톤 11th 은상",
    organization: "선린인터넷고등학교",
    year: 2025,
    description: "24시간 해커톤에서 팀 프로젝트를 통해 은상을 수상했습니다.",
    image: "https://picsum.photos/seed/award-3/600/400",
  },
  {
    id: 4,
    name: "동행 해커톤 창의재단이사장상",
    organization: "SW마이스터고연합",
    year: 2024,
    description:
      "SW마이스터고 연합 해커톤에서 창의재단이사장상을 수상했습니다.",
    image: "https://picsum.photos/seed/award-4/600/400",
  },
  {
    id: 5,
    name: "앱잼 27th 최우수상",
    organization: "선린인터넷고등학교",
    year: 2024,
    description: "교내 앱 개발 대회에서 최우수상을 수상했습니다.",
    image: "https://picsum.photos/seed/award-5/600/400",
  },
  {
    id: 6,
    name: "선린톤 10th 금상",
    organization: "선린인터넷고등학교",
    year: 2024,
    description: "24시간 해커톤에서 팀 프로젝트를 통해 금상을 수상했습니다.",
    image: "https://picsum.photos/seed/award-6/600/400",
  },
  {
    id: 7,
    name: "교내 천하제일코딩대회 은상",
    organization: "선린인터넷고등학교",
    year: 2024,
    description: "교내 알고리즘 대회에서 은상을 수상했습니다.",
    image: "https://picsum.photos/seed/award-7/600/400",
  },
];

export default function AwardsList() {
  const imageRef = useRef<HTMLImageElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const isVisible = useRef(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const img = imageRef.current;
    const list = listRef.current;
    if (!img || !list) return;

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
    (award: Award) => () => {
      const img = imageRef.current;
      if (!img) return;

      img.src = award.image;
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
    img.style.opacity = "0";
    img.style.transform = img.style.transform.replace(
      /scale\([^)]*\)/,
      "scale(0.9)",
    );
  }, []);

  const renderAward = useCallback(
    (award: Award, index: number) => (
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
          </Stack>
        </Flex>
      </motion.div>
    ),
    [handleMouseEnter, handleMouseMove, handleMouseLeave],
  );

  return (
    <div className={s.list} ref={listRef}>
      {AWARDS.map(renderAward)}
      <img
        ref={imageRef}
        className={s.floatingImage}
        src=""
        alt=""
        aria-hidden="true"
      />
    </div>
  );
}
