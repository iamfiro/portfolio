import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SpeedInsights } from "@vercel/speed-insights/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import router from "@/app/router";
import { useTypingTitle } from "@/shared/hooks";

import "reactflow/dist/style.css";
import "@/shared/styles/global.scss";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
      gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
      refetchOnWindowFocus: false, // 창 포커스 시 재요청 비활성화
      refetchOnMount: false, // 컴포넌트 마운트 시 재요청 비활성화
    },
  },
});

function App() {
  useTypingTitle("Sungju Cho - Creative Developer");

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <SpeedInsights />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
