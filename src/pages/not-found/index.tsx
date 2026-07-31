import { useCallback } from "react";

import { usePageTransition } from "@/shared/components/layouts/page-transition/page-transition.context";
import SeoHead from "@/shared/components/seo-head";
import { Button, Flex, Heading, Text } from "@/shared/components/ui";

import s from "./not-found.module.scss";

export default function NotFound() {
  const { navigateTo } = usePageTransition();

  const handleGoHome = useCallback(() => {
    navigateTo("/");
  }, [navigateTo]);

  return (
    <>
      <SeoHead
        title="404 - 페이지를 찾을 수 없습니다"
        description="요청하신 페이지를 찾을 수 없습니다."
        path="/404"
      />
      <main id="main-content" className={s.container}>
        <Flex direction="column" align="center" gap={24} className={s.content}>
          <img src="/icon/error.png" alt="" width={80} height={80} aria-hidden="true" />
          <Heading as="h1" size="3xl">
            404
          </Heading>
          <Text size="lg" color="subtle">
            요청하신 페이지를 찾을 수 없습니다.
          </Text>
          <Button onClick={handleGoHome}>홈으로 돌아가기</Button>
        </Flex>
      </main>
    </>
  );
}
