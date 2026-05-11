import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import AnalyticsProvider from "@/shared/components/analytics-provider";
import { useImagePreload } from "@/shared/hooks";

import InitialLoader from "./initial-loader";
import {
  PageTransitionProvider,
  usePageTransition,
  usePageTransitionInternal,
} from "./page-transition.context";

import s from "./style.module.scss";

const COLUMN_COUNT = 5;
const STAGGER_S = 0.1;
const DURATION_S = 1.0;
const EASE = [0.22, 1, 0.36, 1] as const;
const HOLD_MS = 80;

type Phase = "idle" | "enter" | "exit";

function PageTransitionContent() {
  const location = useLocation();
  const { pendingPath, consumePendingPath, performNavigate, finishTransition } =
    usePageTransitionInternal();
  const { setInitialLoadDone, setPageReady } = usePageTransition();
  const whiteControls = useAnimationControls();
  const surfaceControls = useAnimationControls();
  const [phase, setPhase] = useState<Phase>("idle");
  // 블로그 상세 페이지 직접 접근 시 초기 로더 스킵
  const skipInitialLoader = useRef(/^\/blog\/.+/.test(location.pathname));
  const [pageHidden, setPageHidden] = useState(!skipInitialLoader.current);
  const prevPathRef = useRef(location.pathname);
  const isPopstateRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const initialLoadDoneRef = useRef(skipInitialLoader.current);
  const { progress, loaded: imagesLoaded } = useImagePreload();
  const [showLoader, setShowLoader] = useState(!skipInitialLoader.current);

  // 블로그 상세 페이지 직접 접근 시 즉시 pageReady 설정
  useEffect(() => {
    if (!skipInitialLoader.current) return;
    setInitialLoadDone(true);
    setPageReady(true);
  }, [setInitialLoadDone, setPageReady]);

  // 초기 로딩: 이미지 로드 완료 시 reveal 애니메이션 실행
  useEffect(() => {
    if (!imagesLoaded || initialLoadDoneRef.current) return;
    initialLoadDoneRef.current = true;

    // 로더 페이드아웃 후 컬럼 reveal
    const timer = setTimeout(() => {
      setShowLoader(false);
      runInitialReveal();
    }, 100);

    return () => clearTimeout(timer);
  }, [imagesLoaded]);

  const runInitialReveal = useCallback(async () => {
    isAnimatingRef.current = true;
    setPhase("exit");

    // 오버레이가 빠져나가기 시작할 때 페이지 콘텐츠도 동시에 애니메이션 시작
    setPageHidden(false);
    setPageReady(true);

    await surfaceControls.start((i: number) => ({
      y: "-100%",
      transition: {
        duration: DURATION_S,
        ease: EASE,
        delay: i * STAGGER_S,
      },
    }));

    setPhase("idle");
    surfaceControls.set({ y: "100%" });
    isAnimatingRef.current = false;
    setInitialLoadDone(true);
  }, [surfaceControls, setInitialLoadDone, setPageReady]);

  // popstate 감지 (브라우저 뒤로/앞으로)
  useEffect(() => {
    const handlePopstate = () => {
      isPopstateRef.current = true;
    };

    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, []);

  // 브라우저 뒤로/앞으로 시 애니메이션 트리거
  useEffect(() => {
    if (location.pathname === prevPathRef.current) return;

    if (isPopstateRef.current) {
      isPopstateRef.current = false;
      prevPathRef.current = location.pathname;
      runRevealAnimation();
    } else {
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  // 프로그래밍 방식 네비게이션: pendingPath 변화 감지
  useEffect(() => {
    if (!pendingPath || isAnimatingRef.current) return;

    const path = consumePendingPath();
    if (path) {
      runFullTransition(path);
    }
  }, [pendingPath]);

  // 전체 트랜지션: 흰색 컬럼 올라옴 → surface 컬럼 올라옴 → 네비게이트 → surface 컬럼 나감
  const runFullTransition = useCallback(
    async (path: string) => {
      isAnimatingRef.current = true;
      setPhase("enter");
      setPageReady(false);

      // 1단계: 흰색 컬럼이 순차적으로 아래에서 올라옴
      whiteControls.start((i: number) => ({
        y: "0%",
        transition: {
          duration: DURATION_S,
          ease: EASE,
          delay: i * STAGGER_S,
        },
      }));

      // 2단계: surface 컬럼이 흰색과 동시에 시작하되 약간 뒤따라감
      await surfaceControls.start((i: number) => ({
        y: "0%",
        transition: {
          duration: DURATION_S,
          ease: EASE,
          delay: i * STAGGER_S + DURATION_S * 0.4,
        },
      }));

      // 홀드
      await new Promise((resolve) => setTimeout(resolve, HOLD_MS));

      // surface로 완전히 가려진 상태 → 페이지 숨김
      setPageHidden(true);

      // 흰색 컬럼 즉시 리셋 (surface 뒤에 숨어있으므로 안 보임)
      whiteControls.set({ y: "100%" });

      // 3단계: 라우트 변경 (surface가 완전히 가리고 있으므로 안 보임)
      performNavigate(path);
      window.scrollTo(0, 0);

      // 한 프레임 대기하여 새 페이지 렌더링 보장
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // 4단계: surface 컬럼이 순차적으로 위로 빠져나감 (콘텐츠 애니메이션 병렬 실행)
      setPhase("exit");
      setPageHidden(false);
      setPageReady(true);

      await surfaceControls.start((i: number) => ({
        y: "-100%",
        transition: {
          duration: DURATION_S,
          ease: EASE,
          delay: i * STAGGER_S,
        },
      }));

      // 리셋
      setPhase("idle");
      surfaceControls.set({ y: "100%" });
      isAnimatingRef.current = false;
      finishTransition();
    },
    [
      whiteControls,
      surfaceControls,
      performNavigate,
      finishTransition,
      setPageReady,
    ],
  );

  // popstate용: 이미 라우트가 변경된 상태에서 reveal 애니메이션
  const runRevealAnimation = useCallback(async () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setPhase("enter");
    setPageReady(false);
    window.scrollTo(0, 0);

    // surface 컬럼을 즉시 화면에 표시
    surfaceControls.set({ y: "0%" });

    await new Promise((resolve) => setTimeout(resolve, HOLD_MS));

    // surface 컬럼이 순차적으로 위로 빠져나감 (콘텐츠 애니메이션 병렬 실행)
    setPhase("exit");
    setPageReady(true);
    await surfaceControls.start((i: number) => ({
      y: "-100%",
      transition: {
        duration: DURATION_S,
        ease: EASE,
        delay: i * STAGGER_S,
      },
    }));

    // exit 완료 후 리셋
    setPhase("idle");
    surfaceControls.set({ y: "100%" });
    isAnimatingRef.current = false;
  }, [surfaceControls, setPageReady]);

  const overlayClassName = [
    s.overlay,
    (phase !== "idle" || !initialLoadDoneRef.current) && s.active,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <AnimatePresence>
        {showLoader && (
          <motion.div
            key="initial-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <InitialLoader progress={progress} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className={overlayClassName}>
        {Array.from({ length: COLUMN_COUNT }, (_, i) => (
          <motion.div
            key={`white-${i}`}
            className={s.columnWhite}
            custom={i}
            animate={whiteControls}
            initial={{ y: "100%" }}
          />
        ))}
        {Array.from({ length: COLUMN_COUNT }, (_, i) => (
          <motion.div
            key={`surface-${i}`}
            className={s.columnSurface}
            custom={i}
            animate={surfaceControls}
            initial={{ y: initialLoadDoneRef.current ? "100%" : "0%" }}
          />
        ))}
      </div>
      <div
        className={[s.page, pageHidden && s.hidden].filter(Boolean).join(" ")}
      >
        <Outlet />
      </div>
    </>
  );
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
