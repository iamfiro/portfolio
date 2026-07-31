import { useQuery } from "@tanstack/react-query";
import {
  Award,
  BookOpenText,
  FolderKanban,
  Layers3,
  LayoutDashboard,
  LogOut,
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

  const openSection = (nextSection: AdminSection) => {
    navigate(nextSection === "overview" ? "/admin" : `/admin/${nextSection}`);
  };

  return (
    <Flex className={componentClassName} {...props}>
      <Sidebar width={220} className={s.sidebar}>
        <Stack gap={12}>
          <Stack gap={4} className={s.sidebarHeader}>
            <Text size="sm" color="subtle">
              Portfolio
            </Text>
            <Heading as="h2" size="md" className={s.sidebarTitle}>
              Admin Panel
            </Heading>
          </Stack>
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
      </Sidebar>

      <Stack className={s.content} gap={20}>
        <Flex justify="space-between" align="center" className={s.pageHeader}>
          <Stack gap={4}>
            <Heading as="h1" size="3xl">
              {activeItem.label}
            </Heading>
            <Text color="subtle">{activeItem.description}</Text>
          </Stack>
          <Button
            size="sm"
            variant="outline"
            onClick={onLogout}
            leftIcon={<LogOut size={16} />}
          >
            로그아웃
          </Button>
        </Flex>

        <Card className={s.panelCard}>
          <Flex justify="space-between" align="center" className={s.panelHeader}>
            <Heading as="h2" size="md">
              DB Content Manager
            </Heading>
            <Badge variant="success">Session protected</Badge>
          </Flex>

          {activeSection === "overview" ? (
            <Grid columns="repeat(2, minmax(0, 1fr))" gap={12} className={s.statsGrid}>
              {[
                { label: "Posts", count: posts.length, target: "posts" as const },
                {
                  label: "Projects",
                  count: projects.length,
                  target: "projects" as const,
                },
                { label: "Stacks", count: stacks.length, target: "stacks" as const },
                { label: "Awards", count: awards.length, target: "awards" as const },
              ].map((item) => (
                <Card key={item.target} className={s.statCard}>
                  <Stack gap={8}>
                    <Text color="subtle">{item.label}</Text>
                    <Heading as="h3" size="2xl">
                      {item.count}
                    </Heading>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openSection(item.target)}
                    >
                      관리하기
                    </Button>
                  </Stack>
                </Card>
              ))}
            </Grid>
          ) : null}
          {activeSection === "posts" ? (
            <BlogManager isLoading={isPostsLoading} posts={posts} projects={projects} />
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
        </Card>
      </Stack>
    </Flex>
  );
}
