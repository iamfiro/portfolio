import { BookOpen, Camera, Code, Megaphone } from "lucide-react";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  Card,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@/shared/components/ui";

import s from "./style.module.scss";

interface ProjectItem {
  id: number;
  category: string;
  categoryIcon: ReactNode;
  title: string;
  description: string;
  image: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: 1,
    category: "SIDE PROJECT",
    categoryIcon: <Code size={12} />,
    title: "AltTab Overlay",
    description: "단축키 한 번으로 화면을 감추는 프라이버시 유틸리티",
    image:
      "https://assets.awwwards.com/awards/media/cache/thumb_880_660/submissions/2026/04/69f0fb6148948136033388.jpg",
  },
  {
    id: 2,
    category: "CASE STUDY",
    categoryIcon: <BookOpen size={12} />,
    title: "Mind Blowing",
    description: "학습 몰입을 위한 인터랙티브 프로덕트 경험",
    image:
      "https://assets.awwwards.com/awards/media/cache/thumb_880_660/submissions/2026/04/69f03e17c2e6f377520226.jpg",
  },
  {
    id: 3,
    category: "SNAPSHOT",
    categoryIcon: <Camera size={12} />,
    title: "Green Field",
    description: "비주얼 스토리텔링 중심의 브랜드 랜딩 페이지",
    image:
      "https://assets.awwwards.com/awards/media/cache/thumb_880_660/submissions/2026/04/69ebceb5656ee219540044.jpg",
  },
  {
    id: 4,
    category: "CAMPAIGN",
    categoryIcon: <Megaphone size={12} />,
    title: "Amazing Campaign",
    description: "캠페인 참여 전환율을 높이는 프론트엔드 설계",
    image:
      "https://assets.awwwards.com/awards/media/cache/thumb_880_660/submissions/2026/04/69ed8a35632a5185570520.jpg",
  },
];

function ProjectCard({ project, index }: { project: ProjectItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 + index * 0.15 }}
    >
      <Card className={s.card}>
        <Stack className={s.cardBody}>
          <Heading as="h3" className={s.cardTitle}>
            {project.title}
          </Heading>
          <Text className={s.cardDescription}>{project.description}</Text>
        </Stack>
        <Image
          src={project.image}
          alt={project.title}
          className={s.thumbnail}
        />
      </Card>
    </motion.div>
  );
}

export default function ProjectList() {
  const [selectedCategory] = useState<string>("ALL");

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "ALL") return PROJECTS;
    return PROJECTS.filter((project) => project.category === selectedCategory);
  }, [selectedCategory]);

  const renderProject = useCallback(
    (project: ProjectItem, index: number) => (
      <ProjectCard key={project.id} project={project} index={index} />
    ),
    [],
  );

  return (
    <Stack className={s.container}>
      {/* <Flex className={s.filterBar} wrap>
        {CATEGORIES.map((category) => (
          <Tag
            key={category}
            className={selectedCategory === category ? s.activeTag : ""}
            onClick={() => setSelectedCategory(category)}
          >
            {category === "ALL" ? "전체" : category}
          </Tag>
        ))}
      </Flex> */}

      <div className={s.grid}>
        {filteredProjects.map(renderProject)}
      </div>

      {filteredProjects.length === 0 && (
        <Flex direction="column" gap={16} align="center" width="100%">
          <Text size="xl" weight="semibold">
            해당 카테고리의 프로젝트가 없습니다
          </Text>
        </Flex>
      )}
    </Stack>
  );
}
