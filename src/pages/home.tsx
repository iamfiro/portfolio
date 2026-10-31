import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getAwards } from "@/feature/awards/data";
import type { AwardsResponse } from "@/feature/awards/schema";
import { getPosts } from "@/feature/blog/data";
import type { PostsResponse } from "@/feature/blog/schema";
import {
  type HeroSlide,
  LandingActivities,
  LandingAwards,
  LandingBlog,
  LandingCompetency,
  LandingCursorTrail,
  LandingFooter,
  LandingHeader,
  LandingHero,
  LandingProjects,
  LandingStatement,
  LandingTechStack,
} from "@/feature/landing/components";
import SkipLink, {
  MAIN_CONTENT_ID,
} from "@/feature/landing/components/skip-link";
import { getProjects } from "@/feature/projects/data";
import type { ProjectsResponse } from "@/feature/projects/schema";
import { Box } from "@/shared/components/ui";

import s from "./home.module.scss";

// TEMP: 외부 쇼릴(타인 작업물). 확인용으로만 쓰고 배포 전 교체한다
const TEMP_SHOWREEL =
  "https://video.showreel.design/videos/sam-mularczyk-motion-design-reel-2025.mp4";

export default function Home() {
  const { data: projectsData } = useQuery<ProjectsResponse>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const { data: awardsData } = useQuery<AwardsResponse>({
    queryKey: ["awards"],
    queryFn: getAwards,
  });

  const { data: postsData } = useQuery<PostsResponse>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const projects = useMemo(() => projectsData?.data ?? [], [projectsData]);
  const awards = useMemo(() => awardsData?.data ?? [], [awardsData]);
  const posts = useMemo(() => postsData?.data ?? [], [postsData]);

  const heroSlides = useMemo<HeroSlide[]>(
    () =>
      projects.flatMap(({ title, thumbnailUrl }) =>
        thumbnailUrl
          ? [{ src: thumbnailUrl, alt: `${title} 대표 이미지` }]
          : [],
      ),
    [projects],
  );

  return (
    <Box as="main" className={s.container}>
      <SkipLink />
      <LandingHeader projectCount={projects.length} />
      {/* TEMP: 쇼릴 확인용 외부 영상. 배포 전에 실제 영상으로 바꾸거나 지운다 */}
      <LandingHero slides={heroSlides} videoSrc={TEMP_SHOWREEL} />
      <Box
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className={s.content}
        data-trail-start
      >
        <LandingStatement />
        <LandingCompetency />
        <LandingProjects projects={projects} />
        <LandingAwards awards={awards} />
        <LandingActivities />
        <LandingTechStack />
        <LandingBlog posts={posts} />
        <LandingFooter />
      </Box>
      <LandingCursorTrail />
    </Box>
  );
}
