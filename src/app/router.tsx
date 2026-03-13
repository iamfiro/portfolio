import { createBrowserRouter } from "react-router-dom";

import { Awards, Blog, BlogArticle, Home } from "@/pages";

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
]);

export default router;
