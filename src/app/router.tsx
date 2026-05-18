import { createBrowserRouter } from "react-router-dom";

import {
  Admin,
  Awards,
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
      { path: "/awards", element: <Awards /> },
      { path: "/blog", element: <Blog /> },
      { path: "/blog/:id", element: <BlogArticle /> },
      { path: "/projects", element: <Projects /> },
      { path: "/projects/:id", element: <ProjectDetail /> },
      { path: "/contact", element: <Contact /> },
      { path: "/admin", element: <Admin /> },
    ],
  },
]);

export default router;
