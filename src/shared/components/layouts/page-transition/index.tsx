import { Outlet } from "react-router-dom";

import AnalyticsProvider from "@/shared/components/analytics-provider";

import { PageTransitionProvider } from "./page-transition.context";

function PageTransitionContent() {
  return <Outlet />;
}

export default function PageTransition() {
  return (
    <PageTransitionProvider>
      <AnalyticsProvider>
        <PageTransitionContent />
      </AnalyticsProvider>
    </PageTransitionProvider>
  );
}
