import { createBrowserRouter } from "react-router-dom";

import { Awards, Blog, BlogArticle, Home, Projects } from "@/pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/awards",
    element: <Awards />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/:id",
    element: <BlogArticle />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
]);

export default router;
