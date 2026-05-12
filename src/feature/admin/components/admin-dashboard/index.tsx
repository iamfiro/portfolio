import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";

import { getAwards } from "@/feature/awards/api";
import { AwardsResponse } from "@/feature/awards/schema";
import { getPosts } from "@/feature/blog/api";
import { PostsResponse } from "@/feature/blog/schema";
import { getProjects } from "@/feature/projects/api";
import { ProjectsResponse } from "@/feature/projects/schema";
import {
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Sidebar,
  Stack,
  Stat,
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
        <Stack gap={8}>
          <Heading as="h2" size="md" className={s.sidebarTitle}>
            Dashboard
          </Heading>
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
                variant="ghost"
                className={itemClassName}
                onClick={() => setActiveSection(item.id)}
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
            <Heading as="h1" size="2xl">
              관리자 대시보드
            </Heading>
            <Text color="subtle">
              프로젝트/어워드 CRUD와 블로그 조회 상태를 관리합니다.
            </Text>
          </Stack>
          <Button variant="outline" onClick={onLogout}>
            로그아웃
          </Button>
        </Flex>

        <Grid columns={3} gap={12} className={s.statsGrid}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <Card className={s.statCard}>
              <Stat label="Projects" value={projects.length} />
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: 0.05 }}
          >
            <Card className={s.statCard}>
              <Stat label="Awards" value={awards.length} />
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: 0.1 }}
          >
            <Card className={s.statCard}>
              <Stat label="Posts" value={posts.length} />
            </Card>
          </motion.div>
        </Grid>

        <Card className={s.panelCard}>
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
                  Overview에서는 현재 등록된 콘텐츠 수를 빠르게 확인할 수
                  있습니다.
                </Text>
                <Grid columns={3} gap={12} className={s.overviewGrid}>
                  <Card className={s.overviewCard}>
                    <Stat label="프로젝트" value={projects.length} />
                  </Card>
                  <Card className={s.overviewCard}>
                    <Stat label="어워드" value={awards.length} />
                  </Card>
                  <Card className={s.overviewCard}>
                    <Stat label="블로그 포스트" value={posts.length} />
                  </Card>
                </Grid>
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
              <AwardsManager isLoading={isAwardsLoading} awards={awards} />
            </TabPanel>
          </Tabs>
        </Card>
      </Stack>
    </Flex>
  );
}
