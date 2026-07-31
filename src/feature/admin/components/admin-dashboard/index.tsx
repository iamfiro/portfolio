import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Award,
  BookOpenText,
  Database,
  FolderKanban,
  Layers3,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { getAwards } from "@/feature/awards/api";
import { AwardsResponse } from "@/feature/awards/schema";
import { getPosts } from "@/feature/blog/api";
import { PostsResponse } from "@/feature/blog/schema";
import { getProjects } from "@/feature/projects/api";
import { ProjectsResponse } from "@/feature/projects/schema";
import { getStacks } from "@/feature/stacks/api";
import { StacksResponse } from "@/feature/stacks/schema";
import {
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Sidebar,
  Stack,
  Text,
} from "@/shared/components/ui";

import AwardsManager from "../awards-manager";
import BlogManager from "../blog-manager";
import ProjectsManager from "../projects-manager";
import StacksManager from "../stacks-manager";

import s from "./style.module.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onLogout: () => void;
}

type AdminSection = "overview" | "posts" | "projects" | "stacks" | "awards";

interface NavigationItem {
  id: AdminSection;
  label: string;
  description: string;
}

const NAV_ITEMS: NavigationItem[] = [
  { id: "overview", label: "Overview", description: "전체 콘텐츠 현황" },
  { id: "posts", label: "Posts", description: "블로그 포스트 CRUD" },
  { id: "projects", label: "Projects", description: "프로젝트 및 관계 CRUD" },
  { id: "stacks", label: "Stacks", description: "기술 스택 CRUD" },
  { id: "awards", label: "Awards", description: "수상 내역 CRUD" },
];

function isAdminSection(value: string | undefined): value is AdminSection {
  return NAV_ITEMS.some((item) => item.id === value);
}

function getNavigationIcon(section: AdminSection) {
  switch (section) {
    case "posts":
      return <BookOpenText size={16} />;
    case "projects":
      return <FolderKanban size={16} />;
    case "stacks":
      return <Layers3 size={16} />;
    case "awards":
      return <Award size={16} />;
    default:
      return <LayoutDashboard size={16} />;
  }
}

interface OverviewStatCardProps {
  count: number;
  description: string;
  label: string;
  onOpen: () => void;
  target: Exclude<AdminSection, "overview">;
}

function OverviewStatCard({
  count,
  description,
  label,
  onOpen,
  target,
}: OverviewStatCardProps) {
  return (
    <Card className={s.statCard}>
      <Stack gap={16}>
        <Flex align="center" justify="space-between">
          <Flex className={s.statIcon} align="center" justify="center">
            {getNavigationIcon(target)}
          </Flex>
          <Button
            size="sm"
            variant="ghost"
            className={s.statLink}
            leftIcon={<ArrowUpRight size={14} />}
            onClick={onOpen}
            aria-label={`${label} 관리 페이지 열기`}
          >
            관리
          </Button>
        </Flex>
        <Stack gap={4}>
          <Heading as="h3" size="2xl" className={s.statValue}>
            {count}
          </Heading>
          <Text weight="medium">{label}</Text>
          <Text size="sm" color="subtle">
            {description}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
}

export default function AdminDashboard({ onLogout, className, ...props }: Props) {
  const navigate = useNavigate();
  const { section } = useParams<{ section?: string }>();
  const activeSection: AdminSection = isAdminSection(section) ? section : "overview";
  const activeItem = NAV_ITEMS.find((item) => item.id === activeSection) ?? NAV_ITEMS[0];
  const componentClassName = [s.component, className].filter(Boolean).join(" ");

  const { data: projectsData, isLoading: isProjectsLoading } = useQuery<ProjectsResponse>(
    { queryKey: ["projects"], queryFn: getProjects },
  );
  const { data: awardsData, isLoading: isAwardsLoading } = useQuery<AwardsResponse>({
    queryKey: ["awards"],
    queryFn: getAwards,
  });
  const { data: postsData, isLoading: isPostsLoading } = useQuery<PostsResponse>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
  const { data: stacksData, isLoading: isStacksLoading } = useQuery<StacksResponse>({
    queryKey: ["stacks"],
    queryFn: getStacks,
  });

  const projects = projectsData?.data ?? [];
  const awards = awardsData?.data ?? [];
  const posts = postsData?.data ?? [];
  const stacks = stacksData?.data ?? [];
  const sectionCounts: Record<AdminSection, number> = {
    overview: posts.length + projects.length + stacks.length + awards.length,
    posts: posts.length,
    projects: projects.length,
    stacks: stacks.length,
    awards: awards.length,
  };
  const isDataLoading =
    isPostsLoading || isProjectsLoading || isStacksLoading || isAwardsLoading;

  const openSection = (nextSection: AdminSection) => {
    navigate(nextSection === "overview" ? "/admin" : `/admin/${nextSection}`);
  };

  return (
    <Flex className={componentClassName} {...props}>
      <Sidebar width={256} className={s.sidebar}>
        <Stack className={s.sidebarInner} gap={20}>
          <Flex className={s.brand} align="center" gap={12}>
            <Flex className={s.brandMark} align="center" justify="center">
              <Database size={18} />
            </Flex>
            <Stack gap={4}>
              <Heading as="h2" size="sm" className={s.sidebarTitle}>
                Portfolio
              </Heading>
              <Text size="xs" color="subtle">
                Content administration
              </Text>
            </Stack>
          </Flex>

          <Stack className={s.navigationGroup} gap={8}>
            <Text size="xs" weight="semibold" color="subtle" className={s.navLabel}>
              Workspace
            </Text>
            <Stack gap={4} className={s.navigation}>
              {NAV_ITEMS.map((item) => {
                const itemClassName = [
                  s.sidebarItem,
                  activeSection === item.id ? s.activeItem : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <Button
                    key={item.id}
                    size="sm"
                    variant="ghost"
                    className={itemClassName}
                    onClick={() => openSection(item.id)}
                    leftIcon={getNavigationIcon(item.id)}
                    aria-current={activeSection === item.id ? "page" : undefined}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>
          </Stack>

          <Card className={s.sessionCard}>
            <Flex align="center" gap={10}>
              <Flex className={s.sessionIcon} align="center" justify="center">
                <ShieldCheck size={16} />
              </Flex>
              <Stack gap={4}>
                <Text size="sm" weight="medium">
                  Secure session
                </Text>
                <Text size="xs" color="subtle">
                  관리자 인증 활성화
                </Text>
              </Stack>
            </Flex>
          </Card>
        </Stack>
      </Sidebar>

      <Stack className={s.content} gap={0}>
        <Flex justify="space-between" align="center" className={s.topBar}>
          <Stack gap={4}>
            <Text size="xs" color="subtle" className={s.breadcrumb}>
              Admin / {activeItem.label}
            </Text>
            <Heading as="h1" size="2xl" className={s.pageTitle}>
              {activeItem.label}
            </Heading>
          </Stack>
          <Flex align="center" gap={10} className={s.topBarActions}>
            <Badge variant={isDataLoading ? "warning" : "success"} dot>
              {isDataLoading ? "Loading" : "Database ready"}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              className={s.logoutButton}
              onClick={onLogout}
              leftIcon={<LogOut size={15} />}
            >
              로그아웃
            </Button>
          </Flex>
        </Flex>

        <Stack className={s.pageBody} gap={24}>
          {activeSection === "overview" ? (
            <>
              <Card className={s.overviewHero}>
                <Flex justify="space-between" align="center" className={s.heroContent}>
                  <Stack gap={8}>
                    <Badge variant="default" size="sm">
                      Content overview
                    </Badge>
                    <Heading as="h2" size="xl">
                      포트폴리오 콘텐츠를 한곳에서 관리하세요.
                    </Heading>
                    <Text color="subtle" className={s.heroDescription}>
                      게시물, 프로젝트, 기술 스택과 수상 내역의 전체 필드 및 연결 관계를
                      관리합니다.
                    </Text>
                  </Stack>
                  <Stack gap={4} className={s.totalCount}>
                    <Text size="xs" color="subtle">
                      Total records
                    </Text>
                    <Heading as="h3" size="3xl">
                      {sectionCounts.overview}
                    </Heading>
                  </Stack>
                </Flex>
              </Card>

              <Grid columns="repeat(4, minmax(0, 1fr))" gap={12} className={s.statsGrid}>
                <OverviewStatCard
                  label="Posts"
                  description="블로그 콘텐츠"
                  count={posts.length}
                  target="posts"
                  onOpen={() => openSection("posts")}
                />
                <OverviewStatCard
                  label="Projects"
                  description="프로젝트와 연결 관계"
                  count={projects.length}
                  target="projects"
                  onOpen={() => openSection("projects")}
                />
                <OverviewStatCard
                  label="Stacks"
                  description="기술 스택 메타데이터"
                  count={stacks.length}
                  target="stacks"
                  onOpen={() => openSection("stacks")}
                />
                <OverviewStatCard
                  label="Awards"
                  description="수상 내역"
                  count={awards.length}
                  target="awards"
                  onOpen={() => openSection("awards")}
                />
              </Grid>
            </>
          ) : (
            <Card className={s.panelCard}>
              <Flex justify="space-between" align="center" className={s.panelHeader}>
                <Stack gap={4}>
                  <Heading as="h2" size="md">
                    {activeItem.label} 관리
                  </Heading>
                  <Text size="sm" color="subtle">
                    {activeItem.description}
                  </Text>
                </Stack>
                <Badge variant="default">{sectionCounts[activeSection]} records</Badge>
              </Flex>

              <Stack className={s.panelBody}>
                {activeSection === "posts" ? (
                  <BlogManager
                    isLoading={isPostsLoading}
                    posts={posts}
                    projects={projects}
                  />
                ) : null}
                {activeSection === "projects" ? (
                  <ProjectsManager isLoading={isProjectsLoading} projects={projects} />
                ) : null}
                {activeSection === "stacks" ? (
                  <StacksManager isLoading={isStacksLoading} stacks={stacks} />
                ) : null}
                {activeSection === "awards" ? (
                  <AwardsManager
                    isLoading={isAwardsLoading}
                    awards={awards}
                    projects={projects}
                  />
                ) : null}
              </Stack>
            </Card>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
}
