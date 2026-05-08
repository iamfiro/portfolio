import { ArrowRight, BookOpen, Camera, Code, Megaphone } from "lucide-react";
import { type ReactNode, useCallback } from "react";

import {
  Button,
  Card,
  Flex,
  Heading,
  Image,
  Section,
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
    image: "https://assets.awwwards.com/awards/media/cache/thumb_880_660/submissions/2026/04/69f0fb6148948136033388.jpg",
  },
  {
    id: 2,
    category: "CASE STUDY",
    categoryIcon: <BookOpen size={12} />,
    title: "Mind Blowing",
    description: "학습 몰입을 위한 인터랙티브 프로덕트 경험",
    image: "https://assets.awwwards.com/awards/media/cache/thumb_880_660/submissions/2026/04/69f03e17c2e6f377520226.jpg",
  },
  {
    id: 3,
    category: "SNAPSHOT",
    categoryIcon: <Camera size={12} />,
    title: "Green Field",
    description: "비주얼 스토리텔링 중심의 브랜드 랜딩 페이지",
    image: "https://assets.awwwards.com/awards/media/cache/thumb_880_660/submissions/2026/04/69ebceb5656ee219540044.jpg",
  },
  {
    id: 4,
    category: "CAMPAIGN",
    categoryIcon: <Megaphone size={12} />,
    title: "Amazing Campaign",
    description: "캠페인 참여 전환율을 높이는 프론트엔드 설계",
    image: "https://assets.awwwards.com/awards/media/cache/thumb_880_660/submissions/2026/04/69ed8a35632a5185570520.jpg",
  },
];

function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <Card key={project.id} className={s.card}>
      <Stack className={s.cardBody}>
        <Flex className={s.categoryLabel}>
          {project.categoryIcon}
          <Text className={s.categoryText}>{project.category}</Text>
        </Flex>
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
  );
}

export default function Project() {
  const renderProject = useCallback(
    (project: ProjectItem) => <ProjectCard key={project.id} project={project} />,
    [],
  );

  return (
    <Section className={s.project} size="md">
      <Stack className={s.layout}>
        <Flex className={s.grid} wrap>
          {PROJECTS.map(renderProject)}
        </Flex>

        <Button
          variant="secondary"
          rightIcon={<ArrowRight />}
          className={s.viewMoreButton}
        >
          More Projects
        </Button>
      </Stack>
    </Section>
  );
}
