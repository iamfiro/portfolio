import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import {
  Awards,
  Blog,
  BlogArticle,
  Contact,
  Home,
  ProjectDetail,
  Projects,
} from "@/pages";
import { PageTransition } from "@/shared/components/layouts";
import { Flex, Spinner, VisuallyHidden } from "@/shared/components/ui";

const Home = lazy(() => import("@/pages/home"));
const Awards = lazy(() => import("@/pages/awards/awards"));
const Blog = lazy(() => import("@/pages/blog/blog"));
const BlogArticle = lazy(() => import("@/pages/blog/blog-article"));
const Projects = lazy(() => import("@/pages/projects/projects"));
const ProjectDetail = lazy(() => import("@/pages/projects/project-detail"));
const Contact = lazy(() => import("@/pages/contact/contact"));
const Admin = lazy(() => import("@/pages/admin/admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

function LazyFallback() {
  return (
    <Flex
      minHeight="100vh"
      align="center"
      justify="center"
      role="status"
      aria-live="polite"
    >
      <Spinner size="lg" />
      <VisuallyHidden>페이지를 불러오는 중입니다.</VisuallyHidden>
    </Flex>
  );
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LazyFallback />}>{children}</Suspense>;
}

const notFoundElement = (
  <SuspenseWrapper>
    <NotFound />
  </SuspenseWrapper>
);

const router = createBrowserRouter([
  {
    element: <PageTransition />,
    errorElement: notFoundElement,
    children: [
      { path: "/", element: <Home /> },
      { path: "/awards", element: <Awards /> },
      { path: "/blog", element: <Blog /> },
      { path: "/blog/:id", element: <BlogArticle /> },
      { path: "/projects", element: <Projects /> },
      { path: "/projects/:id", element: <ProjectDetail /> },
      { path: "/contact", element: <Contact /> },
    ],
  },
]);

export default router;
