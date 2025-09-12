import { createBrowserRouter } from "react-router-dom";

import { Blog, Home } from "@/pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
]);

export default router;
