import { ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";

import {
  Box,
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
  title: string;
  description: string;
  image: string;
  stackIcons: string[];
}

type CardShadowStyle = React.CSSProperties & {
  "--project-shadow-hover"?: string;
};

function extractBottomDominantRgb(image: HTMLImageElement): string {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return "0, 0, 0";
  }

  const width = image.naturalWidth;
  const height = image.naturalHeight;

  canvas.width = width;
  canvas.height = height;

  context.drawImage(image, 0, 0, width, height);

  const sampleHeight = Math.max(1, Math.floor(height * 0.45));
  const yStart = height - sampleHeight;
  const imageData = context.getImageData(0, yStart, width, sampleHeight).data;

  const colorFrequency = new Map<string, number>();
  const stepX = Math.max(1, Math.floor(width / 80));
  const stepY = Math.max(1, Math.floor(sampleHeight / 80));

  let highestFrequency = 0;
  let dominantKey = "0,0,0";

  for (let y = 0; y < sampleHeight; y += stepY) {
    for (let x = 0; x < width; x += stepX) {
      const pixelIndex = (y * width + x) * 4;
      const alpha = imageData[pixelIndex + 3];

      if (alpha < 8) {
        continue;
      }

      const red = imageData[pixelIndex];
      const green = imageData[pixelIndex + 1];
      const blue = imageData[pixelIndex + 2];

      const quantizedRed = Math.round(red / 24) * 24;
      const quantizedGreen = Math.round(green / 24) * 24;
      const quantizedBlue = Math.round(blue / 24) * 24;

      const clampedRed = Math.min(255, quantizedRed);
      const clampedGreen = Math.min(255, quantizedGreen);
      const clampedBlue = Math.min(255, quantizedBlue);

      const colorKey = `${clampedRed},${clampedGreen},${clampedBlue}`;
      const nextCount = (colorFrequency.get(colorKey) ?? 0) + 1;
      colorFrequency.set(colorKey, nextCount);

      if (nextCount > highestFrequency) {
        highestFrequency = nextCount;
        dominantKey = colorKey;
      }
    }
  }

  if (highestFrequency === 0) {
    return "0, 0, 0";
  }

  const [red, green, blue] = dominantKey
    .split(",")
    .map((value) => Number(value));

  return `${red}, ${green}, ${blue}`;
}

const PROJECTS: ProjectItem[] = [
  {
    id: 1,
    title: "AltTab Overlay",
    description: "단축키 한 번으로 화면을 감추는 프라이버시 유틸리티",
    image: "/images/projects/alttab/banner.png",
    stackIcons: [
      "/icon/stack/electron.svg",
      "/icon/stack/typescript.svg",
      "/icon/stack/react.svg",
    ],
  },
  {
    id: 2,
    title: "Mind Blowing",
    description: "학습 몰입을 위한 인터랙티브 프로덕트 경험",
    image: "/images/home/happy-product.jpg",
    stackIcons: [
      "/icon/stack/nextjs.svg",
      "/icon/stack/sass.svg",
      "/icon/stack/storybook.svg",
    ],
  },
  {
    id: 3,
    title: "Green Field",
    description: "비주얼 스토리텔링 중심의 브랜드 랜딩 페이지",
    image: "/images/home/field.jpg",
    stackIcons: [
      "/icon/stack/react.svg",
      "/icon/stack/eslint.svg",
      "/icon/stack/jest.svg",
    ],
  },
  {
    id: 4,
    title: "Amazing Campaign",
    description: "캠페인 참여 전환율을 높이는 프론트엔드 설계",
    image: "/images/home/youre-amazing.jpg",
    stackIcons: [
      "/icon/stack/typescript.svg",
      "/icon/stack/cypress.svg",
      "/icon/stack/githubactions.svg",
    ],
  },
];

export default function Project() {
  const [overlayRgbByProject, setOverlayRgbByProject] = useState<
    Record<number, string>
  >({});

  const handleThumbnailLoad = useCallback(
    (projectId: number) => (e: React.SyntheticEvent<HTMLImageElement>) => {
      const nextRgb = extractBottomDominantRgb(e.currentTarget);

      setOverlayRgbByProject((prev) => {
        if (prev[projectId] === nextRgb) {
          return prev;
        }

        return {
          ...prev,
          [projectId]: nextRgb,
        };
      });
    },
    [],
  );

  return (
    <Section className={s.project} size="md">
      <Flex className={s.layout} align="flex-start">
        <Stack className={s.intro}>
          <Stack gap={10}>
            <Heading as="h2" size="4xl" className={s.title}>
              Projects
            </Heading>
          </Stack>
        </Stack>

        <Flex className={s.grid} wrap>
          {PROJECTS.map((project) => {
            const overlayRgb = overlayRgbByProject[project.id] ?? "0, 0, 0";
            const cardShadowStyle: CardShadowStyle = {
              "--project-shadow-hover": `0 20px 44px rgba(${overlayRgb}, 0.42)`,
            };

            return (
              <Card key={project.id} className={s.card} style={cardShadowStyle}>
                <Image
                  src={project.image}
                  alt={project.title}
                  className={s.thumbnail}
                  onLoad={handleThumbnailLoad(project.id)}
                />
                <Box
                  className={s.overlay}
                  style={{
                    background: `linear-gradient(to bottom, rgba(${overlayRgb}, 0), rgba(${overlayRgb}, 0.94))`,
                  }}
                >
                  <Heading as="h3" className={s.cardTitle}>
                    {project.title}
                  </Heading>
                  <Text className={s.cardDescription}>
                    {project.description}
                  </Text>
                </Box>
              </Card>
            );
          })}
          <Button
            variant="secondary"
            rightIcon={<ArrowRight />}
            className={s.viewMoreButton}
          >
            More Projects
          </Button>
        </Flex>
      </Flex>
    </Section>
  );
}
