import { createBrowserRouter, Navigate } from "react-router-dom";

import {
  Activities,
  Blog,
  BlogArticle,
  Contact,
  Home,
  ProjectDetail,
  Projects,
} from "@/pages";
import { PageTransition } from "@/shared/components/layouts";

const router = createBrowserRouter([
  {
    element: <PageTransition />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/activities", element: <Activities /> },
      { path: "/awards", element: <Navigate to="/activities" replace /> },
      { path: "/blog", element: <Blog /> },
      { path: "/blog/:id", element: <BlogArticle /> },
      { path: "/projects", element: <Projects /> },
      { path: "/projects/:id", element: <ProjectDetail /> },
      { path: "/contact", element: <Contact /> },
    ],
  },
]);

export default router;
