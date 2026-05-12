import { useQuery } from "@tanstack/react-query";
import {
  Award,
  BookOpenText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useState } from "react";

import { getAwards } from "@/feature/awards/api";
import { AwardsResponse } from "@/feature/awards/schema";
import { getPosts } from "@/feature/blog/api";
import { PostsResponse } from "@/feature/blog/schema";
import { getProjects } from "@/feature/projects/api";
import { ProjectsResponse } from "@/feature/projects/schema";
import {
  Badge,
  Button,
  Card,
  Flex,
  Heading,
  Sidebar,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
} from "@/shared/components/ui";

import AwardsManager from "../awards-manager";
import BlogManager from "../blog-manager";
import ProjectsManager from "../projects-manager";

import s from "./style.module.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onLogout: () => void;
}

type AdminSection = "overview" | "blog" | "projects" | "awards";

const NAV_ITEMS: Array<{ id: AdminSection; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "blog", label: "Blog" },
  { id: "projects", label: "Projects" },
  { id: "awards", label: "Awards" },
];

export default function AdminDashboard({
  onLogout,
  className,
  ...props
}: Props) {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");

  const componentClassName = [s.component, className].filter(Boolean).join(" ");

  const { data: projectsData, isLoading: isProjectsLoading } =
    useQuery<ProjectsResponse>({
      queryKey: ["projects"],
      queryFn: getProjects,
    });

  const { data: awardsData, isLoading: isAwardsLoading } =
    useQuery<AwardsResponse>({
      queryKey: ["awards"],
      queryFn: getAwards,
    });

  const { data: postsData, isLoading: isPostsLoading } =
    useQuery<PostsResponse>({
      queryKey: ["posts"],
      queryFn: getPosts,
    });

  const projects = projectsData?.data ?? [];
  const awards = awardsData?.data ?? [];
  const posts = postsData?.data ?? [];

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
                onClick={() => setActiveSection(item.id)}
                leftIcon={
                  item.id === "overview" ? (
                    <LayoutDashboard size={16} />
                  ) : item.id === "blog" ? (
                    <BookOpenText size={16} />
                  ) : item.id === "projects" ? (
                    <FolderKanban size={16} />
                  ) : (
                    <Award size={16} />
                  )
                }
              >
                {item.label}
              </Button>
            );
          })}
        </Stack>
      </Sidebar>

      <Stack className={s.content} gap={20}>
        <Flex justify="space-between" align="center">
          <Stack gap={4}>
            <Heading as="h1" size="3xl">
              관리자 대시보드
            </Heading>
            <Text color="subtle">
              프로젝트/어워드 CRUD와 블로그 조회 상태를 관리합니다.
            </Text>
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
          <Flex
            justify="space-between"
            align="center"
            className={s.panelHeader}
          >
            <Heading as="h3" size="md">
              Content Manager
            </Heading>
            <Badge variant="primary">shadcn-style</Badge>
          </Flex>
          <Tabs key={activeSection} defaultTab={activeSection}>
            <TabList>
              <Tab id="overview">Overview</Tab>
              <Tab id="blog">Blog</Tab>
              <Tab id="projects">Projects</Tab>
              <Tab id="awards">Awards</Tab>
            </TabList>

            <TabPanel id="overview">
              <Stack gap={12}>
                <Text color="subtle">
                  왼쪽 메뉴 또는 상단 탭에서 각 섹션을 선택해 관리하세요.
                </Text>
              </Stack>
            </TabPanel>
            <TabPanel id="blog">
              <BlogManager isLoading={isPostsLoading} posts={posts} />
            </TabPanel>
            <TabPanel id="projects">
              <ProjectsManager
                isLoading={isProjectsLoading}
                projects={projects}
              />
            </TabPanel>
            <TabPanel id="awards">
              <AwardsManager
                isLoading={isAwardsLoading}
                awards={awards}
                projects={projects}
              />
            </TabPanel>
          </Tabs>
        </Card>
      </Stack>
    </Flex>
  );
}
