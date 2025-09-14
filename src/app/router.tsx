import { createBrowserRouter } from "react-router-dom";

import { Blog, BlogArticle, Home } from "@/pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
